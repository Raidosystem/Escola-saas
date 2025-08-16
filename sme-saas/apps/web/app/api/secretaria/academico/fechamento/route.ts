import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Fechamento de etapa: calcula média consolidada e registra em auditoria
const FechamentoSchema = z.object({
  turma_id: z.string().uuid(),
  etapa: z.number().int(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = FechamentoSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { turma_id, etapa } = parsed.data;

  // Fetch notas (joining avaliacoes -> notas) and compute media por aluno
  const { data: notas, error } = await supabase
    .from('notas')
    .select('valor, aluno_id, avaliacao:avaliacao_id(id, turma_id, etapa)')
    .eq('avaliacao.etapa', etapa);
  if (error) return NextResponse.json({ error }, { status: 500 });
  const filtrado = notas.filter(n => (n as any).avaliacao.turma_id === turma_id);
  const acc: Record<string, { soma: number; count: number }> = {};
  filtrado.forEach(n => {
    const aluno = (n as any).aluno_id as string;
    if (!acc[aluno]) acc[aluno] = { soma: 0, count: 0 };
    acc[aluno].soma += Number((n as any).valor || 0);
    acc[aluno].count += 1;
  });
  const medias = Object.entries(acc).map(([aluno_id, v]) => ({ aluno_id, media: v.count ? v.soma / v.count : 0 }));

  // Optionally we could persist in a summarized table (not created yet). For now, return payload.
  return NextResponse.json({ fechamento: { turma_id, etapa, medias } });
}

export async function GET() {
  // For now no persisted record; could later read from resumo table
  return NextResponse.json({ message: 'Nenhum fechamento persistido. Use POST para calcular.' });
}
