import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[placeholder="NIK"]', '123456');
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

        await page.goto('/employees');
    });

    test('should display employee list', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Manajemen Karyawan'); // Check header
        // Check for table rows. Virtual table might need specific selector for loaded items.
        // Or wait for a known employee.
    });

    test('should navigate to create employee wizard', async ({ page }) => {
        await page.click('button:has-text("Tambah Karyawan")');
        await expect(page).toHaveURL('/employees/new');
        await expect(page.locator('text=Data Personal')).toBeVisible();
    });

    // Validating full wizard flow requires data entry which is minimal in dummy test
    // test('should complete creating employee', async ({ page }) => { ... });
});
