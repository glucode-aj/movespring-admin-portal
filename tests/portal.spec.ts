import { contrastFailures } from './contrast';
import { test, expect } from '@playwright/test';
const routes = ['signin', 'signup', 'dashboard', 'employees', 'employees-empty', 'employee-details', 'team-activity', 'add-employee', 'activity-review', 'add-challenge', 'reports'];
for (const theme of ['light', 'dark']) {
  for (const route of routes) {
    test(`${theme}: ${route}`, async ({ page }, testInfo) => {
      const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(value => localStorage.setItem('movespring-theme', value), theme);
      await page.goto(`/#/${route}`);
      await expect(page.locator('.md-root, .ms-root')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const dashed = await page.locator('.md-root *, .ms-root *').evaluateAll(elements => elements.filter(e => getComputedStyle(e).borderTopStyle === 'dashed').map(e => e.className));
      expect(dashed).toEqual([]);
      const nestedCards = await page.locator('.ui-card').evaluateAll(elements => elements.filter(e => [...e.classList].some(c => /(?:label|value|title|desc|left|badges)$/.test(c))).map(e => e.className));
      expect(nestedCards).toEqual([]);
      expect(await page.evaluate(contrastFailures)).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(`${route}-${theme}.png`), fullPage: true });
      expect(errors).toEqual([]);
    });
  }
}
test('navigation and publishing preserve the original routes', async ({ page }) => {
  await page.goto('/#/dashboard');
  await page.getByRole('button', { name: 'Employees', exact: true }).click();
  await expect(page).toHaveURL(/#\/employees$/);
  await expect(page.getByRole('button', { name: 'Employees', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Resend', exact: true }).first().click();
  const invite = page.getByRole('dialog', { name: 'Invitation resent' });
  await expect(invite).toContainText('Mandlakazi');
  await expect(invite).toContainText('sarah.connor@glucode.com');
  await invite.getByRole('button', { name: 'Continue' }).click();
  await page.goto('/#/add-challenge');
  await page.getByLabel('Challenge Name *').fill('Fitness Week');
  await page.getByRole('button', { name: 'Publish Challenge' }).click();
  await expect(page).toHaveURL(/#\/dashboard$/);
  const success = page.getByRole('dialog', { name: 'Challenge created' });
  await expect(success).toBeVisible();
  await expect(success.locator('.ui-lottie-player svg')).toBeVisible();
  await expect(success.locator('.ui-lottie-player svg path').first()).toBeAttached();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('system preference and explicit preference persist', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/#/signin');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
test('reduced motion falcon is static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/employees');
  await page.getByRole('button', { name: 'Resend', exact: true }).first().click();
  await expect(page.locator('.ui-falcon')).toHaveCSS('animation-name', 'none');
});
for (const mode of ['sign-in', 'sign-up']) {
  test(`${mode} waits for authentication and prevents duplicate submits`, async ({ page }) => {
    await page.route('**/src/App.jsx*', route => route.fulfill({ contentType: 'application/javascript', body: `
      import React from '/node_modules/.vite/deps/react.js';
      import Screen from '/src/presentation/screens/auth/${mode}.tsx';
      import { ThemeProvider } from '/src/core/theme/ThemeProvider.tsx';
      window.authenticationCalls = 0;
      const authenticate = () => { window.authenticationCalls++; return new Promise((resolve, reject) => { window.finishAuthentication = resolve; window.failAuthentication = reject; }); };
      export default function App() { return React.createElement(ThemeProvider, null, React.createElement(Screen, { ${mode === 'sign-in' ? 'onSuccessLogin' : 'onSuccessRegister'}: authenticate })); }
    ` }));
    await page.goto('/');
    const assetResponse = page.waitForResponse(response => response.url().endsWith('/assets/animations/auth-loading.json') && response.ok());
    const submit = page.locator('button[type="submit"]');
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(page.getByRole('dialog', { name: 'Signing in' })).toBeVisible();
    expect((await (await assetResponse).json()).nm).toBe('TDMC9W5');
    await expect(page.locator('.ui-lottie-player svg')).toBeVisible();
    await expect(page.locator('.ui-lottie-player svg path').first()).toBeAttached();
    await page.locator('form').evaluate(form => (form as HTMLFormElement).requestSubmit());
    expect(await page.evaluate(() => (window as unknown as { authenticationCalls: number }).authenticationCalls)).toBe(1);
    await page.evaluate(() => (window as unknown as { failAuthentication: (error: Error) => void }).failAuthentication(new Error('Authentication failed')));
    await expect(submit).toBeEnabled();
    await expect(page.getByRole('alert')).toContainText('Authentication failed');
    await submit.click();
    await page.evaluate(() => (window as unknown as { finishAuthentication: () => void }).finishAuthentication());
    await expect(submit).toBeEnabled();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
}
