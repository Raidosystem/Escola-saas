-- Seed 002: Dados de demonstração ampliados
-- Assumindo tenant e escola já criados em seed anterior

-- Pessoas (alunos)
insert into pessoas (id, tenant_id, tipo, nome, data_nascimento) values
  (gen_random_uuid(), (select id from tenants limit 1), 'aluno', 'Aluno Demo 1', '2015-02-10'),
  (gen_random_uuid(), (select id from tenants limit 1), 'aluno', 'Aluno Demo 2', '2014-07-21'),
  (gen_random_uuid(), (select id from tenants limit 1), 'aluno', 'Aluno Demo 3', '2013-05-03')
  on conflict do nothing;

-- Vincular a tabela alunos
insert into alunos (id, matricula)
  select id, 'MAT-'||substr(id::text,1,8)
  from pessoas p where p.tipo='aluno'
  on conflict do nothing;

-- Série / componente / turma
insert into series (tenant_id, nome) values ((select id from tenants limit 1), '5º Ano') on conflict do nothing;
insert into componentes (tenant_id, nome) values ((select id from tenants limit 1), 'Matemática') on conflict do nothing;

-- Criar turma se não existir
insert into turmas (tenant_id, escola_id, serie_id, nome, turno)
select (select id from tenants limit 1), (select id from escolas limit 1), (select id from series limit 1), 'TURMA A', 'manhã'
where not exists (select 1 from turmas where nome='TURMA A');

-- Matrículas básicas
insert into matriculas (aluno_id, turma_id, status, data_matricula)
select a.id, (select id from turmas where nome='TURMA A' limit 1), 'ativa', current_date
from alunos a
where not exists (
  select 1 from matriculas m where m.aluno_id = a.id and m.turma_id = (select id from turmas where nome='TURMA A' limit 1)
);

-- Professor demo (user) vinculado a turma (pressupõe user com role professor)
-- Ajuste o ID do usuário professor real conforme necessário
-- insert into professores_turmas (professor_id, turma_id) values ('<professor-user-id>', (select id from turmas where nome='TURMA A' limit 1)) on conflict do nothing;

-- Avaliação e notas exemplo
insert into avaliacoes (turma_id, componente_id, etapa, data, descricao)
select t.id, (select id from componentes limit 1), 1, current_date - interval '1 day', 'Avaliação Diagnóstica'
from turmas t where t.nome='TURMA A' and not exists (select 1 from avaliacoes a where a.turma_id=t.id and a.etapa=1);

insert into notas (avaliacao_id, aluno_id, valor)
select a.id, m.aluno_id, (random()*5 + 5)::numeric(5,2)
from avaliacoes a
join matriculas m on m.turma_id = a.turma_id
where not exists (
  select 1 from notas n where n.avaliacao_id = a.id and n.aluno_id = m.aluno_id
);

-- Frequência de exemplo
insert into frequencias (turma_id, data, etapa)
select t.id, current_date, 1 from turmas t where t.nome='TURMA A' and not exists (select 1 from frequencias f where f.turma_id=t.id and f.data=current_date);

insert into frequencias_alunos (frequencia_id, aluno_id, presente)
select f.id, m.aluno_id, (random()>0.1) as presente
from frequencias f
join matriculas m on m.turma_id = f.turma_id
where not exists (
  select 1 from frequencias_alunos fa where fa.frequencia_id=f.id and fa.aluno_id=m.aluno_id
);
