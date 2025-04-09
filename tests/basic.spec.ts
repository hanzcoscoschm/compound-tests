import { test, expect } from '@playwright/test';

test('check iframe content', async ({ page }) => {
    try {
        // Go to the page and wait for load
        await page.goto('https://compound.direct/', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        // Wait for the specific iframe to be present
        const iframeLocator = page.locator('#compounding-demo iframe');
        await expect(iframeLocator).toBeVisible({ timeout: 30000 });
        
        // Log iframe source
        const iframeSrc = await iframeLocator.getAttribute('src');
        console.log('Found iframe with src:', iframeSrc);
        
        // Get the iframe
        const iframe = page.frameLocator('#compounding-demo iframe');
        
        // Wait for root element
        await expect(iframe.locator('#root')).toBeVisible({ timeout: 30000 });
        
        // Check for form elements (with retry logic)
        const formElements = iframe.locator('select, input, button');
        let retries = 3;
        while (retries > 0) {
            try {
                await expect(formElements.first()).toBeVisible({ timeout: 10000 });
                break;
            } catch (error) {
                console.log(`Retry ${4 - retries} failed, retrying...`);
                retries--;
                if (retries === 0) throw error;
                await page.waitForTimeout(2000);
            }
        }
        
        // Take a screenshot
        await page.screenshot({ 
            path: 'test-results/screenshots/iframe-loaded.png',
            fullPage: true 
        });
        
        console.log('Basic test completed successfully');
    } catch (error) {
        console.error('Error in basic test:', error);
        // Try to take an error screenshot
        try {
            await page.screenshot({ 
                path: 'test-results/screenshots/basic-test-error.png',
                fullPage: true 
            });
        } catch (screenshotError) {
            console.error('Failed to take error screenshot:', screenshotError);
        }
        throw error;
    }
});

test('inspect iframe content', async ({ page }) => {
    // This test is intentionally left empty.
    // It was used for debugging and inspection during development.
});

test('inspect form elements', async ({ page }) => {
    // Go to the page and wait for load
    await page.goto('https://compound.direct/', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
    });
    
    // Wait for the specific iframe to be present
    const iframeLocator = page.locator('#compounding-demo iframe');
    await expect(iframeLocator).toBeVisible({ timeout: 30000 });
    
    // Get the iframe
    const iframe = page.frameLocator('#compounding-demo iframe');
    
    // Wait for root element
    await expect(iframe.locator('#root')).toBeVisible({ timeout: 30000 });
    
    // Log all select elements
    const selects = await iframe.locator('select').all();
    console.log('Found select elements:', await Promise.all(selects.map(async s => ({
        id: await s.getAttribute('id'),
        name: await s.getAttribute('name'),
        class: await s.getAttribute('class'),
        options: await s.locator('option').allTextContents()
    }))));
    
    // Log all input elements
    const inputs = await iframe.locator('input').all();
    console.log('Found input elements:', await Promise.all(inputs.map(async i => ({
        id: await i.getAttribute('id'),
        name: await i.getAttribute('name'),
        type: await i.getAttribute('type'),
        placeholder: await i.getAttribute('placeholder')
    }))));
    
    // Take a screenshot of the form area
    await page.screenshot({ 
        path: 'test-results/screenshots/form-elements.png',
        fullPage: true 
    });
});
