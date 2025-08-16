import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Returns aggregated average grade per aluno for a turma/componente across etapa(s)
// Query params: turma_id (required), componente_id (optional), etapa (optional)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const turma_id = searchParams.get('turma_id');
  if (!turma_id) return NextResponse.json({ error: 'turma_id required' }, { status: 400 });
  const componente_id = searchParams.get('componente_id');
  const etapa = searchParams.get('etapa');

  // Build dynamic RPC via SQL view approach (fallback: client aggregate)
  let query = supabase
    .from('notas')
    .select('valor, aluno_id, avaliacao:avaliacao_id(id, turma_id, componente_id, etapa)');
  if (etapa) query = query.eq('avaliacao.etapa', etapa);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error }, { status: 500 });
  const filtrado = data.filter(r => (r as any).avaliacao.turma_id === turma_id && (!componente_id || (r as any).avaliacao.componente_id === componente_id));
  const mapa: Record<string, { soma: number; count: number }> = {};
  filtrado.forEach(r => {
    const aluno = (r as any).aluno_id as string;
    if (!mapa[aluno]) mapa[aluno] = { soma: 0, count: 0 };
    mapa[aluno].soma += Number((r as any).valor || 0);
    mapa[aluno].count += 1;
  });
  const resultado = Object.entries(mapa).map(([aluno_id, v]) => ({ aluno_id, media: v.count ? v.soma / v.count : 0 }));
  return NextResponse.json({ medias: resultado });
}
