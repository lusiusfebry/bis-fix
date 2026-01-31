import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should allow user to login', async ({ page }) => {
        // Assume seeding or mock handlers for backend
        // We will just test the UI interaction and assume backend works if we were to run this
        await page.fill('input[placeholder="NIK"]', '123456'); // Adjust selector
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/dashboard');
    });

    test('should show error on invalid credentials', async ({ page }) => {
        await page.fill('input[placeholder="NIK"]', 'wrong');
        await page.fill('input[placeholder="Password"]', 'wrong');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Login Gagal')).toBeVisible(); // Adjust error message
    });
});
