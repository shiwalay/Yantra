import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow (simplified 2-step)', () => {
  test('Complete onboarding: About You → Connect → Dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    // Step 1 — About You (all selections on one screen)
    await expect(page.getByText('Tell us about yourself')).toBeVisible();
    await page.getByRole('button', { name: 'Solo Creator' }).click();
    await page.getByRole('button', { name: 'Tech & AI' }).click();
    await page.getByRole('button', { name: 'Views & Reach' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2 — Connect
    await expect(page.getByText('Connect your YouTube channel')).toBeVisible();
    await page.getByRole('button', { name: /Connect via YouTube OAuth/i }).click();

    // OAuth consent modal
    await expect(page.getByText('Google Accounts Auth')).toBeVisible();
    await page.getByRole('button', { name: 'Allow' }).click();

    // Redirects to the dashboard after a short setup
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 5000 });
  });

  test('Skip connection (Demo Mode) also completes onboarding', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    await page.getByRole('button', { name: 'Coach / Consultant' }).click();
    await page.getByRole('button', { name: 'Business & Finance' }).click();
    await page.getByRole('button', { name: 'Leads & Sales' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: /Skip for now/i }).click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 5000 });
  });
});
