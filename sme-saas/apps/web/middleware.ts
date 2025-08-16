import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Middleware simplificado para debug
  const { pathname } = req.nextUrl;
  
  // Log para debug (removível em produção)
  console.log('Middleware processing:', pathname);
  
  // Apenas permitir tudo por enquanto para resolver o erro
  return NextResponse.next();
}

export const config = { 
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] 
};
