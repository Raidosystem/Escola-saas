import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function RotasPage() {
  const { data: rotas } = await supabase.from('rotas').select('id, nome');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nome', accessorKey: 'nome' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rotas</h1>
      <DataTable columns={columns} data={rotas || []} />
    </main>
  );
}
