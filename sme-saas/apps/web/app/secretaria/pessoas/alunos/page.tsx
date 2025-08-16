'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAlunos() {
      const { data } = await supabase.from('alunos').select('id, nome');
      setAlunos(data || []);
    }
    fetchAlunos();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alunos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td className="px-4 py-2">{aluno.id}</td>
                <td className="px-4 py-2">{aluno.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
