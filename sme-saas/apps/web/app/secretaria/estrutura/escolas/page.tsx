'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EscolaForm } from '@/components/forms/EscolaForm';

export default function EscolasPage() {
  const [escolas, setEscolas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEscolas() {
      const { data } = await supabase.from('escolas').select('id, nome, codigo, endereco');
      setEscolas(data || []);
    }
    fetchEscolas();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Escolas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
            </tr>
          </thead>
          <tbody>
            {escolas.map((escola) => (
              <tr key={escola.id}>
                <td className="px-4 py-2">{escola.id}</td>
                <td className="px-4 py-2">{escola.nome}</td>
                <td className="px-4 py-2">{escola.codigo}</td>
                <td className="px-4 py-2">{escola.endereco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Nova Escola</h2>
        <EscolaForm onSubmit={async (data) => {
          await fetch('/api/secretaria/estrutura/escolas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          // Recarregar lista após inserção
          const { data: newData } = await supabase.from('escolas').select('id, nome, codigo, endereco');
          setEscolas(newData || []);
        }} />
      </div>
    </main>
  );
}
