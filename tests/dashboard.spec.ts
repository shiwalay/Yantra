import { test, expect } from '@playwright/test';
import { login, hasCreds } from './auth-helper';

test.describe('Dashboard Flow (real auth)', () => {
  test('Unauthenticated /dashboard redirects to /login', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Loads the Command Center when authenticated', async ({ page }) => {
    test.skip(!hasCreds, 'Set TEST_EMAIL/TEST_PASSWORD to run authed tests');
    await login(page);

    // Create bar (Single Input Engine)
    await expect(page.getByPlaceholder('What video do you want to make?')).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Strategy/i })).toBeVisible();

    // Brink metric cards + gradient balance card
    await expect(page.getByText('Views · Last 30 Days')).toBeVisible();
    await expect(page.getByText('Est. Monthly Revenue')).toBeVisible();
    await expect(page.getByText('$4,827')).toBeVisible();

    // Recent Activity + Content Categories
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Content Categories' })).toBeVisible();

    // Today's Mission
    await expect(page.getByRole('heading', { name: "Today's Mission" })).toBeVisible();
  });
});
