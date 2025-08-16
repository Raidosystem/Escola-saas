-- Create demo users directly in auth schema for testing
-- Run this manually in Supabase SQL editor

-- Insert demo users into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token
) VALUES 
(
  '00000000-0000-0000-0000-000000000201'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nome": "Admin Demo", "role": "admin", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  ''
),
(
  '00000000-0000-0000-0000-000000000202'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'secretaria@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nome": "Secretaria Demo", "role": "secretaria", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  ''
),
(
  '00000000-0000-0000-0000-000000000204'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'professor@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nome": "Professor Demo", "role": "professor", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  ''
),
(
  '00000000-0000-0000-0000-000000000206'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'aluno@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nome": "Aluno Demo", "role": "aluno", "tenant_id": "00000000-0000-0000-0000-000000000001"}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding records in public.users
INSERT INTO public.users (
  id,
  tenant_id,
  email,
  nome,
  role,
  created_at
) VALUES
(
  '00000000-0000-0000-0000-000000000201'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@demo.com',
  'Admin Demo',
  'admin',
  now()
),
(
  '00000000-0000-0000-0000-000000000202'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'secretaria@demo.com',
  'Secretaria Demo',
  'secretaria',
  now()
),
(
  '00000000-0000-0000-0000-000000000204'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'professor@demo.com',
  'Professor Demo',
  'professor',
  now()
),
(
  '00000000-0000-0000-0000-000000000206'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'aluno@demo.com',
  'Aluno Demo',
  'aluno',
  now()
)
ON CONFLICT (id) DO NOTHING;
