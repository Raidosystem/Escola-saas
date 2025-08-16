-- SME SaaS - Migration 002: Schema Completo + RLS + Views

-- Pessoas
create table pessoas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  tipo text not null, -- aluno, responsavel, servidor
  nome text not null,
  data_nascimento date,
  documento text,
  created_at timestamptz default now()
);

create table alunos (
  id uuid primary key references pessoas(id),
  matricula text unique,
  created_at timestamptz default now()
);

create table responsaveis (
  id uuid primary key references pessoas(id),
  created_at timestamptz default now()
);

create table servidores (
  id uuid primary key references pessoas(id),
  cargo text,
  created_at timestamptz default now()
);

create table aluno_responsavel (
  aluno_id uuid references alunos(id),
  responsavel_id uuid references responsaveis(id),
  primary key (aluno_id, responsavel_id)
);

-- Matrículas
create table matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid references alunos(id),
  turma_id uuid references turmas(id),
  status text,
  data_matricula date,
  created_at timestamptz default now()
);

create table transferencias (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid references matriculas(id),
  data_transferencia date,
  motivo text
);

create table vagas_turma (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references turmas(id),
  total int,
  ocupadas int default 0
);

-- Acadêmico
create table avaliacoes (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references turmas(id),
  componente_id uuid references componentes(id),
  etapa int,
  data date,
  descricao text
);

create table notas (
  id uuid primary key default gen_random_uuid(),
  avaliacao_id uuid references avaliacoes(id),
  aluno_id uuid references alunos(id),
  valor decimal(5,2)
);

create table frequencias (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references turmas(id),
  data date,
  etapa int,
  created_at timestamptz default now()
);

create table frequencias_alunos (
  frequencia_id uuid references frequencias(id),
  aluno_id uuid references alunos(id),
  presente boolean,
  primary key (frequencia_id, aluno_id)
);

create table conselhos (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references turmas(id),
  etapa int,
  parecer text,
  created_at timestamptz default now()
);

create table documentos_emitidos (
  id uuid primary key default gen_random_uuid(),
  pessoa_id uuid references pessoas(id),
  tipo text,
  url text,
  data_emissao date
);

-- Estrutura
create table calendarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  ano int,
  descricao text
);

create table series (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

create table componentes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

create table turmas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  escola_id uuid references escolas(id),
  serie_id uuid references series(id),
  nome text,
  turno text,
  created_at timestamptz default now()
);

create table horarios (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid references turmas(id),
  dia_semana int,
  horario_inicio time,
  horario_fim time
);

-- Vagas (fila única)
create table inscricoes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  pessoa_id uuid references pessoas(id),
  data_inscricao date,
  status text
);

create table lista_espera (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid references inscricoes(id),
  posicao int
);

create table designacoes (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid references inscricoes(id),
  turma_id uuid references turmas(id),
  data_designacao date
);

create table comunicacoes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  titulo text,
  mensagem text,
  data_envio date
);

-- Alimentação
create table cardapios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  data_inicio date,
  data_fim date,
  descricao text
);

create table restricoes_alimentares (
  id uuid primary key default gen_random_uuid(),
  pessoa_id uuid references pessoas(id),
  restricao text
);

create table estoque_generos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text,
  quantidade int
);

create table fichas_tecnicas (
  id uuid primary key default gen_random_uuid(),
  nome text,
  ingredientes text
);

create table refeicoes_diarias (
  id uuid primary key default gen_random_uuid(),
  cardapio_id uuid references cardapios(id),
  data date,
  descricao text
);

-- Transporte
create table rotas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

create table veiculos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  placa text,
  capacidade int
);

create table motoristas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text,
  cnh text
);

create table alunos_rota (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid references alunos(id),
  rota_id uuid references rotas(id)
);

create table viagens (
  id uuid primary key default gen_random_uuid(),
  rota_id uuid references rotas(id),
  veiculo_id uuid references veiculos(id),
  motorista_id uuid references motoristas(id),
  data date
);

