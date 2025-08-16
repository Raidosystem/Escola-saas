'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CardapiosPage() {
  const [cardapios, setCardapios] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCardapios() {
      const { data } = await supabase.from('cardapios').select('id, data_inicio, data_fim, descricao');
      setCardapios(data || []);
    }
    fetchCardapios();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cardápios</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fim</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {cardapios.map((cardapio) => (
              <tr key={cardapio.id}>
                <td className="px-4 py-2">{cardapio.id}</td>
                <td className="px-4 py-2">{cardapio.data_inicio}</td>
                <td className="px-4 py-2">{cardapio.data_fim}</td>
                <td className="px-4 py-2">{cardapio.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
