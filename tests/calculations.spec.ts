import { test, expect, Page } from '@playwright/test';
import { CalculationsPage } from './pages/calculations-page';
import { TEST_DATA } from './utils/test-utils';
import type { DosageForm } from './types/calculations.types';

test.describe('Calculator Tests', () => {
    let calculationsPage: CalculationsPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        calculationsPage = new CalculationsPage(page);
        await calculationsPage.goto();
    });

    test('can select different medicine forms', async () => {
        for (const form of TEST_DATA.DOSAGE_FORMS as DosageForm[]) {
            await calculationsPage.selectDosageForm(form);
            await calculationsPage.takeScreenshot(`${form.toLowerCase()}-view`);
        }
    });

    test.describe('Cream Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Cream' as DosageForm);
        });

        test('can add and remove ingredients', async () => {
            const testIngredient = TEST_DATA.SAMPLE_INGREDIENTS[0];
            const { name, strength } = testIngredient;
            
            await calculationsPage.addIngredient(name, strength);
            const ingredients = await calculationsPage.getIngredients();
            expect(ingredients).toContain(name);
            await calculationsPage.takeScreenshot('cream-ingredient-added');

            await calculationsPage.modifyIngredient(name, 'remove');
            const updatedIngredients = await calculationsPage.getIngredients();
            expect(updatedIngredients).not.toContain(name);
        });

        test('calculations update correctly', async () => {
            const startingUnits = await calculationsPage.finalUnitsInput.inputValue();
            await calculationsPage.updateNumericValue(
                'finalUnits', 
                String(Number(startingUnits) * 2)
            );
            await calculationsPage.takeScreenshot('cream-calculations');
        });
    });

    test.describe('Capsule Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Capsule' as DosageForm);
        });

        test('can change capsule size', async () => {
            await calculationsPage.selectCapsuleSize('#3');
            await calculationsPage.takeScreenshot('capsule-size-3');
        });

        test('can go to pricing page', async ({ page }: { page: Page }) => {
            await calculationsPage.pricingButton.click();
            await expect(page).toHaveURL(/.*pricing/);
        });
    });
});
