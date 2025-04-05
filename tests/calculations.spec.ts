import { test, expect, Page } from '@playwright/test';
import { CalculationsPage } from './pages/calculations-page';
import type { DosageForm } from './types/calculations.types';
import { TEST_DATA } from './utils/test-utils';

test.describe('Calculator Tests', () => {
    let calculationsPage: CalculationsPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        calculationsPage = new CalculationsPage(page);
        await calculationsPage.goto();
        await page.waitForLoadState('networkidle');
    });

    test('cycles through all dosage forms with screenshots', async () => {
        for (const form of TEST_DATA.DOSAGE_FORMS) {
            await calculationsPage.selectDosageForm(form);
            await calculationsPage.takeScreenshot(`${form.toLowerCase()}-view`);
            // Verify form selection
            const selectedForm = await calculationsPage.getSelectedDosageForm();
            expect(selectedForm).toBe(form);
        }
    });

    test.describe('Cream Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Cream');
        });

        test('verifies initial ingredients', async () => {
            const ingredients = await calculationsPage.getIngredients();
            expect(ingredients).toHaveLength(2); // Base and Active ingredients
            expect(ingredients[0]).toContain('Base');
            await calculationsPage.takeScreenshot('cream-initial-ingredients');
        });

        test('verifies numeric values multiplication', async () => {
            // Get initial values
            const initialExpiry = await calculationsPage.getNumericValue('expiryDays');
            const initialUnits = await calculationsPage.getNumericValue('finalUnits');
            const initialWastage = await calculationsPage.getNumericValue('wastagePercentage');

            // Multiply by 2
            await calculationsPage.updateNumericValue('expiryDays', (Number(initialExpiry) * 2).toString());
            await calculationsPage.updateNumericValue('finalUnits', (Number(initialUnits) * 2).toString());
            await calculationsPage.updateNumericValue('wastagePercentage', (Number(initialWastage) * 2).toString());

            // Verify new values
            expect(await calculationsPage.getNumericValue('expiryDays')).toBe((Number(initialExpiry) * 2).toString());
            expect(await calculationsPage.getNumericValue('finalUnits')).toBe((Number(initialUnits) * 2).toString());
            expect(await calculationsPage.getNumericValue('wastagePercentage')).toBe((Number(initialWastage) * 2).toString());
            
            await calculationsPage.takeScreenshot('cream-numeric-values-doubled');
        });

        test('verifies Melatonin ingredient addition and base percentage adjustment', async () => {
            // Get initial base percentage
            const initialBasePercentage = await calculationsPage.getIngredientPercentage('Base');
            
            // Add Melatonin
            await calculationsPage.addIngredient('Melatonin', '2');
            await calculationsPage.takeScreenshot('cream-melatonin-added');

            // Verify Melatonin added
            const ingredients = await calculationsPage.getIngredients();
            expect(ingredients.some(i => i.includes('Melatonin'))).toBeTruthy();
            
            // Verify base percentage adjusted
            const newBasePercentage = await calculationsPage.getIngredientPercentage('Base');
            expect(Number(newBasePercentage)).toBe(Number(initialBasePercentage) - 2);
        });

        test('verifies ingredient excipient conversion and removal', async () => {
            // Add Melatonin first
            await calculationsPage.addIngredient('Melatonin', '2');
            
            // Convert to excipient
            await calculationsPage.modifyIngredient('Melatonin', 'use-as-excipient');
            await calculationsPage.takeScreenshot('cream-melatonin-excipient');
            
            // Verify excipient conversion
            const excipientList = await calculationsPage.getExcipients();
            expect(excipientList).toContain('Melatonin');
            
            // Remove ingredient
            await calculationsPage.modifyIngredient('Melatonin', 'remove');
            
            // Verify removal
            const updatedIngredients = await calculationsPage.getIngredients();
            expect(updatedIngredients.some(i => i.includes('Melatonin'))).toBeFalsy();
        });

        test('verifies ingredient order reversal', async () => {
            // Add multiple ingredients
            await calculationsPage.addIngredient('Melatonin', '2');
            await calculationsPage.addIngredient('Caffeine', '1');
            
            // Get initial order
            const initialOrder = await calculationsPage.getIngredients();
            
            // Reverse order
            await calculationsPage.reverseIngredientOrder();
            
            // Get new order
            const newOrder = await calculationsPage.getIngredients();
            
            // Verify order is reversed
            expect(newOrder).toEqual([...initialOrder].reverse());
            await calculationsPage.takeScreenshot('cream-reversed-ingredients');
        });

        // Negative test cases
        test('handles invalid numeric inputs', async () => {
            // Test negative values
            await calculationsPage.updateNumericValue('finalUnits', '-1');
            const finalUnits = await calculationsPage.getNumericValue('finalUnits');
            expect(Number(finalUnits)).toBeGreaterThanOrEqual(0);

            // Test excessive values
            await calculationsPage.updateNumericValue('wastagePercentage', '101');
            const wastage = await calculationsPage.getNumericValue('wastagePercentage');
            expect(Number(wastage)).toBeLessThanOrEqual(100);

            // Test non-numeric input
            await calculationsPage.updateNumericValue('expiryDays', 'abc');
            const expiryDays = await calculationsPage.getNumericValue('expiryDays');
            expect(Number(expiryDays)).not.toBeNaN();
        });

        test('handles duplicate ingredient names', async () => {
            // Add first Melatonin
            await calculationsPage.addIngredient('Melatonin', '2');
            
            // Try to add duplicate
            await calculationsPage.addIngredient('Melatonin', '3');
            
            // Verify only one instance exists or error is shown
            const ingredients = await calculationsPage.getIngredients();
            const melatoninCount = ingredients.filter(i => i.includes('Melatonin')).length;
            expect(melatoninCount).toBe(1);
        });

        test('validates total percentage cannot exceed 100%', async () => {
            // Try to add ingredient with percentage that would exceed 100%
            await calculationsPage.addIngredient('HighDose', '101');
            
            // Verify the ingredient wasn't added or was adjusted
            const ingredients = await calculationsPage.getIngredients();
            const totalPercentage = await calculationsPage.getTotalPercentage();
            expect(Number(totalPercentage)).toBeLessThanOrEqual(100);
        });
    });

    test.describe('Capsule Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Capsule');
        });

        test('verifies initial ingredients', async () => {
            const ingredients = await calculationsPage.getIngredients();
            expect(ingredients).toHaveLength(2); // Should have default ingredients
            await calculationsPage.takeScreenshot('capsule-initial-ingredients');
        });

        test('verifies capsule size change to #3', async () => {
            await calculationsPage.selectCapsuleSize('#3');
            const selectedSize = await calculationsPage.getSelectedCapsuleSize();
            expect(selectedSize).toBe('#3');
            await calculationsPage.takeScreenshot('capsule-size-3');
        });

        test('verifies pricing page redirection', async ({ page }) => {
            await calculationsPage.pricingButton.click();
            await expect(page).toHaveURL(/.*pricing/);
            await calculationsPage.takeScreenshot('pricing-page');
        });

        // Negative test case for Capsule
        test('handles invalid capsule size selection', async () => {
            // Try to select non-existent size
            await calculationsPage.selectCapsuleSize('#7' as any);
            
            // Verify size remains unchanged
            const selectedSize = await calculationsPage.getSelectedCapsuleSize();
            expect(TEST_DATA.CAPSULE_SIZES).toContain(selectedSize as any);
        });
    });
});
