"use client";
import React, { useState } from 'react';
import { useFrequenciaRealtime } from '@/lib/hooks/useFrequenciaRealtime';

export default function FrequenciaRealtimeClient() {
  const [turmaId, setTurmaId] = useState('');
  const { eventos } = useFrequenciaRealtime(turmaId || undefined, {});
  return (
    <div className="border rounded p-4 bg-white/60 dark:bg-neutral-900/40">
      <h2 className="text-lg font-semibold mb-3">Realtime</h2>
      <div className="flex gap-3 mb-3 items-end">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1">Turma ID</label>
          <input value={turmaId} onChange={e=>setTurmaId(e.target.value)} placeholder="uuid turma" className="border rounded px-2 py-1 w-72" />
        </div>
      </div>
      {turmaId ? (
        <ul className="text-xs font-mono space-y-1 max-h-56 overflow-auto">
          {eventos.map(ev => (
            <li key={ev.frequencia_id+ev.data}>{ev.data} turma {ev.turma_id} freq {ev.frequencia_id} etapa {ev.etapa}</li>
          ))}
          {!eventos.length && <li>Nenhum evento recebido ainda.</li>}
        </ul>
      ) : (
        <p className="text-xs text-neutral-500">Informe uma Turma para iniciar.</p>
      )}
    </div>
  );
}
