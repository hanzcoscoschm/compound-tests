import { Page, Locator, FrameLocator } from '@playwright/test';
import { waitForIframeLoad } from 'utils/test-utils';
import type { DosageForm, CapsuleSize, NumericField, IngredientAction } from 'types/calculations.types';

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
        await this.waitForIframeLoad();
    }

    private async waitForIframeLoad(): Promise<void> {
        await this.page.waitForSelector('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]', { state: 'visible', timeout: 30000 });
        await this.iframe.locator('#root').waitFor({ state: 'visible', timeout: 30000 });
        await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 30000 });
    }

    async selectDosageForm(form: DosageForm): Promise<void> {
        await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 10000 });
        await this.dosageFormSelect.selectOption(form);
        await this.page.waitForTimeout(1000); // Wait for form to update
    }

    async getIngredients(): Promise<string[]> {
        await this.ingredientsList.waitFor({ timeout: 5000 });
        return this.ingredientsList.allTextContents();
    }

    async addIngredient(name: string, strength: string): Promise<void> {
        await this.addIngredientButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.addIngredientButton.click();
        
        await this.ingredientNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.ingredientNameInput.fill(name);
        await this.ingredientStrengthInput.fill(strength);
        
        const confirmButton = this.iframe.locator('button[data-testid="confirm-add"]');
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();
        await this.page.waitForTimeout(500); // Wait for UI update
    }

    async modifyIngredient(name: string, action: IngredientAction): Promise<void> {
        const ingredient = this.iframe.locator(`[data-testid="ingredient-${name}"]`);
        await ingredient.waitFor({ timeout: 5000 });
        await ingredient.locator('.more-vert').click();
        
        const actionButton = this.iframe.locator(`[data-testid="${action}-option"]`);
        await actionButton.waitFor({ state: 'visible', timeout: 5000 });
        await actionButton.click();
        await this.page.waitForTimeout(500); // Wait for UI update
    }

    async updateNumericValue(field: NumericField, value: string): Promise<void> {
        const inputs: Record<NumericField, Locator> = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        };
        
        const input = inputs[field];
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(value);
        await this.page.waitForTimeout(500); // Wait for calculations to update
    }

    async selectCapsuleSize(size: CapsuleSize): Promise<void> {
        await this.capsuleSizeSelect.waitFor({ state: 'visible', timeout: 5000 });
        await this.capsuleSizeSelect.selectOption(size);
        await this.page.waitForTimeout(500); // Wait for UI update
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}
