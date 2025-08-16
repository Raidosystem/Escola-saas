import { NextResponse } from 'next/server';

// Quick demo users info endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Usuários demo disponíveis para teste',
    users: [
      {
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin',
        description: 'Acesso completo ao sistema'
      },
      {
        email: 'secretaria@demo.com', 
        password: 'demo123',
        role: 'secretaria',
        description: 'Acesso à secretaria, vagas, alimentação'
      },
      {
        email: 'professor@demo.com',
        password: 'demo123', 
        role: 'professor',
        description: 'Acesso a frequência, avaliações, notas'
      },
      {
        email: 'aluno@demo.com',
        password: 'demo123',
        role: 'aluno', 
        description: 'Acesso limitado do aluno'
      }
    ],
    note: 'Use estes usuários para testar diferentes níveis de acesso',
    instruction: 'Vá para /login e use qualquer email/senha acima'
  });
}
