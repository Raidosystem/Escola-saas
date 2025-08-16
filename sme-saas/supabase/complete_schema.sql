-- SME SaaS - Complete Database Schema for Supabase
-- Execute this script in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tenant
INSERT INTO tenants (id, nome) VALUES ('00000000-0000-0000-0000-000000000001', 'Município Demo') ON CONFLICT (id) DO NOTHING;

-- 2. USERS TABLE (integrates with auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'aluno',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

-- 3. ESCOLAS TABLE
CREATE TABLE IF NOT EXISTS escolas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL,
  codigo TEXT,
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo school
INSERT INTO escolas (id, tenant_id, nome, codigo, endereco) VALUES 
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Escola Municipal Demo', 'EMD001', 'Rua Central, 100')
ON CONFLICT (id) DO NOTHING;

-- 4. PESSOAS TABLE
CREATE TABLE IF NOT EXISTS pessoas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  tipo TEXT NOT NULL, -- aluno, responsavel, servidor
  nome TEXT NOT NULL,
  data_nascimento DATE,
  documento TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ALUNOS TABLE
CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY REFERENCES pessoas(id) ON DELETE CASCADE,
  matricula TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RESPONSAVEIS TABLE
CREATE TABLE IF NOT EXISTS responsaveis (
  id UUID PRIMARY KEY REFERENCES pessoas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SERVIDORES TABLE
CREATE TABLE IF NOT EXISTS servidores (
  id UUID PRIMARY KEY REFERENCES pessoas(id) ON DELETE CASCADE,
  cargo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ALUNO_RESPONSAVEL TABLE
CREATE TABLE IF NOT EXISTS aluno_responsavel (
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  responsavel_id UUID REFERENCES responsaveis(id) ON DELETE CASCADE,
  PRIMARY KEY (aluno_id, responsavel_id)
);

-- 9. SERIES TABLE
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL
);

-- 10. COMPONENTES TABLE
CREATE TABLE IF NOT EXISTS componentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL
);

-- 11. TURMAS TABLE
CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  escola_id UUID REFERENCES escolas(id),
  serie_id UUID REFERENCES series(id),
  nome TEXT NOT NULL,
  turno TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROFESSORES_TURMAS TABLE (for RLS)
CREATE TABLE IF NOT EXISTS professores_turmas (
  professor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES turmas(id) ON DELETE CASCADE,
  PRIMARY KEY (professor_id, turma_id)
);

-- 13. MATRICULAS TABLE
CREATE TABLE IF NOT EXISTS matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id),
  turma_id UUID REFERENCES turmas(id),
  status TEXT DEFAULT 'ativa',
  data_matricula DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AVALIACOES TABLE
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID REFERENCES turmas(id),
  componente_id UUID REFERENCES componentes(id),
  etapa INTEGER NOT NULL,
  data DATE NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTAS TABLE
CREATE TABLE IF NOT EXISTS notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id UUID REFERENCES avaliacoes(id),
  aluno_id UUID REFERENCES alunos(id),
  valor DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FREQUENCIAS TABLE
CREATE TABLE IF NOT EXISTS frequencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID REFERENCES turmas(id),
  data DATE NOT NULL,
  etapa INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. FREQUENCIAS_ALUNOS TABLE
CREATE TABLE IF NOT EXISTS frequencias_alunos (
  frequencia_id UUID REFERENCES frequencias(id) ON DELETE CASCADE,
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  presente BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (frequencia_id, aluno_id)
);

-- 18. INSCRICOES TABLE (Vagas)
CREATE TABLE IF NOT EXISTS inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  pessoa_id UUID REFERENCES pessoas(id),
  data_inscricao DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'aguardando',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. DESIGNACOES TABLE
CREATE TABLE IF NOT EXISTS designacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscricao_id UUID REFERENCES inscricoes(id),
  turma_id UUID REFERENCES turmas(id),
  data_designacao DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. CARDAPIOS TABLE (Alimentação)
CREATE TABLE IF NOT EXISTS cardapios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. ROTAS TABLE (Transporte)
CREATE TABLE IF NOT EXISTS rotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. VEICULOS TABLE
CREATE TABLE IF NOT EXISTS veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  placa TEXT NOT NULL,
  capacidade INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. BIBLIOTECAS TABLE
CREATE TABLE IF NOT EXISTS bibliotecas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. ACERVO TABLE
CREATE TABLE IF NOT EXISTS acervo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biblioteca_id UUID REFERENCES bibliotecas(id),
  titulo TEXT NOT NULL,
  autor TEXT,
  isbn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. CURSOS TABLE (Certificados)
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. AUDITORIA_EVENTOS TABLE
CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  usuario_id UUID REFERENCES users(id),
  acao TEXT NOT NULL,
  tabela TEXT NOT NULL,
  registro_id UUID,
  data_evento TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_escolas_tenant ON escolas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_turmas_tenant ON turmas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pessoas_tenant ON pessoas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_aluno ON matriculas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_turma ON matriculas(turma_id);
CREATE INDEX IF NOT EXISTS idx_frequencias_turma_data ON frequencias(turma_id, data);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_turma_etapa ON avaliacoes(turma_id, etapa);
CREATE INDEX IF NOT EXISTS idx_notas_avaliacao ON notas(avaliacao_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_tenant_data ON auditoria_eventos(tenant_id, data_evento);

-- Create a function to get tenant from JWT
CREATE OR REPLACE FUNCTION auth_tenant_id() RETURNS UUID AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'tenant_id')::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID
  );
$$ LANGUAGE SQL STABLE;

-- Create function to get user role
CREATE OR REPLACE FUNCTION auth_role() RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'role',
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'aluno'
  );
$$ LANGUAGE SQL STABLE;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION is_role(expected TEXT) RETURNS BOOLEAN AS $$
  SELECT auth_role() = expected;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION has_any_role(expected TEXT[]) RETURNS BOOLEAN AS $$
  SELECT auth_role() = ANY(expected);
$$ LANGUAGE SQL STABLE;

-- Create trigger to sync auth.users with users table
CREATE OR REPLACE FUNCTION sync_user_to_public()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.users (id, tenant_id, email, nome, role)
    VALUES (
      NEW.id,
      COALESCE((NEW.raw_user_meta_data->>'tenant_id')::UUID, '00000000-0000-0000-0000-000000000001'::UUID),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'aluno')
    ) ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      nome = EXCLUDED.nome,
      role = EXCLUDED.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_to_public();

-- Insert demo data for series
INSERT INTO series (id, tenant_id, nome) VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '1º Ano'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2º Ano'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '3º Ano'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '4º Ano'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '5º Ano')
ON CONFLICT (id) DO NOTHING;

-- Insert demo data for componentes
INSERT INTO componentes (id, tenant_id, nome) VALUES 
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Português'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Matemática'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'História'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Geografia'),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Ciências')
ON CONFLICT (id) DO NOTHING;

-- Insert demo turmas
INSERT INTO turmas (id, tenant_id, escola_id, serie_id, nome, turno) VALUES 
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001', '1º A', 'manhã'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000002', '2º A', 'manhã')
ON CONFLICT (id) DO NOTHING;

-- SME SaaS - Sistema Municipal de Ensino - Schema completo
