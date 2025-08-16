import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function AlunosPage() {
  const { data: alunos } = await supabase.from('alunos').select('id, nome');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nome', accessorKey: 'nome' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alunos</h1>
      <DataTable columns={columns} data={alunos || []} />
    </main>
  );
}
