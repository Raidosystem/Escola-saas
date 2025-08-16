import { test, expect } from '@playwright/test';

test('home loads and version endpoint responds', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SME/);
  const res = await page.request.get('/api/version');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.version).toBeDefined();
});
