import { test, expect } from '@playwright/test';

test.describe('Phase 1 & 2: Onboarding Flow', () => {
  test('Complete end-to-end onboarding workflow', async ({ page }) => {
    // 1. Navigate to onboarding
    await page.goto('http://localhost:3000/onboarding');

    // Wait for the Profile step to render
    await expect(page.getByText('Tell us about yourself')).toBeVisible();

    // 2. Select Creator Type
    await page.getByRole('button', { name: 'Solo Creator' }).click();
    
    // 3. Select Niche
    await page.getByRole('button', { name: 'Tech & AI' }).click();

    // 4. Continue to Goals step
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify Goals step is visible
    await expect(page.getByText('What is your primary goal?')).toBeVisible();

    // 5. Select Goal
    await page.getByRole('button', { name: 'Maximize Views & Reach' }).click();

    // 6. Continue to Connect step
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify Connection step is visible
    await expect(page.getByText('Connect Your YouTube Channel')).toBeVisible();

    // 7. Trigger OAuth
    await page.getByRole('button', { name: /Connect Channel/i }).click();

    // Verify OAuth Modal opens
    await expect(page.getByText('Google Accounts Auth')).toBeVisible();

    // 8. Allow access
    await page.getByRole('button', { name: 'Allow' }).click();

    // Verify Audit step is visible and runs
    await expect(page.getByText('Running Channel Growth Audit')).toBeVisible({ timeout: 5000 });

    // 9. Wait for the audit to finish
    // Audit has a setInterval that adds progress. Max duration is a few seconds.
    await expect(page.getByText('Onboarding Complete!')).toBeVisible({ timeout: 15000 });

    // 10. Finish onboarding
    await page.getByRole('button', { name: /Enter Growth OS Dashboard/i }).click();

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
