import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Create an avaliacao (assessment)
const AvaliacaoSchema = z.object({
  turma_id: z.string().uuid(),
  componente_id: z.string().uuid(),
  etapa: z.number().int(),
  data: z.string().date(),
  descricao: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = AvaliacaoSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { turma_id, componente_id, etapa, data, descricao } = parsed.data;
  const { data: inserted, error } = await supabase
    .from('avaliacoes')
    .insert({ turma_id, componente_id, etapa, data, descricao })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ avaliacao: inserted }, { status: 201 });
}

// List assessments for a turma
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const turma_id = searchParams.get('turma_id');
  if (!turma_id) return NextResponse.json({ error: 'turma_id required' }, { status: 400 });
  const { data, error } = await supabase.from('avaliacoes').select('*').eq('turma_id', turma_id).order('data');
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ avaliacoes: data });
}
