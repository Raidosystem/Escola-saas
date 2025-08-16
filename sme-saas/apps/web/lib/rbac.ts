import { routeAllowed } from './auth';

export function assertAccess(role: string, pathname: string) {
  if (!routeAllowed(role, pathname)) {
    const error: any = new Error('Acesso negado');
    error.status = 403;
    throw error;
  }
}
