import FrequenciaRealtimeClient from './realtime-client';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function FrequenciaPage() {
  const { data: frequencias } = await supabase.from('frequencias').select('id, turma_id, data, etapa').limit(50);
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Turma', accessorKey: 'turma_id' },
    { header: 'Data', accessorKey: 'data' },
    { header: 'Etapa', accessorKey: 'etapa' },
  ];
  return (
    <main className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Frequências</h1>
        <DataTable columns={columns} data={frequencias || []} />
      </div>
      <FrequenciaRealtimeClient />
    </main>
  );
}
