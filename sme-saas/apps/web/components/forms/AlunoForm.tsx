import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  data_nascimento: z.string().min(10, 'Data obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function AlunoForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Nome</label>
        <input {...register('nome')} className="input" />
        {errors.nome && <span className="text-red-500">{errors.nome.message}</span>}
      </div>
      <div>
        <label className="block">Data de Nascimento</label>
        <input type="date" {...register('data_nascimento')} className="input" />
        {errors.data_nascimento && <span className="text-red-500">{errors.data_nascimento.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary">Salvar</button>
    </form>
  );
}
