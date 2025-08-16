'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function RotasPage() {
  const [rotas, setRotas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRotas() {
      const { data } = await supabase.from('rotas').select('id, nome');
      setRotas(data || []);
    }
    fetchRotas();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rotas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            </tr>
          </thead>
          <tbody>
            {rotas.map((rota) => (
              <tr key={rota.id}>
                <td className="px-4 py-2">{rota.id}</td>
                <td className="px-4 py-2">{rota.nome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
