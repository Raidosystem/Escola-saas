import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const RotaSchema = z.object({
  nome: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = RotaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { nome } = parsed.data;
  const { data, error } = await supabase.from('rotas').insert({ nome });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ rota: data }, { status: 201 });
}
