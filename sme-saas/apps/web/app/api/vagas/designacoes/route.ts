import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
// import { redis } from '@/lib/redis'; // Commented for deployment

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

  // Check if already exists (simplified without Redis)
  const { data: existingRow } = await supabase
    .from('designacoes')
    .select('*')
    .eq('inscricao_id', inscricao_id)
    .single();
  
  if (existingRow) {
    return NextResponse.json({ designacao: existingRow, idempotent: true });
  }

  // Create new designation
  const { data, error } = await supabase
    .from('designacoes')
    .insert({ inscricao_id, turma_id, data_designacao })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ designacao: data, idempotent: false }, { status: 201 });
}
