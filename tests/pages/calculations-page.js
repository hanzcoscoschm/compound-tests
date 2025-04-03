const { waitForIframeLoad } = require('../utils/test-utils');

class CalculationsPage {
    constructor(page) {
        this.page = page;
        this.iframe = page.frameLocator('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]');
        this.dosageFormSelect = this.iframe.locator('select[data-testid="dosage-form-select"]');
        this.ingredientsList = this.iframe.locator('[data-testid="ingredients-list"]');
        this.expiryDaysInput = this.iframe.locator('input[data-testid="expiry-days"]');
        this.finalUnitsInput = this.iframe.locator('input[data-testid="final-units"]');
        this.wastagePercentageInput = this.iframe.locator('input[data-testid="wastage-percentage"]');
        this.capsuleSizeSelect = this.iframe.locator('select[data-testid="capsule-size"]');
        this.addIngredientButton = this.iframe.locator('button[data-testid="add-ingredient"]');
        this.ingredientNameInput = this.iframe.locator('input[data-testid="ingredient-name"]');
        this.ingredientStrengthInput = this.iframe.locator('input[data-testid="ingredient-strength"]');
        this.pricingButton = this.iframe.getByRole('link', { name: 'Pricing' });
    }

    async goto() {
        await this.page.goto('https://compound.direct/');
        await waitForIframeLoad(this.page);
    }

    async selectDosageForm(form) {
        await this.dosageFormSelect.selectOption(form.toLowerCase());
        await this.page.waitForTimeout(500);
    }

    async getIngredients() {
        return this.ingredientsList.allTextContents();
    }

    async addIngredient(name, strength) {
        await this.addIngredientButton.click();
        await this.ingredientNameInput.fill(name);
        await this.ingredientStrengthInput.fill(strength);
        await this.iframe.locator('button[data-testid="confirm-add"]').click();
    }

    async modifyIngredient(name, action) {
        const ingredient = this.iframe.locator(`[data-testid="ingredient-${name}"]`);
        await ingredient.locator('.more-vert').click();
        await this.iframe.locator(`[data-testid="${action}-option"]`).click();
    }

    async updateNumericValue(field, value) {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field];
        await input.fill(value);
    }

    async selectCapsuleSize(size) {
        await this.capsuleSizeSelect.selectOption(size);
    }

    async takeScreenshot(name) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}

module.exports = {
    CalculationsPage
};
