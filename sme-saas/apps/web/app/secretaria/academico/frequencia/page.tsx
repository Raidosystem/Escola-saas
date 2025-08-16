'use client';

import { useState, useEffect } from 'react';
import FrequenciaRealtimeClient from './realtime-client';
import { supabase } from '@/lib/supabase';

export default function FrequenciaPage() {
  const [frequencias, setFrequencias] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFrequencias() {
      const { data } = await supabase.from('frequencias').select('id, turma_id, data, etapa').limit(50);
      setFrequencias(data || []);
    }
    fetchFrequencias();
  }, []);

  return (
    <main className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Frequências</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Etapa</th>
              </tr>
            </thead>
            <tbody>
              {frequencias.map((frequencia) => (
                <tr key={frequencia.id}>
                  <td className="px-4 py-2">{frequencia.id}</td>
                  <td className="px-4 py-2">{frequencia.turma_id}</td>
                  <td className="px-4 py-2">{frequencia.data}</td>
                  <td className="px-4 py-2">{frequencia.etapa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FrequenciaRealtimeClient />
    </main>
  );
}
