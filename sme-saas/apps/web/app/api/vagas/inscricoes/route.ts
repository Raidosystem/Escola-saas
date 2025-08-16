import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const InscricaoSchema = z.object({
  pessoa_id: z.string().uuid(),
  data_inscricao: z.string().date(),
  status: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = InscricaoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { pessoa_id, data_inscricao, status } = parsed.data;
  const { data, error } = await supabase.from('inscricoes').insert({ pessoa_id, data_inscricao, status });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ inscricao: data }, { status: 201 });
}
