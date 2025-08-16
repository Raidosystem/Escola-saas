import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/DataTable';

export default async function MatriculasPage() {
  const { data: matriculas } = await supabase.from('matriculas').select('id, aluno_id, turma_id, status, data_matricula');
  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Aluno', accessorKey: 'aluno_id' },
    { header: 'Turma', accessorKey: 'turma_id' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Data Matrícula', accessorKey: 'data_matricula' },
  ];
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Matrículas</h1>
      <DataTable columns={columns} data={matriculas || []} />
    </main>
  );
}
