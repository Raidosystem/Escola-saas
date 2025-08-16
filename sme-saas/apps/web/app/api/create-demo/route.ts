import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const demoUsers = [
      {
        email: 'admin@demo.com',
        password: '123456',
        role: 'admin',
        nome: 'Admin Demo'
      },
      {
        email: 'secretaria@demo.com', 
        password: '123456',
        role: 'secretaria',
        nome: 'Secretaria Demo'
      },
      {
        email: 'professor@demo.com',
        password: '123456', 
        role: 'professor',
        nome: 'Professor Demo'
      },
      {
        email: 'aluno@demo.com',
        password: '123456',
        role: 'aluno', 
        nome: 'Aluno Demo'
      }
    ]

    const results = []

    for (const user of demoUsers) {
      try {
        // Create user in auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          user_metadata: {
            role: user.role,
            nome: user.nome,
            tenant_id: '00000000-0000-0000-0000-000000000001'
          }
        })

        if (authError) {
          console.error(`Error creating auth user ${user.email}:`, authError)
          results.push({ email: user.email, success: false, error: authError.message })
          continue
        }

        // Create user in public.users table
        const { error: publicUserError } = await supabase
          .from('users')
          .upsert({
            id: authUser.user?.id,
            tenant_id: '00000000-0000-0000-0000-000000000001',
            email: user.email,
            nome: user.nome,
            role: user.role
          })

        if (publicUserError) {
          console.error(`Error creating public user ${user.email}:`, publicUserError)
        }

        results.push({ 
          email: user.email, 
          success: true, 
          authId: authUser.user?.id,
          publicUserError: publicUserError?.message 
        })

      } catch (userError: any) {
        console.error(`Exception creating user ${user.email}:`, userError)
        results.push({ email: user.email, success: false, error: userError.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo users creation completed',
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Demo users creation failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Demo users creation failed',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to create demo users',
    demoUsers: [
      'admin@demo.com / 123456',
      'secretaria@demo.com / 123456', 
      'professor@demo.com / 123456',
      'aluno@demo.com / 123456'
    ]
  })
}
