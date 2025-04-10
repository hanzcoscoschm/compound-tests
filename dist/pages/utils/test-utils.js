"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_DATA = void 0;
exports.waitForIframeLoad = waitForIframeLoad;
async function waitForIframeLoad(page) {
    await page.waitForSelector('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]', { state: 'visible' });
    const frame = page.frameLocator('iframe[src="https://d1k1vhh9i7fpj9.cloudfront.net/"]');
    await frame.locator('#root').waitFor({ state: 'visible' });
}
exports.TEST_DATA = {
    DOSAGE_FORMS: ['Cream', 'Capsule', 'Tablet', 'Suspension', 'Solution', 'Ointment'],
    CAPSULE_SIZES: ['#0', '#1', '#2', '#3', '#4', '#5'],
    SAMPLE_INGREDIENTS: [
        { name: 'Melatonin', strength: '2' },
        { name: 'Vitamin C', strength: '500' },
        { name: 'Zinc', strength: '50' }
    ]
};
