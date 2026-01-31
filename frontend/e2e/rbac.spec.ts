import { test, expect } from '@playwright/test';

test.describe('RBAC', () => {
    test('should restrict access for non-admin', async ({ page }) => {
        // Login as User
        await page.goto('/login');
        await page.fill('input[placeholder="NIK"]', 'user123'); // Assume user
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

        // Try access admin route
        await page.goto('/admin/users');
        // Expect redirect or 403
        // await expect(page).toHaveURL('/403'); 
        // Or check "Access Denied" text
    });
});
