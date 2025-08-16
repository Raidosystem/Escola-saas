'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatriculas() {
      const { data } = await supabase.from('matriculas').select('id, aluno_id, turma_id, status, data_matricula');
      setMatriculas(data || []);
    }
    fetchMatriculas();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matrículas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Matrícula</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((matricula) => (
              <tr key={matricula.id}>
                <td className="px-4 py-2">{matricula.id}</td>
                <td className="px-4 py-2">{matricula.aluno_id}</td>
                <td className="px-4 py-2">{matricula.turma_id}</td>
                <td className="px-4 py-2">{matricula.status}</td>
                <td className="px-4 py-2">{matricula.data_matricula}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
