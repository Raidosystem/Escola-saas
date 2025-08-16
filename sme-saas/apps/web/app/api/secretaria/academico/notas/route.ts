import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Batch upsert notas for an avaliacao
const NotaBatchSchema = z.object({
  avaliacao_id: z.string().uuid(),
  notas: z.array(z.object({
    aluno_id: z.string().uuid(),
    valor: z.number().min(0).max(10),
  })).min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = NotaBatchSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { avaliacao_id, notas } = parsed.data;
  // Upsert strategy: delete existing for avaliacao then insert new (simpler; could use merge)
  const { error: delError } = await supabase.from('notas').delete().eq('avaliacao_id', avaliacao_id);
  if (delError) return NextResponse.json({ error: delError }, { status: 500 });
  const rows = notas.map(n => ({ avaliacao_id, aluno_id: n.aluno_id, valor: n.valor }));
  const { error: insError } = await supabase.from('notas').insert(rows);
  if (insError) return NextResponse.json({ error: insError }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Get notas by avaliacao or aluno
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const avaliacao_id = searchParams.get('avaliacao_id');
  const aluno_id = searchParams.get('aluno_id');
  if (!avaliacao_id && !aluno_id) {
    return NextResponse.json({ error: 'avaliacao_id or aluno_id required' }, { status: 400 });
  }
  let query = supabase.from('notas').select('*');
  if (avaliacao_id) query = query.eq('avaliacao_id', avaliacao_id);
  if (aluno_id) query = query.eq('aluno_id', aluno_id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ notas: data });
}
