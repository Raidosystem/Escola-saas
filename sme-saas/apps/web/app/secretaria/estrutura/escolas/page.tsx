import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';
import { EscolaForm } from '@/components/forms/EscolaForm';

export default async function EscolasPage() {
  const { data: escolas } = await supabase.from('escolas').select('id, nome, codigo, endereco');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nome', accessorKey: 'nome' },
    { header: 'Código', accessorKey: 'codigo' },
    { header: 'Endereço', accessorKey: 'endereco' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Escolas</h1>
      <DataTable columns={columns} data={escolas || []} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Nova Escola</h2>
        <EscolaForm onSubmit={async (data) => {
          await fetch('/api/secretaria/estrutura/escolas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }} />
      </div>
    </main>
  );
}
