import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
// import { redis } from '@/lib/redis'; // Comentado para deploy

const FrequenciaLoteSchema = z.object({
  turma_id: z.string().uuid(),
  data: z.string().date(),
  etapa: z.number(),
  alunos: z.array(z.object({
    aluno_id: z.string().uuid(),
    presente: z.boolean(),
  })),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = FrequenciaLoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { turma_id, data, etapa, alunos } = parsed.data;
  const { data: freq, error } = await supabase
    .from('frequencias')
    .insert([{ turma_id, data, etapa }])
    .select('id')
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  const freq_id = freq.id;
  const rows = alunos.map(a => ({ frequencia_id: freq_id, aluno_id: a.aluno_id, presente: a.presente }));
  const { error: errorAlunos } = await supabase.from('frequencias_alunos').insert(rows);
  if (errorAlunos) return NextResponse.json({ error: errorAlunos }, { status: 500 });
  // Publish realtime event (lightweight payload)
  try {
    // await redis.publish(`frequencia:${turma_id}`, JSON.stringify({ frequencia_id: freq_id, turma_id, data, etapa }));
    console.log('Redis publish skipped for deployment');
  } catch (e) {
    // log silently; not blocking response
    console.error('redis publish error', e);
  }
  return NextResponse.json({ ok: true });
}

// List frequencies for a turma (optionally by date range)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const turma_id = searchParams.get('turma_id');
  if (!turma_id) return NextResponse.json({ error: 'turma_id required' }, { status: 400 });
  const data_inicio = searchParams.get('data_inicio');
  const data_fim = searchParams.get('data_fim');
  let freqQuery = supabase.from('frequencias').select('id,turma_id,data,etapa');
  freqQuery = freqQuery.eq('turma_id', turma_id);
  if (data_inicio) freqQuery = freqQuery.gte('data', data_inicio);
  if (data_fim) freqQuery = freqQuery.lte('data', data_fim);
  const { data: freqList, error } = await freqQuery.order('data');
  if (error) return NextResponse.json({ error }, { status: 500 });
  if (!freqList?.length) return NextResponse.json({ frequencias: [] });
  // fetch alunos presence per frequency
  const ids = freqList.map(f => f.id);
  const { data: presencas, error: errPres } = await supabase
    .from('frequencias_alunos')
    .select('frequencia_id,aluno_id,presente')
    .in('frequencia_id', ids);
  if (errPres) return NextResponse.json({ error: errPres }, { status: 500 });
  const agrupado = freqList.map(f => ({ ...f, alunos: presencas?.filter(p => p.frequencia_id === f.id) || [] }));
  return NextResponse.json({ frequencias: agrupado });
}
