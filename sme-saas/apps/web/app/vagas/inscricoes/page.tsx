'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function InscricoesPage() {
  const [inscricoes, setInscricoes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInscricoes() {
      const { data } = await supabase.from('inscricoes').select('id, pessoa_id, data_inscricao, status');
      setInscricoes(data || []);
    }
    fetchInscricoes();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inscrições</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pessoa</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map((inscricao) => (
              <tr key={inscricao.id}>
                <td className="px-4 py-2">{inscricao.id}</td>
                <td className="px-4 py-2">{inscricao.pessoa_id}</td>
                <td className="px-4 py-2">{inscricao.data_inscricao}</td>
                <td className="px-4 py-2">{inscricao.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
