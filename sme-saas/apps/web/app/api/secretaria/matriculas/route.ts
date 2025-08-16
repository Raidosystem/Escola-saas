import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const MatriculaSchema = z.object({
  aluno_id: z.string().uuid(),
  turma_id: z.string().uuid(),
  status: z.string(),
  data_matricula: z.string().date(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = MatriculaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { aluno_id, turma_id, status, data_matricula } = parsed.data;
  const { data, error } = await supabase.from('matriculas').insert({ aluno_id, turma_id, status, data_matricula });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ matricula: data }, { status: 201 });
}
