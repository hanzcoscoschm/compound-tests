import { Page } from '@playwright/test';
import type { DosageForm, CapsuleSize } from '../types/calculations.types';

export interface TestData {
    readonly DOSAGE_FORMS: readonly DosageForm[];
    readonly CAPSULE_SIZES: readonly CapsuleSize[];
    readonly SAMPLE_INGREDIENTS: readonly {
        readonly name: string;
        readonly strength: string;
    }[];
}

export async function waitForIframeLoad(page: Page): Promise<void> {
    await page.waitForSelector('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]', { state: 'visible' });
    const frame = page.frameLocator('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]');
    await frame.locator('#root').waitFor({ state: 'visible' });
}

interface Ingredient {
    name: string;
    strength: string;
}

export const TEST_DATA: TestData = {
    DOSAGE_FORMS: ['Cream', 'Capsule', 'Tablet', 'Suspension', 'Solution', 'Ointment'] as DosageForm[],
    CAPSULE_SIZES: ['#0', '#1', '#2', '#3', '#4', '#5'] as CapsuleSize[],
    SAMPLE_INGREDIENTS: [
        { name: 'Melatonin', strength: '2' },
        { name: 'Vitamin C', strength: '500' },
        { name: 'Zinc', strength: '50' }
    ] as Ingredient[]
};
