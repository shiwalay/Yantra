import { test, expect } from '@playwright/test';

test.describe('Phase 10: Dashboard Flow', () => {
  test('Redirects to onboarding if not onboarded', async ({ page }) => {
    // Navigate without local storage
    await page.goto('http://localhost:3000/dashboard');
    // Expect redirect to onboarding
    await expect(page).toHaveURL(/.*\/onboarding/);
  });

  test('Loads AI Command Center when onboarded', async ({ page, context }) => {
    // Navigate to homepage first to set localStorage
    await page.goto('http://localhost:3000/');
    
    // Set localStorage flag manually
    await page.evaluate(() => {
      localStorage.setItem('yantra_onboarded', 'true');
    });

    // Navigate to dashboard (Command Center)
    await page.goto('http://localhost:3000/dashboard');

    // Verify Personalized Hero
    await expect(page.getByText('Good Morning')).toBeVisible();
    await expect(page.getByText("Today's Growth Score:")).toBeVisible();

    // Verify Single Input Engine
    await expect(page.getByPlaceholder('What video do you want to make?')).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Strategy/i })).toBeVisible();

    // Verify Today's Mission checklist loads
    await expect(page.getByRole('heading', { name: "Today's Mission" })).toBeVisible();
    await expect(page.getByText('Find Winning Topic', { exact: true })).toBeVisible();
    await expect(page.getByText('Write Script', { exact: true })).toBeVisible();
    await expect(page.getByText('Design Thumbnail')).toBeVisible();

    // Verify Outcome Metrics load
    await expect(page.getByText('Estimated Growth Impact')).toBeVisible();
    await expect(page.getByText('+145')).toBeVisible();
  });
});
