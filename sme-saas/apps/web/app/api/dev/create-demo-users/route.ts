import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Quick endpoint to create demo users (development only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    nome: 'Admin Demo',
    role: 'admin'
  },
  {
    email: 'secretaria@demo.com',
    password: 'secretaria123',
    nome: 'Secretária Demo',
    role: 'secretaria'
  },
  {
    email: 'professor@demo.com',
    password: 'professor123',
    nome: 'Professor Demo',
    role: 'professor'
  },
  {
    email: 'aluno@demo.com',
    password: 'aluno123',
    nome: 'Aluno Demo',
    role: 'aluno'
  }
];

export async function POST(_req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint não disponível em produção' }, { status: 403 });
  }

  try {
    const results = [];
    
    for (const user of demoUsers) {
      const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          nome: user.nome,
          role: user.role,
          tenant_id: '00000000-0000-0000-0000-000000000001',
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        results.push({ email: user.email, error: authError.message });
      } else {
        results.push({ email: user.email, success: true, existed: authError?.message.includes('already registered') });
      }
    }

    return NextResponse.json({
      message: 'Usuários demo criados/verificados',
      results,
      loginInfo: 'Use qualquer email acima com senha padrão (ex: admin123)'
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Erro ao criar usuários demo',
      details: error.message
    }, { status: 500 });
  }
}
