import { test, expect } from '@playwright/test';

test('check iframe content', async ({ page }) => {
    await page.goto('https://compound.direct/');
    
    // Wait for iframe
    const iframe = page.frameLocator('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]');
    await iframe.locator('#root').waitFor({ state: 'visible', timeout: 30000 });
    
    // Check if dosage form select exists
    const dosageForm = iframe.locator('select[data-testid="dosage-form-select"]');
    await expect(dosageForm).toBeVisible({ timeout: 10000 });
    
    // Log the available options
    const options = await dosageForm.locator('option').allTextContents();
    console.log('Available dosage forms:', options);
});
