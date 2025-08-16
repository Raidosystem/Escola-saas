import { describe, it, expect } from 'vitest';
import { routeAllowed } from '../lib/auth';

describe('RBAC routeAllowed', () => {
  it('admin can access anything', () => {
    expect(routeAllowed('admin', '/qualquer/coisa')).toBe(true);
  });
  it('professor cannot access transporte', () => {
    expect(routeAllowed('professor', '/transporte/rotas')).toBe(false);
  });
  it('secretaria can access /secretaria/matriculas', () => {
    expect(routeAllowed('secretaria', '/secretaria/matriculas')).toBe(true);
  });
  it('professor can now access notas endpoint', () => {
    expect(routeAllowed('professor', '/secretaria/academico/notas')).toBe(true);
  });
});
