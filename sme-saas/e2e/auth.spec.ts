import { test, expect } from '@playwright/test';
import http from 'http';

function fakeJwt(payload: any){
  const base = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${base({alg:'none',typ:'JWT'})}.${base(payload)}.`;
}

test('authenticated access to secretaria', async ({ page, context }) => {
  const reachable = await new Promise<boolean>(res=>{const req = http.request({host:'localhost',port:3000,path:'/'},r=>{res(true);req.destroy();});req.on('error',()=>res(false));req.end();});
  test.skip(!reachable, 'Dev server not running');
  const token = fakeJwt({ sub: '00000000-0000-0000-0000-000000000000', role: 'secretaria', tenant_id: 'tenant_demo' });
  await context.addCookies([{ name: 'sb-access-token', value: token, domain: 'localhost', path: '/', httpOnly: false, secure: false }]);
  await page.goto('/secretaria');
  await expect(page.getByTestId('secretaria-home')).toBeVisible();
});
