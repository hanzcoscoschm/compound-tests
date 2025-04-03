import { Page, Locator, FrameLocator } from '@playwright/test';
import { waitForIframeLoad } from './utils/test-utils';
import type { DosageForm, CapsuleSize, NumericField, IngredientAction } from '../types/calculations.types';

export class CalculationsPage {
    readonly page: Page;
    readonly iframe: FrameLocator;
    readonly dosageFormSelect: Locator;
    readonly ingredientsList: Locator;
    readonly expiryDaysInput: Locator;
    readonly finalUnitsInput: Locator;
    readonly wastagePercentageInput: Locator;
    readonly capsuleSizeSelect: Locator;
    readonly addIngredientButton: Locator;
    readonly ingredientNameInput: Locator;
    readonly ingredientStrengthInput: Locator;
    readonly pricingButton: Locator;

    constructor(page: Page) {
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

    async goto(): Promise<void> {
        await this.page.goto('https://compound.direct/');
        await waitForIframeLoad(this.page);
    }

    async selectDosageForm(form: DosageForm): Promise<void> {
        await this.dosageFormSelect.selectOption(form.toLowerCase());
        await this.page.waitForTimeout(500);
    }

    async getIngredients(): Promise<string[]> {
        return this.ingredientsList.allTextContents();
    }

    async addIngredient(name: string, strength: string): Promise<void> {
        await this.addIngredientButton.click();
        await this.ingredientNameInput.fill(name);
        await this.ingredientStrengthInput.fill(strength);
        await this.iframe.locator('button[data-testid="confirm-add"]').click();
    }

    async modifyIngredient(name: string, action: IngredientAction): Promise<void> {
        const ingredient = this.iframe.locator(`[data-testid="ingredient-${name}"]`);
        await ingredient.locator('.more-vert').click();
        await this.iframe.locator(`[data-testid="${action}-option"]`).click();
    }

    async updateNumericValue(field: NumericField, value: string): Promise<void> {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field] as Locator;
        await input.fill(value);
    }

    async selectCapsuleSize(size: CapsuleSize): Promise<void> {
        await this.capsuleSizeSelect.selectOption(size);
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}
