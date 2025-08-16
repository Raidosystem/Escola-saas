import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES, parseJwt, routeAllowed } from './lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }
  const access = req.cookies.get('sb-access-token')?.value || req.cookies.get('supabase-auth-token')?.value;
  const session = parseJwt(access);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  if (!routeAllowed(session.role, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('denied', '1');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'] };
