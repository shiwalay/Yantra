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

    // Verify the create bar (Single Input Engine)
    await expect(page.getByPlaceholder('What video do you want to make?')).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Strategy/i })).toBeVisible();

    // Verify the Brink metric cards + gradient balance card
    await expect(page.getByText('Views · Last 30 Days')).toBeVisible();
    await expect(page.getByText('Est. Monthly Revenue')).toBeVisible();
    await expect(page.getByText('$4,827')).toBeVisible();

    // Verify Recent Activity + Content Categories panels
    await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Content Categories' })).toBeVisible();
    await expect(page.getByText('Tutorials')).toBeVisible();

    // Verify Today's Mission loads
    await expect(page.getByRole('heading', { name: "Today's Mission" })).toBeVisible();
    await expect(page.getByText('Design Thumbnail')).toBeVisible();
  });
});
