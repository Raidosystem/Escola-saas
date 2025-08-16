from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
import os
import asyncpg
from typing import List, Optional
from datetime import date

DATABASE_URL = os.getenv("REPORTING_DATABASE_URL")
if not DATABASE_URL:
    # Expect a full Postgres URL; in dev maybe reuse Supabase connection string
    DATABASE_URL = os.getenv("SUPABASE_DB_URL", "")

app = FastAPI(title="SME Reporting Service")

REPORTING_AUTH_TOKEN = os.getenv("REPORTING_AUTH_TOKEN")

async def verify_auth(authorization: str | None = Header(None)):
    if not REPORTING_AUTH_TOKEN:
        return  # auth disabled (dev)
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if token != REPORTING_AUTH_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    return True

_pool: asyncpg.Pool | None = None

async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        if not DATABASE_URL:
            raise RuntimeError("DATABASE_URL not configured")
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    return _pool

class MediaAluno(BaseModel):
    aluno_id: str
    media: float

class FechamentoResponse(BaseModel):
    turma_id: str
    etapa: int
    medias: List[MediaAluno]

class FechamentoRequest(BaseModel):
    turma_id: str
    etapa: int
    componente_id: Optional[str] = None

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/fechamento", response_model=FechamentoResponse, dependencies=[Depends(verify_auth)])
async def fechamento(req: FechamentoRequest, pool: asyncpg.Pool = Depends(get_pool)):
    # Query médias directly in SQL for performance
    sql = """
    select n.aluno_id, avg(n.valor)::float as media
    from notas n
    join avaliacoes a on a.id = n.avaliacao_id
    where a.turma_id = $1 and a.etapa = $2
    {componente}
    group by n.aluno_id
    """
    componente_filter = ""
    params = [req.turma_id, req.etapa]
    if req.componente_id:
        componente_filter = "and a.componente_id = $3"
        params.append(req.componente_id)
    rows = await pool.fetch(sql.format(componente=componente_filter), *params)
    medias = [MediaAluno(aluno_id=r["aluno_id"], media=r["media"]) for r in rows]
    return FechamentoResponse(turma_id=req.turma_id, etapa=req.etapa, medias=medias)

# PDF simple demo (placeholder)
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.pdfgen import canvas

@app.get("/relatorio/matriculas.pdf", dependencies=[Depends(verify_auth)])
async def relatorio_matriculas(pool: asyncpg.Pool = Depends(get_pool)):
    sql = """
    select m.id, m.aluno_id, m.turma_id, m.status
    from matriculas m
    limit 50
    """
    rows = await pool.fetch(sql)
    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(50, 800, "Relatório de Matrículas (demo)")
    y = 780
    for r in rows:
        c.drawString(50, y, f"{r['id']} - {r['aluno_id']} - {r['turma_id']} - {r['status']}")
        y -= 14
        if y < 40:
            c.showPage()
            y = 800
    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=matriculas.pdf"})

# Excel simple demo
import openpyxl
@app.get("/relatorio/notas.xlsx", dependencies=[Depends(verify_auth)])
async def relatorio_notas(pool: asyncpg.Pool = Depends(get_pool)):
    sql = """
    select a.turma_id, n.aluno_id, avg(n.valor)::float as media
    from notas n
    join avaliacoes a on a.id = n.avaliacao_id
    group by a.turma_id, n.aluno_id
    limit 200
    """
    rows = await pool.fetch(sql)
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Notas"
    ws.append(["turma_id", "aluno_id", "media"])
    for r in rows:
        ws.append([r["turma_id"], r["aluno_id"], r["media"]])
    out = BytesIO()
    wb.save(out)
    out.seek(0)
    return StreamingResponse(out, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=notas.xlsx"})

@app.on_event("shutdown")
async def shutdown():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
