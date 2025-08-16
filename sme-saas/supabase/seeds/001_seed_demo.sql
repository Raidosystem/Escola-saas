-- Seeds mínimos para ambiente demo

-- Tenant demo
insert into tenants (id, nome) values ('00000000-0000-0000-0000-000000000001', 'Município Demo');

-- Escola demo
insert into escolas (id, tenant_id, nome, codigo, endereco) values ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Escola Municipal Demo', 'EMD001', 'Rua Central, 100');

-- Usuários demo (um de cada papel)
insert into users (id, tenant_id, email, nome, role) values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'admin@demo.com', 'Admin Demo', 'admin'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'secretaria@demo.com', 'Secretária Demo', 'secretaria'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'diretor@demo.com', 'Diretor Demo', 'diretor'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'professor@demo.com', 'Professor Demo', 'professor'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'responsavel@demo.com', 'Responsável Demo', 'responsavel'),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', 'aluno@demo.com', 'Aluno Demo', 'aluno'),
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000001', 'nutricionista@demo.com', 'Nutricionista Demo', 'nutricionista'),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000001', 'bibliotecario@demo.com', 'Bibliotecário Demo', 'bibliotecario'),
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000001', 'instrutor@demo.com', 'Instrutor Demo', 'instrutor');

-- Pessoas demo (alunos, professores, responsáveis, servidores)
-- 20 alunos, 2 professores, 2 responsáveis, 1 secretário, 1 diretor
-- Exemplo de inserção de um aluno
insert into pessoas (id, tenant_id, tipo, nome, data_nascimento) values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', 'aluno', 'Aluno 1', '2015-01-01');
-- Repita para os demais...
