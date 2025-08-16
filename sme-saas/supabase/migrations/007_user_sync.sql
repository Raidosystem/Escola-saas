-- Migration 007: User sync and auth integration

-- Function to sync auth.users to public.users
create or replace function sync_user_to_public()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    -- Insert new user into public.users with role from metadata
    insert into public.users (
      id, 
      tenant_id, 
      email, 
      nome, 
      role,
      created_at
    ) values (
      NEW.id,
      coalesce((NEW.raw_user_meta_data->>'tenant_id')::uuid, '00000000-0000-0000-0000-000000000001'::uuid),
      NEW.email,
      coalesce(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
      coalesce(NEW.raw_user_meta_data->>'role', 'aluno'),
      NEW.created_at
    ) on conflict (id) do update set
      email = excluded.email,
      nome = excluded.nome,
      role = excluded.role;
    return NEW;
  end if;
  
  if TG_OP = 'UPDATE' then
    -- Update existing user
    update public.users set
      email = NEW.email,
      nome = coalesce(NEW.raw_user_meta_data->>'nome', nome),
      role = coalesce(NEW.raw_user_meta_data->>'role', role),
      tenant_id = coalesce((NEW.raw_user_meta_data->>'tenant_id')::uuid, tenant_id)
    where id = NEW.id;
    return NEW;
  end if;
  
  if TG_OP = 'DELETE' then
    -- Soft delete or keep for audit
    update public.users set deleted_at = now() where id = OLD.id;
    return OLD;
  end if;
  
  return null;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update or delete on auth.users
  for each row execute function sync_user_to_public();

-- Add deleted_at column to users if not exists
do $$ begin
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'deleted_at') then
    alter table users add column deleted_at timestamptz;
  end if;
end $$;
