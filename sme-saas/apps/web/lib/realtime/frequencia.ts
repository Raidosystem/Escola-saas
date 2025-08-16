import { supabase } from '@/lib/supabase';

export type FrequenciaEvento = {
  frequencia_id: string;
  turma_id: string;
  data: string;
  aluno_id: string;
  presente: boolean;
};

// Subscribe to realtime changes for frequencias_alunos join (requires Realtime enabled in Supabase)
export function subscribeFrequencia(turma_id: string, callback: (ev: FrequenciaEvento) => void) {
  const channel = supabase
    .channel(`frequencia:${turma_id}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'frequencias_alunos' },
      payload => {
        const row: any = payload.new || payload.old;
        if (!row) return;
        callback({
          frequencia_id: row.frequencia_id,
            turma_id, // we rely on separate fetch to map; could join via view if needed
          data: new Date().toISOString(),
          aluno_id: row.aluno_id,
          presente: row.presente,
        });
      }
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
