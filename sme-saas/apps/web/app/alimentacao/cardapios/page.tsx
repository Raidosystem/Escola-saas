import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function CardapiosPage() {
  const { data: cardapios } = await supabase.from('cardapios').select('id, data_inicio, data_fim, descricao');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Início', accessorKey: 'data_inicio' },
    { header: 'Fim', accessorKey: 'data_fim' },
    { header: 'Descrição', accessorKey: 'descricao' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cardápios</h1>
      <DataTable columns={columns} data={cardapios || []} />
    </main>
  );
}
