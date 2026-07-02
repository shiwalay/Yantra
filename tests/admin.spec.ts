import { test, expect } from '@playwright/test';

// The admin area is now protected by real Supabase auth + middleware.
// These tests cover the auth gate and the login screen (no credentials needed).
test.describe('Admin auth gate', () => {
  test('Unauthenticated /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('Protected admin sub-routes redirect to login when signed out', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/users');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('Login screen renders the sign-in form', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await expect(page.getByRole('heading', { name: 'Admin Portal' })).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Secure Login/i })).toBeVisible();
  });

  test('Invalid credentials keep the user on the login screen', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    await page.fill('input#email', 'nobody@example.com');
    await page.fill('input#password', 'wrongpassword');
    await page.getByRole('button', { name: /Secure Login/i }).click();
    await page.waitForTimeout(2500);
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });
});
