-- Migration 003: Funções e Políticas RLS detalhadas por papel

-- Função padrão para extrair tenant
create or replace function auth_tenant_id() returns uuid as $$
  select (auth.jwt() ->> 'tenant_id')::uuid;
$$ language sql stable;

-- Função para extrair role
create or replace function auth_role() returns text as $$
  select coalesce(auth.jwt() ->> 'role', 'aluno');
$$ language sql stable;

-- Helpers de papel
create or replace function is_role(expected text) returns boolean as $$
  select auth_role() = expected;
$$ language sql stable;

create or replace function has_any_role(expected text[]) returns boolean as $$
  select auth_role() = any(expected);
$$ language sql stable;

-- Professor pode acessar turmas que ministra (tabela relacao professor_turma)
create table if not exists professores_turmas (
  professor_id uuid references users(id) on delete cascade,
  turma_id uuid references turmas(id) on delete cascade,
  primary key (professor_id, turma_id)
);

-- View auxiliar para acesso professor
create or replace view vw_professor_turmas as
  select pt.professor_id, t.id as turma_id, t.tenant_id
  from professores_turmas pt
  join turmas t on t.id = pt.turma_id;

-- Políticas genéricas por tenant (leitura)
-- Macro generation (exemplo manual em algumas tabelas)
alter table escolas enable row level security;
create policy "escolas_select_tenant" on escolas for select using (tenant_id = auth_tenant_id());
create policy "escolas_mod_tenant_admin" on escolas for all using (
  tenant_id = auth_tenant_id() and has_any_role(array['admin','secretaria','diretor'])
) with check (
  tenant_id = auth_tenant_id()
);

alter table turmas enable row level security;
create policy "turmas_select_role" on turmas for select using (
  tenant_id = auth_tenant_id() and (
    has_any_role(array['admin','secretaria','diretor'])
    or (auth_role()='professor' and exists (select 1 from vw_professor_turmas v where v.turma_id = turmas.id and v.professor_id = (auth.jwt()->>'sub')::uuid))
  )
);
create policy "turmas_mod_admin" on turmas for all using (
  tenant_id = auth_tenant_id() and has_any_role(array['admin','secretaria','diretor'])
) with check (tenant_id = auth_tenant_id());

alter table matriculas enable row level security;
create policy "matriculas_select_multi" on matriculas for select using (
  exists (
    select 1 from turmas t where t.id = matriculas.turma_id and t.tenant_id = auth_tenant_id()
  ) and (
    has_any_role(array['admin','secretaria','diretor','professor'])
    or (auth_role()='responsavel' and exists (select 1 from aluno_responsavel ar where ar.aluno_id = matriculas.aluno_id and ar.responsavel_id = (auth.jwt()->>'sub')::uuid))
    or (auth_role()='aluno' and matriculas.aluno_id = (auth.jwt()->>'sub')::uuid)
  )
);
create policy "matriculas_insert_secretaria" on matriculas for insert with check (
  has_any_role(array['admin','secretaria']) and exists (
    select 1 from turmas t where t.id = matriculas.turma_id and t.tenant_id = auth_tenant_id()
  )
);
create policy "matriculas_update_secretaria" on matriculas for update using (
  has_any_role(array['admin','secretaria']) and exists (
    select 1 from turmas t where t.id = matriculas.turma_id and t.tenant_id = auth_tenant_id()
  )
);

alter table frequencias enable row level security;
create policy "frequencias_select" on frequencias for select using (
  exists (select 1 from turmas t where t.id = frequencias.turma_id and t.tenant_id = auth_tenant_id()) and (
    has_any_role(array['admin','secretaria','diretor','professor'])
    or (auth_role()='aluno' and exists (select 1 from matriculas m where m.turma_id = frequencias.turma_id and m.aluno_id = (auth.jwt()->>'sub')::uuid))
    or (auth_role()='responsavel' and exists (
      select 1 from matriculas m join aluno_responsavel ar on ar.aluno_id = m.aluno_id
      where m.turma_id = frequencias.turma_id and ar.responsavel_id = (auth.jwt()->>'sub')::uuid
    ))
  )
);
create policy "frequencias_insert_prof" on frequencias for insert with check (
  auth_role()='professor' and exists (
    select 1 from vw_professor_turmas v where v.turma_id = frequencias.turma_id and v.professor_id = (auth.jwt()->>'sub')::uuid
  )
);

alter table frequencias_alunos enable row level security;
create policy "frequencias_alunos_select" on frequencias_alunos for select using (
  exists (
    select 1 from frequencias f join turmas t on t.id = f.turma_id
    where f.id = frequencias_alunos.frequencia_id and t.tenant_id = auth_tenant_id()
  )
);
create policy "frequencias_alunos_mod_prof" on frequencias_alunos for all using (
  auth_role()='professor' and exists (
    select 1 from frequencias f join vw_professor_turmas v on v.turma_id = f.turma_id
    where f.id = frequencias_alunos.frequencia_id and v.professor_id = (auth.jwt()->>'sub')::uuid
  )
) with check (true);

-- Notas
alter table avaliacoes enable row level security;
create policy "avaliacoes_select" on avaliacoes for select using (
  exists (select 1 from turmas t where t.id = avaliacoes.turma_id and t.tenant_id = auth_tenant_id())
);
create policy "avaliacoes_insert_prof" on avaliacoes for insert with check (
  auth_role()='professor' and exists (select 1 from vw_professor_turmas v where v.turma_id = avaliacoes.turma_id and v.professor_id = (auth.jwt()->>'sub')::uuid)
);

alter table notas enable row level security;
create policy "notas_select" on notas for select using (true);
create policy "notas_insert_prof" on notas for insert with check (
  auth_role()='professor' and exists (
    select 1 from avaliacoes a join vw_professor_turmas v on v.turma_id = a.turma_id
    where a.id = notas.avaliacao_id and v.professor_id = (auth.jwt()->>'sub')::uuid
  )
);

-- Auditoria (somente leitura papéis elevados)
alter table auditoria_eventos enable row level security;
create policy "auditoria_select" on auditoria_eventos for select using (has_any_role(array['admin','secretaria','diretor']));

-- END
