# SME SaaS - Database Setup Instructions

## Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: https://qvumfyvwtseouhnjhjom.supabase.co

## Step 2: Execute the Main Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the ENTIRE content of `complete_schema.sql` file and paste it
4. Click **Run** to execute
5. Wait for completion (this may take a few minutes)

## Step 3: Execute RLS Policies (Optional but Recommended)
1. Create another **New Query** in SQL Editor
2. Copy the ENTIRE content of `rls_policies.sql` file and paste it  
3. Click **Run** to execute

## Step 4: Verify Setup
After successful execution, you should see these tables in your Database:
- tenants
- users (synced with auth.users)
- escolas
- pessoas
- alunos, responsaveis, servidores
- series, componentes, turmas
- matriculas, avaliacoes, notas
- frequencias, frequencias_alunos
- inscricoes, designacoes
- cardapios, rotas, veiculos
- bibliotecas, acervo, cursos
- auditoria_eventos

## Step 5: Demo Users Created
The schema includes these demo users for testing:

### Admin
- Email: admin@demo.com
- Password: 123456

### Secretária
- Email: secretaria@demo.com  
- Password: 123456

### Diretor
- Email: diretor@demo.com
- Password: 123456

### Professor
- Email: professor@demo.com
- Password: 123456

### Responsável
- Email: responsavel@demo.com
- Password: 123456

### Aluno
- Email: aluno@demo.com
- Password: 123456

## Step 6: Test the Application
1. Start your development server: `npm run dev`
2. Go to http://localhost:3000
3. Try logging in with any of the demo users above
4. Test different features based on the user role

## Important Notes
- The complete_schema.sql file is over 1000 lines and includes everything needed
- Demo data is included for immediate testing
- RLS policies are configured for multi-tenant security
- All tables have proper indexes and constraints

## Troubleshooting
If you encounter any errors:
1. Check the SQL Editor error messages
2. Make sure you're using the SQL Editor (not the API)
3. Execute the scripts one section at a time if needed
4. Contact support if issues persist

## Environment Variables Check
Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=https://qvumfyvwtseouhnjhjom.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```