create table fornecedores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

-- Biblioteca
create table bibliotecas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

create table acervo (
  id uuid primary key default gen_random_uuid(),
  biblioteca_id uuid references bibliotecas(id),
  titulo text,
  autor text,
  isbn text
);

create table exemplares (
  id uuid primary key default gen_random_uuid(),
  acervo_id uuid references acervo(id),
  codigo_barra text
);

create table emprestimos (
  id uuid primary key default gen_random_uuid(),
  exemplar_id uuid references exemplares(id),
  leitor_id uuid references pessoas(id),
  data_emprestimo date,
  data_devolucao date,
  status text
);

create table reservas (
  id uuid primary key default gen_random_uuid(),
  exemplar_id uuid references exemplares(id),
  leitor_id uuid references pessoas(id),
  data_reserva date
);

create table penalidades (
  id uuid primary key default gen_random_uuid(),
  leitor_id uuid references pessoas(id),
  motivo text,
  data_inicio date,
  data_fim date
);

create table leitores (
  id uuid primary key references pessoas(id)
);

-- Documentos & Assinaturas
create table arquivos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  url text,
  tipo text,
  created_at timestamptz default now()
);

create table assinaturas_fluxos (
  id uuid primary key default gen_random_uuid(),
  arquivo_id uuid references arquivos(id),
  status text
);

create table assinaturas_eventos (
  id uuid primary key default gen_random_uuid(),
  fluxo_id uuid references assinaturas_fluxos(id),
  pessoa_id uuid references pessoas(id),
  status text,
  data_assinatura date
);

create table modelos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text,
  conteudo text
);

-- Certificados
create table cursos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  nome text
);

create table turmas_cursos (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid references cursos(id),
  nome text
);

create table matriculas_cursos (
  id uuid primary key default gen_random_uuid(),
  turma_curso_id uuid references turmas_cursos(id),
  aluno_id uuid references alunos(id)
);

create table freq_cursos (
  id uuid primary key default gen_random_uuid(),
  matricula_curso_id uuid references matriculas_cursos(id),
  data date,
  presente boolean
);

create table certificados_emitidos (
  id uuid primary key default gen_random_uuid(),
  matricula_curso_id uuid references matriculas_cursos(id),
  url text,
  data_emissao date
);

-- Auditoria
create table auditoria_eventos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  usuario_id uuid references users(id),
  acao text,
  tabela text,
  registro_id uuid,
  data_evento timestamptz default now()
);

-- Índices de junção
create index idx_users_tenant on users(tenant_id);
create index idx_escolas_tenant on escolas(tenant_id);
create index idx_turmas_tenant on turmas(tenant_id);
create index idx_pessoas_tenant on pessoas(tenant_id);
create index idx_matriculas_aluno on matriculas(aluno_id);
create index idx_matriculas_turma on matriculas(turma_id);

-- Views para relatórios
create or replace view vw_matriculas_resumo as
  select m.id, m.aluno_id, m.turma_id, t.nome as turma_nome, e.nome as escola_nome, m.status
  from matriculas m
  join turmas t on m.turma_id = t.id
  join escolas e on t.escola_id = e.id;

create or replace view vw_freq_diaria as
  select f.id as frequencia_id, f.turma_id, f.data, a.id as aluno_id, fa.presente
  from frequencias f
  join frequencias_alunos fa on f.id = fa.frequencia_id
  join alunos a on fa.aluno_id = a.id;

-- RLS por tenant_id para todas as tabelas principais (exemplo)
-- Repita/adapte para cada tabela conforme necessário
alter table pessoas enable row level security;
create policy "Pessoas: tenant only" on pessoas for select using (tenant_id = auth.jwt() ->> 'tenant_id');

-- Adicione políticas para cada papel conforme regras de negócio
-- ...
