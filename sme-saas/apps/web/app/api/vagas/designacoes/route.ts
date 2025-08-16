import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';

// Idempotent designacao endpoint: uses Redis lock to avoid double assignment.
const DesignacaoSchema = z.object({
  inscricao_id: z.string().uuid(),
  turma_id: z.string().uuid(),
  data_designacao: z.string().date(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = DesignacaoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { inscricao_id, turma_id, data_designacao } = parsed.data;

  const lockKey = `designacao:lock:${inscricao_id}`;
  const existing = await redis.get<string>(lockKey);
  if (existing) {
    // already processed; return the existing designacao if present
    const { data: existingRow } = await supabase
      .from('designacoes')
      .select('*')
      .eq('inscricao_id', inscricao_id)
      .single();
    return NextResponse.json({ designacao: existingRow, idempotent: true });
  }

  // Set a short TTL lock (30s)
  await redis.set(lockKey, '1', { ex: 30, nx: true });

  // Ensure not already assigned at DB layer
  const { data: jaExiste } = await supabase
    .from('designacoes')
    .select('id')
    .eq('inscricao_id', inscricao_id)
    .maybeSingle();
  if (jaExiste) {
    return NextResponse.json({ designacao: jaExiste, idempotent: true });
  }

  const { data, error } = await supabase
    .from('designacoes')
    .insert({ inscricao_id, turma_id, data_designacao })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ designacao: data, idempotent: false }, { status: 201 });
}
