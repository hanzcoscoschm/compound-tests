"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("@playwright/test");
const calculations_page_1 = require("./pages/calculations-page");
const test_utils_1 = require("./utils/test-utils");
// This is where we write our tests! 
test.describe('Calculator Tests', () => {
    let calculationsPage;
    // Before each test, open the calculator
    test.beforeEach(async ({ page }) => {
        calculationsPage = new calculations_page_1.CalculationsPage(page);
        await calculationsPage.goto();
    });
    // Test 1: Check all medicine forms work
    test('can select different medicine forms', async () => {
        // Try each medicine form (cream, capsule, etc.)
        for (const form of test_utils_1.TEST_DATA.DOSAGE_FORMS) {
            await calculationsPage.selectDosageForm(form);
            // Take a picture to make sure it looks right
            await calculationsPage.takeScreenshot(`${form.toLowerCase()}-view`);
        }
    });
    // Test 2: Check cream-specific features
    test.describe('Cream Medicine Tests', () => {
        // Before each cream test, select cream form
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Cream');
        });
        // Test 2.1: Check we can add ingredients
        test('can add and remove ingredients', async () => {
            const testIngredient = test_utils_1.TEST_DATA.SAMPLE_INGREDIENTS[0];
            const { name, strength } = testIngredient;
            // Add an ingredient
            await calculationsPage.addIngredient(name, strength);
            // Make sure it was added
            const ingredients = await calculationsPage.getIngredients();
            test.expect(ingredients).toContain(name);
            // Take a picture after adding
            await calculationsPage.takeScreenshot('cream-ingredient-added');
            // Remove the ingredient
            await calculationsPage.modifyIngredient(name, 'remove');
            // Make sure it was removed
            const updatedIngredients = await calculationsPage.getIngredients();
            test.expect(updatedIngredients).not.toContain(name);
        });
        // Test 2.2: Check calculations work
        test('calculations update correctly', async () => {
            // Get starting values
            const startingUnits = await calculationsPage.finalUnitsInput.inputValue();
            // Double the units
            await calculationsPage.updateNumericValue('finalUnits', String(Number(startingUnits) * 2));
            // Take a picture to check the math
            await calculationsPage.takeScreenshot('cream-calculations');
        });
    });
    // Test 3: Check capsule-specific features
    test.describe('Capsule Medicine Tests', () => {
        test.beforeEach(async () => {
            await calculationsPage.selectDosageForm('Capsule');
        });
        // Test 3.1: Check capsule sizes work
        test('can change capsule size', async () => {
            await calculationsPage.selectCapsuleSize('#3');
            await calculationsPage.takeScreenshot('capsule-size-3');
        });
        // Test 3.2: Check we can go to pricing
        test('can go to pricing page', async ({ page }) => {
            await calculationsPage.pricingButton.click();
            await test.expect(page).toHaveURL(/.*pricing/);
        });
    });
});
