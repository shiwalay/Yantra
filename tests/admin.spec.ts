import { test, expect } from '@playwright/test';

test.describe('Phase 10: Admin Dashboard & RBAC', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the admin interface
    await page.goto('http://localhost:3000/admin');
  });

  test('Super Admin has access to all tabs', async ({ page }) => {
    // By default, it loads as Super Admin
    await expect(page.locator('h2', { hasText: 'Workspace' })).toBeVisible();

    // Verify Executive Dashboard is loaded by default
    await expect(page.getByText('Monthly Recurring Revenue Growth')).toBeVisible();

    // Check multiple random tabs to ensure they exist in the sidebar
    await expect(page.getByRole('button', { name: 'User Management' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'AI Engine Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Affiliate Management' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'System Audit Logs' })).toBeVisible();
  });

  test('RBAC: Analyst role correctly filters tabs', async ({ page }) => {
    // Change role simulator to Analyst
    await page.locator('select').first().selectOption('analyst');

    // Verify Analyst tabs are visible
    await expect(page.getByRole('button', { name: 'Executive Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analytics Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Executive AI Insights' })).toBeVisible();

    // Verify SuperAdmin exclusive tabs are hidden
    await expect(page.getByRole('button', { name: 'User Management' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Billing & Subscriptions' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Marketing Dashboard' })).toBeHidden();
  });

  test('RBAC: Marketing Manager role correctly filters tabs', async ({ page }) => {
    // Change role simulator to Marketing Manager
    await page.locator('select').first().selectOption('marketing');

    // Verify Marketing tabs are visible
    await expect(page.getByRole('button', { name: 'Marketing Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Affiliate Management' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notification Center' })).toBeVisible();

    // Verify SuperAdmin exclusive tabs are hidden
    await expect(page.getByRole('button', { name: 'Developer Console' })).toBeHidden();
  });
});
