import { test, expect } from '@playwright/test';

test.describe('Master Data Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/login');
        await page.fill('input[placeholder="NIK"]', '123456');
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    test('should CRUD department', async ({ page }) => {
        await page.goto('/master/department'); // Adjust route

        // Create
        await page.click('button:has-text("Tambah Data")');
        await page.fill('input[name="nama"]', 'New Dept E2E');
        await page.click('button:has-text("Simpan")');
        await expect(page.locator('text=New Dept E2E')).toBeVisible();

        // Edit
        // Find row with 'New Dept E2E' and click edit
        // await page.click('...'); 

        // Delete
        // await page.click('...');
    });
});
