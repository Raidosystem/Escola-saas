-- SME SaaS - Row Level Security (RLS) Policies
-- Execute AFTER the main schema

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE escolas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE servidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE componentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencias_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE designacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardapios ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bibliotecas ENABLE ROW LEVEL SECURITY;
ALTER TABLE acervo ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_eventos ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants (admin only)
CREATE POLICY "tenants_admin_all" ON tenants FOR ALL 
USING (is_role('admin')) 
WITH CHECK (is_role('admin'));

-- Create policies for users
CREATE POLICY "users_tenant_select" ON users FOR SELECT 
USING (tenant_id = auth_tenant_id());

CREATE POLICY "users_admin_all" ON users FOR ALL 
USING (tenant_id = auth_tenant_id() AND is_role('admin'))
WITH CHECK (tenant_id = auth_tenant_id());

-- Create policies for escolas
CREATE POLICY "escolas_tenant_select" ON escolas FOR SELECT 
USING (tenant_id = auth_tenant_id());

CREATE POLICY "escolas_admin_mod" ON escolas FOR ALL 
USING (tenant_id = auth_tenant_id() AND has_any_role(ARRAY['admin','secretaria','diretor']))
WITH CHECK (tenant_id = auth_tenant_id());

-- Create policies for turmas
CREATE POLICY "turmas_tenant_select" ON turmas FOR SELECT 
USING (
  tenant_id = auth_tenant_id() AND (
    has_any_role(ARRAY['admin','secretaria','diretor','professor']) OR
    (auth_role() = 'professor' AND EXISTS (
      SELECT 1 FROM professores_turmas pt WHERE pt.turma_id = turmas.id AND pt.professor_id = (auth.jwt()->>'sub')::UUID
    ))
  )
);

CREATE POLICY "turmas_admin_mod" ON turmas FOR ALL 
USING (tenant_id = auth_tenant_id() AND has_any_role(ARRAY['admin','secretaria','diretor']))
WITH CHECK (tenant_id = auth_tenant_id());

-- Create policies for pessoas
CREATE POLICY "pessoas_tenant_select" ON pessoas FOR SELECT 
USING (tenant_id = auth_tenant_id());

CREATE POLICY "pessoas_admin_mod" ON pessoas FOR ALL 
USING (tenant_id = auth_tenant_id() AND has_any_role(ARRAY['admin','secretaria']))
WITH CHECK (tenant_id = auth_tenant_id());

-- Create policies for matriculas
CREATE POLICY "matriculas_select" ON matriculas FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = matriculas.turma_id AND t.tenant_id = auth_tenant_id()) AND (
    has_any_role(ARRAY['admin','secretaria','diretor','professor']) OR
    (auth_role() = 'responsavel' AND EXISTS (
      SELECT 1 FROM aluno_responsavel ar WHERE ar.aluno_id = matriculas.aluno_id AND ar.responsavel_id = (auth.jwt()->>'sub')::UUID
    )) OR
    (auth_role() = 'aluno' AND matriculas.aluno_id = (auth.jwt()->>'sub')::UUID)
  )
);

CREATE POLICY "matriculas_admin_mod" ON matriculas FOR ALL 
USING (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = matriculas.turma_id AND t.tenant_id = auth_tenant_id()) AND
  has_any_role(ARRAY['admin','secretaria'])
)
WITH CHECK (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = matriculas.turma_id AND t.tenant_id = auth_tenant_id())
);

-- Create policies for frequencias
CREATE POLICY "frequencias_select" ON frequencias FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = frequencias.turma_id AND t.tenant_id = auth_tenant_id())
);

CREATE POLICY "frequencias_professor_mod" ON frequencias FOR ALL 
USING (
  auth_role() = 'professor' AND EXISTS (
    SELECT 1 FROM professores_turmas pt WHERE pt.turma_id = frequencias.turma_id AND pt.professor_id = (auth.jwt()->>'sub')::UUID
  )
)
WITH CHECK (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = frequencias.turma_id AND t.tenant_id = auth_tenant_id())
);

-- Create policies for frequencias_alunos
CREATE POLICY "frequencias_alunos_select" ON frequencias_alunos FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM frequencias f 
    JOIN turmas t ON t.id = f.turma_id 
    WHERE f.id = frequencias_alunos.frequencia_id AND t.tenant_id = auth_tenant_id()
  )
);

CREATE POLICY "frequencias_alunos_professor_mod" ON frequencias_alunos FOR ALL 
USING (
  auth_role() = 'professor' AND EXISTS (
    SELECT 1 FROM frequencias f 
    JOIN professores_turmas pt ON pt.turma_id = f.turma_id 
    WHERE f.id = frequencias_alunos.frequencia_id AND pt.professor_id = (auth.jwt()->>'sub')::UUID
  )
)
WITH CHECK (TRUE);

-- Create policies for avaliacoes
CREATE POLICY "avaliacoes_select" ON avaliacoes FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = avaliacoes.turma_id AND t.tenant_id = auth_tenant_id())
);

CREATE POLICY "avaliacoes_professor_mod" ON avaliacoes FOR ALL 
USING (
  auth_role() = 'professor' AND EXISTS (
    SELECT 1 FROM professores_turmas pt WHERE pt.turma_id = avaliacoes.turma_id AND pt.professor_id = (auth.jwt()->>'sub')::UUID
  )
)
WITH CHECK (
  EXISTS (SELECT 1 FROM turmas t WHERE t.id = avaliacoes.turma_id AND t.tenant_id = auth_tenant_id())
);

-- Create policies for notas
CREATE POLICY "notas_select" ON notas FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM avaliacoes a 
    JOIN turmas t ON t.id = a.turma_id 
    WHERE a.id = notas.avaliacao_id AND t.tenant_id = auth_tenant_id()
  )
);

CREATE POLICY "notas_professor_mod" ON notas FOR ALL 
USING (
  auth_role() = 'professor' AND EXISTS (
    SELECT 1 FROM avaliacoes a 
    JOIN professores_turmas pt ON pt.turma_id = a.turma_id 
    WHERE a.id = notas.avaliacao_id AND pt.professor_id = (auth.jwt()->>'sub')::UUID
  )
)
WITH CHECK (TRUE);

-- Generic tenant-based policies for other tables
CREATE POLICY "series_tenant" ON series FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "componentes_tenant" ON componentes FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "inscricoes_tenant" ON inscricoes FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "cardapios_tenant" ON cardapios FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "rotas_tenant" ON rotas FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "veiculos_tenant" ON veiculos FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "bibliotecas_tenant" ON bibliotecas FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());
CREATE POLICY "cursos_tenant" ON cursos FOR ALL USING (tenant_id = auth_tenant_id()) WITH CHECK (tenant_id = auth_tenant_id());

-- Audit policies (admin/secretaria only)
CREATE POLICY "auditoria_admin_select" ON auditoria_eventos FOR SELECT 
USING (tenant_id = auth_tenant_id() AND has_any_role(ARRAY['admin','secretaria','diretor']));

-- RLS Policies successfully applied
