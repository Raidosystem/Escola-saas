import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Create or update conselho (class council decision) for etapa
const ConselhoSchema = z.object({
  turma_id: z.string().uuid(),
  etapa: z.number().int(),
  parecer: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = ConselhoSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { turma_id, etapa, parecer } = parsed.data;

  // Upsert logic: remove existing for turma+etapa then insert new
  const { error: delError } = await supabase.from('conselhos').delete().eq('turma_id', turma_id).eq('etapa', etapa);
  if (delError) return NextResponse.json({ error: delError }, { status: 500 });
  const { data, error } = await supabase.from('conselhos').insert({ turma_id, etapa, parecer }).select('*').single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ conselho: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const turma_id = searchParams.get('turma_id');
  if (!turma_id) return NextResponse.json({ error: 'turma_id required' }, { status: 400 });
  const etapa = searchParams.get('etapa');
  let query = supabase.from('conselhos').select('*').eq('turma_id', turma_id);
  if (etapa) query = query.eq('etapa', etapa);
  const { data, error } = await query.order('etapa');
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ conselhos: data });
}
