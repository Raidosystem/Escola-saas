import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export function getServerSupabase() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
  return { supabase, accessToken, refreshToken };
}

export type UserSession = { role: string; user_id: string; tenant_id: string };

export function parseJwt(token?: string): UserSession | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = Buffer.from(payload, 'base64').toString('utf8');
    const obj = JSON.parse(json);
    return { role: obj.role || obj.user_metadata?.role || 'aluno', user_id: obj.sub, tenant_id: obj.tenant_id || obj.user_metadata?.tenant_id || '' };
  } catch {
    return null;
  }
}

export const PUBLIC_ROUTES = ['/login', '/register'];

export function routeAllowed(role: string, pathname: string) {
  const matrix: Record<string, string[]> = {
    admin: ['*'],
    secretaria: ['/secretaria', '/vagas', '/alimentacao', '/transporte', '/biblioteca', '/documentos', '/certificados'],
    diretor: ['/secretaria/estrutura', '/secretaria/academico', '/secretaria/matriculas'],
    professor: [
      '/secretaria/academico/frequencia',
      '/secretaria/academico/avaliacoes',
      '/secretaria/academico/notas',
      '/secretaria/pessoas/alunos'
    ],
    responsavel: ['/familia', '/aluno'],
    aluno: ['/aluno', '/certificados/cursos'],
    nutricionista: ['/alimentacao'],
    bibliotecario: ['/biblioteca'],
    instrutor: ['/certificados'],
  };
  if (role === 'admin') return true;
  const allowed = matrix[role] || [];
  if (allowed.includes('*')) return true;
  return allowed.some(prefix => pathname.startsWith(prefix));
}
