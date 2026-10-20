/**
 * Genera static/og-image.png (1200x630) a partir de scripts/og-image.html
 * Uso: npm run og-image
 */

import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const template = pathToFileURL(path.join(root, 'scripts/og-image.html')).href;
const output = path.join(root, 'static/og-image.png');

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await page.goto(template, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: output });
	console.log(`Imagen social generada: ${path.relative(root, output)}`);
} finally {
	await browser.close();
}
