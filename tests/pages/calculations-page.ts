import { Page, Locator, FrameLocator } from '@playwright/test';
import { waitForIframeLoad } from '../utils/test-utils';
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
    readonly ingredientRows: Locator;
    readonly moreVertButtons: Locator;
    readonly excipientsList: Locator;
    readonly reverseOrderButton: Locator;

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
        this.ingredientRows = this.iframe.locator('[data-testid="ingredient-row"]');
        this.moreVertButtons = this.iframe.locator('button[aria-label="more options"]');
        this.excipientsList = this.iframe.locator('[data-testid="excipients-list"]');
        this.reverseOrderButton = this.iframe.locator('button[aria-label="reverse order"]');
    }

    async goto(): Promise<void> {
        await this.page.goto('https://compound.direct/');
        await this.waitForIframeLoad();
    }

    async waitForIframeLoad(): Promise<void> {
        await this.page.waitForSelector('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]', { state: 'visible', timeout: 30000 });
        await this.iframe.locator('#root').waitFor({ state: 'visible', timeout: 30000 });
        await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 30000 });
    }

    async selectDosageForm(form: DosageForm): Promise<void> {
        await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 10000 });
        await this.dosageFormSelect.selectOption(form);
        await this.page.waitForTimeout(1000); // Wait for form to update
    }

    async getSelectedDosageForm(): Promise<string> {
        const value = await this.dosageFormSelect.inputValue();
        return value;
    }

    async getIngredients(): Promise<string[]> {
        await this.ingredientsList.waitFor();
        const rows = await this.ingredientRows.all();
        return Promise.all(rows.map(async row => await row.textContent() || ''));
    }

    async getNumericValue(field: NumericField): Promise<string> {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field];
        return await input.inputValue();
    }

    async updateNumericValue(field: NumericField, value: string): Promise<void> {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field];
        await input.fill(value);
        await input.press('Enter');
    }

    async addIngredient(name: string, strength: string): Promise<void> {
        await this.addIngredientButton.click();
        await this.ingredientNameInput.fill(name);
        await this.ingredientStrengthInput.fill(strength);
        await this.ingredientStrengthInput.press('Enter');
        await this.page.waitForTimeout(500); // Wait for ingredient to be added
    }

    async getIngredientPercentage(name: string): Promise<string> {
        const rows = await this.ingredientRows.all();
        for (const row of rows) {
            const text = await row.textContent();
            if (text?.includes(name)) {
                const percentage = text.match(/(\d+(?:\.\d+)?)%/)?.[1];
                return percentage || '0';
            }
        }
        return '0';
    }

    async modifyIngredient(name: string, action: IngredientAction): Promise<void> {
        const rows = await this.ingredientRows.all();
        for (let i = 0; i < rows.length; i++) {
            const text = await rows[i].textContent();
            if (text?.includes(name)) {
                await this.moreVertButtons.nth(i).click();
                await this.iframe.getByRole('menuitem', { name: action === 'use-as-excipient' ? 'Use as excipient' : 'Remove' }).click();
                break;
            }
        }
        await this.page.waitForTimeout(500); // Wait for action to complete
    }

    async getExcipients(): Promise<string[]> {
        await this.excipientsList.waitFor();
        const items = await this.excipientsList.locator('li').all();
        return Promise.all(items.map(async item => await item.textContent() || ''));
    }

    async reverseIngredientOrder(): Promise<void> {
        await this.reverseOrderButton.click();
        await this.page.waitForTimeout(500); // Wait for order to update
    }

    async selectCapsuleSize(size: CapsuleSize): Promise<void> {
        await this.capsuleSizeSelect.selectOption(size);
        await this.page.waitForTimeout(500); // Wait for size to update
    }

    async getSelectedCapsuleSize(): Promise<string> {
        return await this.capsuleSizeSelect.inputValue();
    }

    async getTotalPercentage(): Promise<string> {
        const ingredients = await this.getIngredients();
        let total = 0;
        for (const ingredient of ingredients) {
            const percentage = ingredient.match(/(\d+(?:\.\d+)?)%/)?.[1];
            if (percentage) {
                total += Number(percentage);
            }
        }
        return total.toString();
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
    }
}
