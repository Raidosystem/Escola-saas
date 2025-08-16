-- Seed 003: Create auth users with complete integration

-- First ensure tenant exists
insert into tenants (id, nome) values ('00000000-0000-0000-0000-000000000001', 'Município Demo') on conflict (id) do nothing;

-- Create users in auth.users (this will trigger sync to public.users)
-- Note: In production, use Supabase Admin API or Dashboard
-- This is for development/testing only

-- Admin user
do $$
declare
  user_id uuid := '00000000-0000-0000-0000-000000000201';
begin
  -- Check if user already exists in auth.users
  if not exists (select 1 from auth.users where id = user_id) then
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      role
    ) values (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@demo.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object(
        'tenant_id', '00000000-0000-0000-0000-000000000001',
        'role', 'admin',
        'nome', 'Admin Demo'
      ),
      false,
      'authenticated'
    );
  end if;
end $$;

-- Secretaria user  
do $$
declare
  user_id uuid := '00000000-0000-0000-0000-000000000202';
begin
  if not exists (select 1 from auth.users where id = user_id) then
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      role
    ) values (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'secretaria@demo.com',
      crypt('secretaria123', gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object(
        'tenant_id', '00000000-0000-0000-0000-000000000001',
        'role', 'secretaria',
        'nome', 'Secretária Demo'
      ),
      false,
      'authenticated'
    );
  end if;
end $$;

-- Professor user
do $$
declare
  user_id uuid := '00000000-0000-0000-0000-000000000204';
begin
  if not exists (select 1 from auth.users where id = user_id) then
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      role
    ) values (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      'professor@demo.com',
      crypt('professor123', gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object(
        'tenant_id', '00000000-0000-0000-0000-000000000001',
        'role', 'professor',
        'nome', 'Professor Demo'
      ),
      false,
      'authenticated'
    );
  end if;
end $$;
