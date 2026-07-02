import { test, expect } from '@playwright/test';
import { login, hasCreds } from './auth-helper';

// /onboarding now requires an authenticated session (middleware-gated).
test.describe('Onboarding Flow (simplified 2-step)', () => {
  test('Unauthenticated /onboarding redirects to /login', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Complete onboarding: About You → Connect → Dashboard', async ({ page }) => {
    test.skip(!hasCreds, 'Set TEST_EMAIL/TEST_PASSWORD to run authed tests');
    await login(page);
    await page.goto('http://localhost:3000/onboarding');

    await expect(page.getByText('Tell us about yourself')).toBeVisible();
    await page.getByRole('button', { name: 'Solo Creator' }).click();
    await page.getByRole('button', { name: 'Tech & AI' }).click();
    await page.getByRole('button', { name: 'Views & Reach' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Connect your YouTube channel')).toBeVisible();
    await page.getByRole('button', { name: /Skip for now/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 5000 });
  });
});
