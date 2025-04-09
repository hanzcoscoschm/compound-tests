import { test, expect } from '@playwright/test';
import { CalculationsPage } from './pages/calculations-page';
import { getTestData, waitForIframeLoad } from './utils/test-utils';

test.describe('Compound Direct Calculator Tests', () => {
    let calculationsPage: CalculationsPage;

    test.beforeEach(async ({ page }) => {
        calculationsPage = new CalculationsPage(page);
        await calculationsPage.goto();
        await waitForIframeLoad(page);
    });

    test('should verify percentages in existing capsule formulation', async () => {
        // Verify we're in capsule form
        expect(await calculationsPage.getSelectedDosageForm()).toBe('Capsule');

        // Verify ingredient percentages
        expect(await calculationsPage.getIngredientPercentage('DHEA')).toBe('11.86');
        expect(await calculationsPage.getIngredientPercentage('SELENOMETHIONINE-L')).toBe('3.25');
        expect(await calculationsPage.getIngredientPercentage('VITAMIN D3')).toBe('4.23');
        expect(await calculationsPage.getIngredientPercentage('ZINC PICOLINATE')).toBe('9.15');
        expect(await calculationsPage.getIngredientPercentage('MAGNESIUM GLYCINATE')).toBe('40.65');
        expect(await calculationsPage.getIngredientPercentage('MICROCRYSTALLINE CELLULOSE')).toBe('30.86');

        // Verify total percentage
        const total = await calculationsPage.getTotalPercentage();
        const totalNumber = Number(total);
        expect(totalNumber).toBeCloseTo(100, 1); // Allow for small rounding differences
    });
});
