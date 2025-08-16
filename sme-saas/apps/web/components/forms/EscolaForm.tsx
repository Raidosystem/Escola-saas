import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  codigo: z.string().min(1, 'Código obrigatório'),
  endereco: z.string().min(2, 'Endereço obrigatório'),
});

type FormData = z.infer<typeof schema>;

export function EscolaForm({ onSubmit, initialData }: { onSubmit: (data: FormData) => void, initialData?: Partial<FormData> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: initialData });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Nome</label>
        <input {...register('nome')} className="input" />
        {errors.nome && <span className="text-red-500">{errors.nome.message}</span>}
      </div>
      <div>
        <label className="block">Código</label>
        <input {...register('codigo')} className="input" />
        {errors.codigo && <span className="text-red-500">{errors.codigo.message}</span>}
      </div>
      <div>
        <label className="block">Endereço</label>
        <input {...register('endereco')} className="input" />
        {errors.endereco && <span className="text-red-500">{errors.endereco.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary">Salvar</button>
    </form>
  );
}
