import { Page, Locator, FrameLocator, expect } from '@playwright/test';
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
        this.iframe = page.frameLocator('#compounding-demo iframe');
        
        // Update selectors to match React Select components
        this.dosageFormSelect = this.iframe.locator('.react-select__control').first();
        this.ingredientsList = this.iframe.locator('form').first();
        this.expiryDaysInput = this.iframe.locator('input[type="number"]').first();
        this.finalUnitsInput = this.iframe.locator('input[placeholder="e.g. 100"]');
        this.wastagePercentageInput = this.iframe.locator('input[type="number"]').nth(1);
        this.capsuleSizeSelect = this.iframe.locator('.react-select__control').nth(1);
        this.addIngredientButton = this.iframe.locator('[role="button"], button, .clickable, div', { 
            hasText: /^Add Ingredient$/
        });
        this.ingredientNameInput = this.iframe.locator('.react-select__control').nth(2);
        this.ingredientStrengthInput = this.iframe.locator('input[placeholder="Strength"]').first();
        this.pricingButton = this.iframe.getByRole('link', { name: /pricing/i });
        this.ingredientRows = this.iframe.locator('.sc-dIfARi');
        this.moreVertButtons = this.iframe.locator('button[aria-label*="options"]');
        this.excipientsList = this.iframe.locator('[role="list"]').nth(1);
        this.reverseOrderButton = this.iframe.locator('button[aria-label*="reverse"]');
    }

    async goto(): Promise<void> {
        try {
            await this.page.goto('https://compound.direct/', { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });
            
            // Wait for iframe
            const iframeLocator = this.page.locator('#compounding-demo iframe');
            await expect(iframeLocator).toBeVisible({ timeout: 30000 });
            
            // Log iframe source for debugging
            const iframeSrc = await iframeLocator.getAttribute('src');
            console.log('Found iframe with src:', iframeSrc);
            
            // Wait for React app to initialize
            await this.iframe.locator('#root').waitFor({ state: 'visible', timeout: 30000 });
            await this.page.waitForTimeout(2000); // Give React time to hydrate
            
            // Wait for form to be ready
            await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 30000 });
            
            console.log('Calculator page loaded successfully');
        } catch (error) {
            console.error('Error loading calculator page:', error);
            await this.page.screenshot({ path: 'test-results/screenshots/page-load-error.png', fullPage: true });
            throw error;
        }
    }

    async selectDosageForm(form: DosageForm): Promise<void> {
        try {
            // Wait for and click the select container
            await this.dosageFormSelect.waitFor({ state: 'visible', timeout: 30000 });
            await this.dosageFormSelect.click();
            
            // Wait for menu to open
            const menu = this.iframe.locator('.react-select__menu');
            await menu.waitFor({ state: 'visible', timeout: 30000 });
            
            // Click the option
            const option = menu.locator(`.react-select__option:has-text("${form}")`);
            await option.waitFor({ state: 'visible', timeout: 30000 });
            await option.click();
            
            // Wait for form to update
            await this.page.waitForTimeout(1000);
            
            console.log(`Selected dosage form: ${form}`);
        } catch (error) {
            console.error(`Error selecting dosage form ${form}:`, error);
            await this.page.screenshot({ path: `test-results/screenshots/select-form-error-${form}.png`, fullPage: true });
            throw error;
        }
    }

    async getSelectedDosageForm(): Promise<string> {
        const selectValue = this.iframe.locator('.react-select__single-value').first();
        await selectValue.waitFor({ state: 'visible', timeout: 30000 });
        const text = await selectValue.textContent();
        if (!text) {
            throw new Error('Could not get selected dosage form value');
        }
        return text;
    }

    async addIngredient(name: string, strength: string): Promise<void> {
        try {
            // Try to find the Add Ingredient button
            const addButton = await this.addIngredientButton.elementHandle();
            if (!addButton) {
                console.error('Add Ingredient button not found, logging page state...');
                const clickableElements = await this.iframe.locator('[role="button"], button, .clickable, div').all();
                console.log('Current clickable elements:', await Promise.all(clickableElements.map(async el => ({
                    text: await el.textContent(),
                    tag: await el.evaluate(node => node.tagName.toLowerCase()),
                    class: await el.getAttribute('class'),
                    role: await el.getAttribute('role')
                }))));
                throw new Error('Add Ingredient button not found');
            }
            
            await addButton.click();
            await this.page.waitForTimeout(500); // Wait for modal to open
            
            // Select ingredient name
            await this.ingredientNameInput.waitFor({ state: 'visible', timeout: 30000 });
            await this.ingredientNameInput.click();
            
            // Wait for menu to open
            const menu = this.iframe.locator('.react-select__menu');
            await menu.waitFor({ state: 'visible', timeout: 30000 });
            
            // Click the option
            const option = menu.locator(`.react-select__option:has-text("${name}")`);
            await option.waitFor({ state: 'visible', timeout: 30000 });
            await option.click();
            
            // Enter strength
            await this.ingredientStrengthInput.waitFor({ state: 'visible', timeout: 30000 });
            await this.ingredientStrengthInput.fill(strength);
            await this.ingredientStrengthInput.press('Enter');
            
            await this.page.waitForTimeout(1000); // Wait for ingredient to be added
            console.log(`Added ingredient: ${name} with strength ${strength}`);
        } catch (error) {
            console.error(`Error adding ingredient ${name}:`, error);
            await this.page.screenshot({ path: `test-results/screenshots/add-ingredient-error-${name}.png`, fullPage: true });
            throw error;
        }
    }

    async getIngredients(): Promise<string[]> {
        // Wait for any ingredient row to be visible
        await this.ingredientRows.first().waitFor({ state: 'visible', timeout: 30000 });
        const rows = await this.ingredientRows.all();
        return Promise.all(rows.map(async row => {
            const text = await row.textContent();
            if (!text) {
                throw new Error('Could not get ingredient row text');
            }
            return text;
        }));
    }

    async getIngredientPercentage(name: string): Promise<string> {
        const ingredients = await this.getIngredients();
        for (const ingredient of ingredients) {
            if (ingredient.includes(name)) {
                const match = ingredient.match(/(\d+(?:\.\d+)?)%/);
                return match ? match[1] : '0';
            }
        }
        return '0';
    }

    async modifyIngredient(name: string, action: IngredientAction): Promise<void> {
        try {
            const rows = await this.ingredientRows.all();
            for (let i = 0; i < rows.length; i++) {
                const text = await rows[i].textContent();
                if (text?.includes(name)) {
                    await this.moreVertButtons.nth(i).click();
                    const menuItem = this.iframe.getByRole('menuitem', { name: action });
                    await menuItem.waitFor({ state: 'visible', timeout: 30000 });
                    await menuItem.click();
                    await this.page.waitForTimeout(1000);
                    console.log(`Modified ingredient ${name} with action ${action}`);
                    return;
                }
            }
            throw new Error(`Ingredient ${name} not found`);
        } catch (error) {
            console.error(`Error modifying ingredient ${name}:`, error);
            await this.page.screenshot({ path: `test-results/screenshots/modify-ingredient-error-${name}.png`, fullPage: true });
            throw error;
        }
    }

    async getExcipients(): Promise<string[]> {
        await this.excipientsList.waitFor({ state: 'visible', timeout: 30000 });
        const items = await this.excipientsList.locator('li').all();
        return Promise.all(items.map(async item => {
            const text = await item.textContent();
            if (!text) {
                throw new Error('Could not get excipient text');
            }
            return text;
        }));
    }

    async updateNumericValue(field: NumericField, value: string): Promise<void> {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field];
        
        await input.waitFor({ state: 'visible', timeout: 30000 });
        await input.click();
        await input.fill(value);
        await input.press('Enter');
        await this.page.waitForTimeout(500);
        console.log(`Updated ${field} to ${value}`);
    }

    async getNumericValue(field: NumericField): Promise<string> {
        const input = {
            expiryDays: this.expiryDaysInput,
            finalUnits: this.finalUnitsInput,
            wastagePercentage: this.wastagePercentageInput
        }[field];
        
        await input.waitFor({ state: 'visible', timeout: 30000 });
        return input.inputValue();
    }

    async selectCapsuleSize(size: CapsuleSize): Promise<void> {
        try {
            // Wait for and click the select container
            await this.capsuleSizeSelect.waitFor({ state: 'visible', timeout: 30000 });
            await this.capsuleSizeSelect.click();
            
            // Wait for menu to open
            const menu = this.iframe.locator('.react-select__menu');
            await menu.waitFor({ state: 'visible', timeout: 30000 });
            
            // Click the option
            const option = menu.locator(`.react-select__option:has-text("${size}")`);
            await option.waitFor({ state: 'visible', timeout: 30000 });
            await option.click();
            
            await this.page.waitForTimeout(500);
            console.log(`Selected capsule size: ${size}`);
        } catch (error) {
            console.error(`Error selecting capsule size ${size}:`, error);
            await this.page.screenshot({ path: `test-results/screenshots/select-size-error-${size}.png`, fullPage: true });
            throw error;
        }
    }

    async getSelectedCapsuleSize(): Promise<string> {
        const selectValue = this.iframe.locator('.react-select__single-value').nth(1);
        await selectValue.waitFor({ state: 'visible', timeout: 30000 });
        const text = await selectValue.textContent();
        if (!text) {
            throw new Error('Could not get selected capsule size value');
        }
        return text;
    }

    async reverseIngredientOrder(): Promise<void> {
        await this.reverseOrderButton.waitFor({ state: 'visible', timeout: 30000 });
        await this.reverseOrderButton.click();
        await this.page.waitForTimeout(500);
        console.log('Reversed ingredient order');
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
}
