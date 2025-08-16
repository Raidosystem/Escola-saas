-- SME SaaS - Create Demo Users in Supabase Auth
-- Execute this script AFTER the main schema

-- Create demo users in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES 
-- Admin Demo User
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Admin Demo", "role": "admin", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
),
-- Secretaria Demo User  
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'secretaria@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Secretaria Demo", "role": "secretaria", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
),
-- Diretor Demo User
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'diretor@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Diretor Demo", "role": "diretor", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
),
-- Professor Demo User
(
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'professor@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Professor Demo", "role": "professor", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
),
-- Responsavel Demo User
(
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'responsavel@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Responsavel Demo", "role": "responsavel", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
),
-- Aluno Demo User
(
  '66666666-6666-6666-6666-666666666666',
  '00000000-0000-0000-0000-000000000000',
  'aluno@demo.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"nome": "Aluno Demo", "role": "aluno", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Create corresponding identities in auth.identities
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES 
('admin@demo.com', '11111111-1111-1111-1111-111111111111', '{"sub": "11111111-1111-1111-1111-111111111111", "email": "admin@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
('secretaria@demo.com', '22222222-2222-2222-2222-222222222222', '{"sub": "22222222-2222-2222-2222-222222222222", "email": "secretaria@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
('diretor@demo.com', '33333333-3333-3333-3333-333333333333', '{"sub": "33333333-3333-3333-3333-333333333333", "email": "diretor@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
('professor@demo.com', '44444444-4444-4444-4444-444444444444', '{"sub": "44444444-4444-4444-4444-444444444444", "email": "professor@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
('responsavel@demo.com', '55555555-5555-5555-5555-555555555555', '{"sub": "55555555-5555-5555-5555-555555555555", "email": "responsavel@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
('aluno@demo.com', '66666666-6666-6666-6666-666666666666', '{"sub": "66666666-6666-6666-6666-666666666666", "email": "aluno@demo.com"}'::jsonb, 'email', NOW(), NOW(), NOW())
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Manually sync users to public.users table (in case trigger doesn't work)
INSERT INTO public.users (id, tenant_id, email, nome, role) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin@demo.com', 'Admin Demo', 'admin'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'secretaria@demo.com', 'Secretaria Demo', 'secretaria'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'diretor@demo.com', 'Diretor Demo', 'diretor'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'professor@demo.com', 'Professor Demo', 'professor'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'responsavel@demo.com', 'Responsavel Demo', 'responsavel'),
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001', 'aluno@demo.com', 'Aluno Demo', 'aluno')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  role = EXCLUDED.role;

-- First, make sure we have the demo data from the main schema
-- Insert demo data for series (if not exists)
INSERT INTO series (id, tenant_id, nome) VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '1º Ano'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2º Ano')
ON CONFLICT (id) DO NOTHING;

-- Insert demo data for componentes (if not exists)
INSERT INTO componentes (id, tenant_id, nome) VALUES 
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Português'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Matemática')
ON CONFLICT (id) DO NOTHING;

-- Insert demo turmas (if not exists)
INSERT INTO turmas (id, tenant_id, escola_id, serie_id, nome, turno) VALUES 
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001', '1º A', 'manhã'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000002', '2º A', 'manhã')
ON CONFLICT (id) DO NOTHING;

-- Create some demo pessoas and alunos
INSERT INTO pessoas (id, tenant_id, tipo, nome, data_nascimento) VALUES 
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001', 'aluno', 'Aluno Demo', '2010-01-01'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'responsavel', 'Responsavel Demo', '1980-01-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO alunos (id, matricula) VALUES 
('66666666-6666-6666-6666-666666666666', 'MAT2024001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO responsaveis (id) VALUES 
('55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Link aluno and responsavel
INSERT INTO aluno_responsavel (aluno_id, responsavel_id) VALUES 
('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- Create a sample matricula
INSERT INTO matriculas (aluno_id, turma_id, status) VALUES 
('66666666-6666-6666-6666-666666666666', '30000000-0000-0000-0000-000000000001', 'ativa')
ON CONFLICT DO NOTHING;

-- Associate professor with turma
INSERT INTO professores_turmas (professor_id, turma_id) VALUES 
('44444444-4444-4444-4444-444444444444', '30000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

SELECT 'Demo users created successfully!' as result;
