import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nome: z.string().min(2),
  role: z.enum(['admin', 'secretaria', 'diretor', 'professor', 'responsavel', 'aluno', 'nutricionista', 'bibliotecario', 'instrutor']),
  tenant_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: parsed.error.format() 
      }, { status: 400 });
    }

    const { email, password, nome, role, tenant_id } = parsed.data;
    const defaultTenantId = tenant_id || '00000000-0000-0000-0000-000000000001';

    // Use regular signup since we don't have service role configured
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          role,
          tenant_id: defaultTenantId,
        }
      }
    });

    if (signUpError) {
      console.error('SignUp error:', signUpError);
      return NextResponse.json({ 
        error: 'Erro ao criar usuário: ' + signUpError.message
      }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Usuário não foi criado'
      }, { status: 500 });
    }

    // Manually insert into public.users (since trigger might not exist yet)
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        tenant_id: defaultTenantId,
        email: authData.user.email,
        nome,
        role,
      });

    if (insertError) {
      console.warn('Failed to insert into public.users:', insertError);
      // Don't fail the request - user was created in auth
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nome,
        role,
      },
      message: authData.session ? 'Usuário criado e logado' : 'Usuário criado - confirme o email'
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
}
