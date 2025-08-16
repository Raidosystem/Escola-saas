import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const EscolaSchema = z.object({
  nome: z.string().min(2),
  codigo: z.string().min(1),
  endereco: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = EscolaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { nome, codigo, endereco } = parsed.data;
  const { data, error } = await supabase.from('escolas').insert({ nome, codigo, endereco });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ escola: data }, { status: 201 });
}
