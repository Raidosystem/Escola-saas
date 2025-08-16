import { supabase } from './supabase';

// Helper to subscribe to frequencia updates (client-side usage)
export function subscribeFrequencia(turma_id: string, cb: (payload: any) => void) {
  const channel = supabase
    .channel(`frequencias:${turma_id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'frequencias', filter: `turma_id=eq.${turma_id}` }, (payload) => {
      cb(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'frequencias_alunos' }, (payload) => {
      cb(payload);
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
