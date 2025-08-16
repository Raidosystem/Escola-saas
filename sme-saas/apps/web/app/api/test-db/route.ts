import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service Key exists:', !!supabaseServiceKey)
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test 1: Check if we can connect to Supabase
    const { data: testConnection, error: connectionError } = await supabase
      .from('tenants')
      .select('*')
      .limit(1)

    if (connectionError) {
      console.error('Connection error:', connectionError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: connectionError.message 
      }, { status: 500 })
    }

    // Test 2: Check if tables exist
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1)

    return NextResponse.json({
      success: true,
      connection: 'OK',
      tenants: testConnection,
      usersTableExists: !usersError,
      usersError: usersError?.message,
      authUsersAccessible: !authError,
      authError: authError?.message,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
