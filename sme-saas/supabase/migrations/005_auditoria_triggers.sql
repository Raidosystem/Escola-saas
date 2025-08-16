-- Migration 005: Triggers de auditoria básicas

create or replace function audit_generic() returns trigger as $$
declare
  tenant uuid;
  usuario uuid;
  reg_id uuid;
begin
  tenant := auth_tenant_id();
  usuario := (auth.jwt()->>'sub')::uuid;
  if (TG_OP = 'INSERT') then
    reg_id := new.id;
  else
    reg_id := old.id;
  end if;
  insert into auditoria_eventos(tenant_id, usuario_id, acao, tabela, registro_id)
  values(tenant, usuario, TG_OP, TG_TABLE_NAME, reg_id);
  if (TG_OP = 'DELETE') then return old; else return new; end if;
end;
$$ language plpgsql security definer;

-- Aplica em algumas tabelas críticas
DO $$
declare r record;
begin
  for r in select unnest(array['matriculas','avaliacoes','notas','frequencias']) as t loop
    execute format('drop trigger if exists audit_%I on %I;', r.t, r.t);
    execute format('create trigger audit_%I after insert or update or delete on %I for each row execute function audit_generic();', r.t, r.t);
  end loop;
end;$$;

-- END 005
