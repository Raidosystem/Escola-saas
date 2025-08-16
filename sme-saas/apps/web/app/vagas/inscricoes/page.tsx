import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function InscricoesPage() {
  const { data: inscricoes } = await supabase.from('inscricoes').select('id, pessoa_id, data_inscricao, status');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Pessoa', accessorKey: 'pessoa_id' },
    { header: 'Data', accessorKey: 'data_inscricao' },
    { header: 'Status', accessorKey: 'status' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inscrições</h1>
      <DataTable columns={columns} data={inscricoes || []} />
    </main>
  );
}
