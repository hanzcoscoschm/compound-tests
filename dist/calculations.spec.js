"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const calculations_page_1 = require("./pages/calculations-page");
const test_utils_1 = require("./utils/test-utils");
test_1.test.describe('Calculator Tests', () => {
    let calculationsPage;
    test_1.test.beforeEach(async ({ page }) => {
        calculationsPage = new calculations_page_1.CalculationsPage(page);
        await calculationsPage.goto();
    });
    (0, test_1.test)('can select different medicine forms', async () => {
        for (const form of test_utils_1.TEST_DATA.DOSAGE_FORMS) {
            await calculationsPage.selectDosageForm(form);
            await calculationsPage.takeScreenshot(`${form.toLowerCase()}-view`);
        }
    });
    test_1.test.describe('Cream Medicine Tests', () => {
        test_1.test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Cream');
        });
        (0, test_1.test)('can add and remove ingredients', async () => {
            const testIngredient = test_utils_1.TEST_DATA.SAMPLE_INGREDIENTS[0];
            const { name, strength } = testIngredient;
            await calculationsPage.addIngredient(name, strength);
            const ingredients = await calculationsPage.getIngredients();
            (0, test_1.expect)(ingredients).toContain(name);
            await calculationsPage.takeScreenshot('cream-ingredient-added');
            await calculationsPage.modifyIngredient(name, 'remove');
            const updatedIngredients = await calculationsPage.getIngredients();
            (0, test_1.expect)(updatedIngredients).not.toContain(name);
        });
        (0, test_1.test)('calculations update correctly', async () => {
            const startingUnits = await calculationsPage.finalUnitsInput.inputValue();
            await calculationsPage.updateNumericValue('finalUnits', String(Number(startingUnits) * 2));
            await calculationsPage.takeScreenshot('cream-calculations');
        });
    });
    test_1.test.describe('Capsule Medicine Tests', () => {
        test_1.test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Capsule');
        });
        (0, test_1.test)('can change capsule size', async () => {
            await calculationsPage.selectCapsuleSize('#3');
            await calculationsPage.takeScreenshot('capsule-size-3');
        });
        (0, test_1.test)('can go to pricing page', async ({ page }) => {
            await calculationsPage.pricingButton.click();
            await (0, test_1.expect)(page).toHaveURL(/.*pricing/);
        });
    });
});
