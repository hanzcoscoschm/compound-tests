import { Page } from '@playwright/test';
import type { CompoundFormulation } from '../types/calculations.types';

export const DEFAULT_TIMEOUT = 30000;

export function getTestData(): CompoundFormulation {
    return {
        dosageForm: 'Capsule',
        ingredients: [
            {
                name: 'Progesterone',
                strength: 100,
                strengthUnit: 'mg',
                isExcipient: false,
                percentage: 80
            },
            {
                name: 'Pregnenolone',
                strength: 25,
                strengthUnit: 'mg',
                isExcipient: false,
                percentage: 20
            }
        ],
        expiryDays: 90,
        finalUnits: 30,
        wastagePercentage: 10,
        capsuleSize: '0'
    };
}

export async function waitForIframeLoad(page: Page): Promise<void> {
    try {
        await page.waitForSelector('#compounding-demo iframe', { state: 'visible', timeout: DEFAULT_TIMEOUT });
        const frame = page.frameLocator('#compounding-demo iframe');
        await frame.locator('#root').waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT });
    } catch (error) {
        console.error('Error in waitForIframeLoad:', error);
        throw error;
    }
}

export async function takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
        path: `test-results/screenshots/${name}.png`,
        fullPage: true 
    });
}
