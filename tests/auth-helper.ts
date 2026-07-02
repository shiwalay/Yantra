import { Page } from "@playwright/test";

// Credentials come from the environment so no secret is ever committed.
// Run authed e2e tests with:  TEST_EMAIL=... TEST_PASSWORD=... npx playwright test
export const TEST_EMAIL = process.env.TEST_EMAIL || "";
export const TEST_PASSWORD = process.env.TEST_PASSWORD || "";
export const hasCreds = Boolean(TEST_EMAIL && TEST_PASSWORD);

const BASE = "http://localhost:3000";

/** Logs in through the real Supabase auth UI and waits for the dashboard. */
export async function login(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.fill("input[type=email]", TEST_EMAIL);
  await page.fill("input[type=password]", TEST_PASSWORD);
  await page.click("button[type=submit]");
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}
