import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Excel Import', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[placeholder="NIK"]', '123456');
        await page.fill('input[placeholder="Password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    test('should upload employee excel file', async ({ page }) => {
        await page.goto('/import/employees'); // Adjust route

        // Ensure file input exists
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeVisible();

        // Create dummy buffer (or use existing file if environment has one)
        // Playwright allows buffer upload
        await fileInput.setInputFiles({
            name: 'employees.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            buffer: Buffer.from('dummy-content') // This won't parse on backend but frontend upload logic can be tested
        });

        // Click upload/preview
        await page.click('button:has-text("Upload")');

        // Verify response or preview table visible
        // await expect(page.locator('table')).toBeVisible(); 
    });
});
