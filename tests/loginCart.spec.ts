import { test, expect } from '@playwright/test';

test('Login, navigate to Practice, and verify LIVE SOON', async ({ page }) => {
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', 'kamleshautomation1@gmail.com');
  await page.fill('input[name="password"]', 'UiAutomation1');
  await page.click('button[type="submit"]');
  await page.waitForURL('https://freelance-learn-automation.vercel.app/');
  await page.click('a[href="/practice"]');
  await page.waitForSelector('text=LIVE SOON');
  await expect(page.locator('text=LIVE SOON')).toBeVisible();
});
