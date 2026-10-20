/**
 * Capturas por seccion en escritorio, tablet y celular (npm run screenshots)
 *
 * Notas sobre la captura en modo headless (raster por software):
 * - No se usa fullPage: pinta la pagina por partes y la sombra --extrude (cinco box-shadow
 *   apiladas) tarda ~5 s por pasada sin GPU, asi que la captura supera cualquier timeout.
 * - En su lugar, cada seccion se lleva al tope de la ventana y, si es mas alta que la ventana,
 *   se agranda la ventana solo para esa captura. El hero se captura con el alto original
 *   porque su alto minimo depende de 100vh.
 * - Los scroll usan behavior 'instant': app.css activa scroll-behavior: smooth.
 * - Se emula prefers-reduced-motion (playwright.config.ts) para que la galeria y la
 *   autorrotacion 3D esten quietas.
 */

import { test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const anchos = [
	{ nombre: 'escritorio', width: 1440, height: 900 },
	{ nombre: 'tablet', width: 768, height: 1024 },
	{ nombre: 'celular', width: 390, height: 844 }
];

/** Pasa por cada miniatura para que su IntersectionObserver cree el canvas 3D */
async function cargarMiniaturas(visor: Locator): Promise<void> {
	const miniaturas = visor.locator('button.group');
	for (let m = 0; m < (await miniaturas.count()); m++) {
		await miniaturas.nth(m).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
		await miniaturas.nth(m).locator('canvas').waitFor({ timeout: 60_000 });
	}
}

async function capturarBloque(
	page: Page,
	bloque: Locator,
	ruta: string,
	ancho: number,
	alto: number
): Promise<void> {
	const altoBloque = Math.ceil(await bloque.evaluate((el) => el.getBoundingClientRect().height));
	if (altoBloque > alto) await page.setViewportSize({ width: ancho, height: altoBloque });

	await bloque.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
	await page.waitForTimeout(800);
	const caja = await bloque.evaluate((el) => {
		const r = el.getBoundingClientRect();
		return { x: r.left, y: r.top, width: r.width, height: r.height };
	});
	await page.screenshot({ path: ruta, clip: caja, timeout: 240_000 });

	if (altoBloque > alto) await page.setViewportSize({ width: ancho, height: alto });
}

for (const { nombre, width, height } of anchos) {
	test(`capturas ${nombre} (${width}px)`, async ({ page }) => {
		await page.setViewportSize({ width, height });
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);

		const bloques = page.locator('nav, section, footer');
		const total = await bloques.count();
		for (let i = 0; i < total; i++) {
			const bloque = bloques.nth(i);
			const id =
				(await bloque.getAttribute('id')) ??
				(await bloque.evaluate((el) => el.tagName.toLowerCase()));
			const ruta = `screenshots/${nombre}-${width}/${String(i + 1).padStart(2, '0')}-${id}.png`;

			if (id === 'nav') {
				await capturarBloque(page, bloque, ruta, width, height);
				// El nav es fijo: se oculta para que no tape el borde superior de las secciones
				await page.addStyleTag({ content: 'nav { visibility: hidden !important; }' });
				continue;
			}
			if (id === 'viewer') {
				await cargarMiniaturas(bloque);
				await page.waitForTimeout(2000);
				await capturarBloque(page, bloque, ruta, width, height);

				// Con las cinco escenas 3D activas el raster por software no da abasto para la
				// sombra --extrude de Contacto: se recarga la pagina para seguir sin las miniaturas
				await page.reload({ waitUntil: 'networkidle' });
				await page.evaluate(() => document.fonts.ready);
				await page.addStyleTag({ content: 'nav { visibility: hidden !important; }' });
				continue;
			}
			await capturarBloque(page, bloque, ruta, width, height);
		}
	});
}
