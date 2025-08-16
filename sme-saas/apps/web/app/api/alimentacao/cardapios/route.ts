import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const CardapioSchema = z.object({
  data_inicio: z.string().date(),
  data_fim: z.string().date(),
  descricao: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CardapioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { data_inicio, data_fim, descricao } = parsed.data;
  const { data, error } = await supabase.from('cardapios').insert({ data_inicio, data_fim, descricao });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ cardapio: data }, { status: 201 });
}
