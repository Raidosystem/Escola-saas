import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Batch matriculas creation with basic integrity checks
const MatriculasBatchSchema = z.object({
  turma_id: z.string().uuid(),
  registros: z.array(z.object({
    aluno_id: z.string().uuid(),
    status: z.string().default('ativa'),
    data_matricula: z.string().date(),
  })).min(1),
  replaceExisting: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = MatriculasBatchSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { turma_id, registros, replaceExisting } = parsed.data;

  // Optionally remove existing matriculas of provided alunos in this turma to avoid duplicates
  if (replaceExisting) {
    const ids = registros.map(r => r.aluno_id);
    const { error: delError } = await supabase.from('matriculas').delete().in('aluno_id', ids).eq('turma_id', turma_id);
    if (delError) return NextResponse.json({ error: delError }, { status: 500 });
  } else {
    // Check duplicates
    const ids = registros.map(r => r.aluno_id);
    const { data: existing, error: existError } = await supabase
      .from('matriculas')
      .select('aluno_id')
      .eq('turma_id', turma_id)
      .in('aluno_id', ids);
    if (existError) return NextResponse.json({ error: existError }, { status: 500 });
    if (existing && existing.length) {
      return NextResponse.json({ error: 'Duplicate alunos already matriculated', duplicates: existing.map(e => e.aluno_id) }, { status: 409 });
    }
  }

  const rows = registros.map(r => ({
    turma_id,
    aluno_id: r.aluno_id,
    status: r.status,
    data_matricula: r.data_matricula,
  }));
  const { data, error } = await supabase.from('matriculas').insert(rows).select('*');
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ inserted: data.length });
}
