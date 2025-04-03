import { test, expect, Page } from '@playwright/test';
import { CalculationsPage } from './pages/calculations-page';
import type { DosageForm } from './types/calculations.types';

test.describe('Calculator Tests', () => {
    let calculationsPage: CalculationsPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        calculationsPage = new CalculationsPage(page);
        await calculationsPage.goto();
        // Additional wait for full page load
        await page.waitForLoadState('networkidle');
    });

    test('can select different medicine forms', async () => {
        const forms: DosageForm[] = ['Cream', 'Capsule', 'Tablet', 'Suspension', 'Solution', 'Ointment'];
        for (const form of forms) {
            await calculationsPage.selectDosageForm(form);
            await calculationsPage.takeScreenshot(`${form.toLowerCase()}-view`);
        }
    });

    test.describe('Cream Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Cream');
        });

        test('can add and remove ingredients', async () => {
            // Add ingredient
            await calculationsPage.addIngredient('Melatonin', '2');
            const ingredients = await calculationsPage.getIngredients();
            expect(ingredients.some(i => i.includes('Melatonin'))).toBeTruthy();
            await calculationsPage.takeScreenshot('cream-ingredient-added');

            // Remove ingredient
            await calculationsPage.modifyIngredient('Melatonin', 'remove');
            const updatedIngredients = await calculationsPage.getIngredients();
            expect(updatedIngredients.some(i => i.includes('Melatonin'))).toBeFalsy();
        });

        test('calculations update correctly', async () => {
            await calculationsPage.updateNumericValue('finalUnits', '100');
            const finalUnitsValue = await calculationsPage.finalUnitsInput.inputValue();
            expect(finalUnitsValue).toBe('100');
            await calculationsPage.takeScreenshot('cream-calculations');
        });
    });

    test.describe('Capsule Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Capsule');
        });

        test('can change capsule size', async () => {
            await calculationsPage.selectCapsuleSize('#3');
            await calculationsPage.takeScreenshot('capsule-size-3');
        });

        test('can go to pricing page', async ({ page }) => {
            await calculationsPage.pricingButton.click();
            await expect(page).toHaveURL(/.*pricing/);
        });
    });
});
