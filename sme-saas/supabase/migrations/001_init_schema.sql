-- SME SaaS - Migration 001: Schema + RLS

-- Tenants
create table tenants (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz default now()
);

-- Usuários
create table users (
  id uuid primary key,
  tenant_id uuid references tenants(id) not null,
  email text not null unique,
  nome text not null,
  role text not null, -- admin, secretaria, diretor, professor, responsavel, aluno, nutricionista, bibliotecario, instrutor
  created_at timestamptz default now()
);

-- Escolas
create table escolas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text not null,
  codigo text,
  endereco text,
  created_at timestamptz default now()
);

-- Exemplo de RLS multitenant
alter table users enable row level security;
create policy "Users: tenant only" on users for select using (tenant_id = auth.jwt() ->> 'tenant_id');

-- Função auth_tenant_id
create or replace function auth_tenant_id() returns uuid as $$
begin
  return (auth.jwt() ->> 'tenant_id')::uuid;
end;
$$ language plpgsql security definer;

-- Adicione aqui as demais tabelas e políticas conforme o escopo do projeto.
-- ...
