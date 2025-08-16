import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const AlunoSchema = z.object({
  nome: z.string().min(2),
  data_nascimento: z.string().date(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = AlunoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { nome, data_nascimento } = parsed.data;
  const { data, error } = await supabase.from('pessoas').insert({ tipo: 'aluno', nome, data_nascimento });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ aluno: data }, { status: 201 });
}
