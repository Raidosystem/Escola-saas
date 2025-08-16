-- Migration 004: RLS adicional (alimentacao, transporte, biblioteca, documentos, certificados)

-- Alimentação
alter table cardapios enable row level security;
create policy cardapios_select on cardapios for select using (tenant_id = auth_tenant_id());
create policy cardapios_mod_nutri on cardapios for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','nutricionista','secretaria']));

alter table estoque_generos enable row level security;
create policy estoque_generos_select on estoque_generos for select using (tenant_id = auth_tenant_id() and has_any_role(array['admin','nutricionista']));
create policy estoque_generos_mod on estoque_generos for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','nutricionista']));

-- Transporte
alter table rotas enable row level security;
create policy rotas_select on rotas for select using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte','secretaria','diretor']));
create policy rotas_mod on rotas for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte']));

alter table veiculos enable row level security;
create policy veiculos_select on veiculos for select using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte']));
create policy veiculos_mod on veiculos for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte']));

alter table motoristas enable row level security;
create policy motoristas_select on motoristas for select using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte']));
create policy motoristas_mod on motoristas for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','transporte']));

-- Biblioteca
alter table bibliotecas enable row level security;
create policy bibliotecas_select on bibliotecas for select using (tenant_id = auth_tenant_id());
create policy bibliotecas_mod on bibliotecas for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','bibliotecario']));

alter table acervo enable row level security;
create policy acervo_select on acervo for select using (exists (select 1 from bibliotecas b where b.id = acervo.biblioteca_id and b.tenant_id = auth_tenant_id()));
create policy acervo_mod on acervo for all using (exists (select 1 from bibliotecas b where b.id = acervo.biblioteca_id and b.tenant_id = auth_tenant_id() and has_any_role(array['admin','bibliotecario'])));

alter table exemplares enable row level security;
create policy exemplares_select on exemplares for select using (exists (select 1 from acervo a join bibliotecas b on b.id = a.biblioteca_id where a.id = exemplares.acervo_id and b.tenant_id = auth_tenant_id()));
create policy exemplares_mod on exemplares for all using (exists (select 1 from acervo a join bibliotecas b on b.id = a.biblioteca_id where a.id = exemplares.acervo_id and b.tenant_id = auth_tenant_id() and has_any_role(array['admin','bibliotecario'])));

alter table emprestimos enable row level security;
create policy emprestimos_select on emprestimos for select using (true);
create policy emprestimos_mod on emprestimos for all using (true) with check (true);

-- Documentos
alter table arquivos enable row level security;
create policy arquivos_select on arquivos for select using (tenant_id = auth_tenant_id());
create policy arquivos_mod on arquivos for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','secretaria','diretor']));

-- Certificados
alter table cursos enable row level security;
create policy cursos_select on cursos for select using (tenant_id = auth_tenant_id());
create policy cursos_mod on cursos for all using (tenant_id = auth_tenant_id() and has_any_role(array['admin','instrutor']));

-- END 004
