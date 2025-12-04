import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pageRepository/loginPage';

const loginTest = baseTest.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

loginTest('Login to automationexercise.com and verify Logout button', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('kamleshmahtodata1@gmail.com', 'Google@123');
  // Wait for navigation or page update after login
  await loginPage.page.waitForLoadState();
  await expect(loginPage.isLogoutVisible()).resolves.toBe(true);
});
