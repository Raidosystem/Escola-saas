-- Extend auditing to frequencias_alunos and designacoes
-- Assumes audit_generic() already created in 005

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'audit_frequencias_alunos' ) then
    create trigger audit_frequencias_alunos
      after insert or update or delete on frequencias_alunos
      for each row execute function audit_generic();
  end if;
  if not exists (
    select 1 from pg_trigger where tgname = 'audit_designacoes' ) then
    create trigger audit_designacoes
      after insert or update or delete on designacoes
      for each row execute function audit_generic();
  end if;
end $$;
