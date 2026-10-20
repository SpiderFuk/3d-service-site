/**
 * Capturas por seccion en escritorio, tablet y celular (npm run screenshots)
 *
 * Notas sobre la captura en modo headless (WebGL y raster por software):
 * - Cada seccion se captura en una pagina recien abierta. Reusar la misma pagina acumula
 *   trabajo de las escenas 3D y capturas anteriores, y con el tiempo una captura que en
 *   una pagina nueva tarda ~1 s pasa a superar cualquier timeout.
 * - No se usa fullPage (pinta la pagina por partes y es demasiado lento sin GPU). La seccion
 *   se lleva al tope de la ventana y, si es mas alta que la ventana, la ventana se agranda
 *   para esa captura. El hero se captura con el alto original porque su alto minimo
 *   depende de 100vh.
 * - Los scroll usan behavior 'instant': app.css activa scroll-behavior: smooth.
 * - Se emula prefers-reduced-motion para que la galeria y la autorrotacion 3D esten quietas.
 */

import { test } from '@playwright/test';
import type { Browser, Locator } from '@playwright/test';

const anchos = [
	{ nombre: 'escritorio', width: 1440, height: 900 },
	{ nombre: 'tablet', width: 768, height: 1024 },
	{ nombre: 'celular', width: 390, height: 844 }
];

const SELECTOR_BLOQUES = 'nav, section, footer';

/** Pasa por cada miniatura para que su IntersectionObserver cree el canvas 3D */
async function cargarMiniaturas(visor: Locator): Promise<void> {
	const miniaturas = visor.locator('button.group');
	for (let m = 0; m < (await miniaturas.count()); m++) {
		await miniaturas
			.nth(m)
			.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
		await miniaturas.nth(m).locator('canvas').waitFor({ timeout: 60_000 });
	}
	await visor.page().waitForTimeout(2000);
}

async function capturarBloque(
	browser: Browser,
	baseURL: string,
	indice: number,
	carpeta: string,
	ancho: number,
	alto: number
): Promise<void> {
	const page = await browser.newPage({ baseURL, reducedMotion: 'reduce' });
	try {
		await page.setViewportSize({ width: ancho, height: alto });
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);

		const bloque = page.locator(SELECTOR_BLOQUES).nth(indice);
		const id =
			(await bloque.getAttribute('id')) ??
			(await bloque.evaluate((el) => el.tagName.toLowerCase()));

		// El nav es fijo: se oculta para que no tape el borde superior de las secciones
		if (id !== 'nav') await page.addStyleTag({ content: 'nav { visibility: hidden !important; }' });
		if (id === 'viewer') await cargarMiniaturas(bloque);

		const altoBloque = Math.ceil(await bloque.evaluate((el) => el.getBoundingClientRect().height));
		if (altoBloque > alto) await page.setViewportSize({ width: ancho, height: altoBloque });

		await bloque.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
		await page.waitForTimeout(800);
		const caja = await bloque.evaluate((el) => {
			const r = el.getBoundingClientRect();
			return { x: r.left, y: r.top, width: r.width, height: r.height };
		});
		const ruta = `${carpeta}/${String(indice + 1).padStart(2, '0')}-${id}.png`;
		await page.screenshot({ path: ruta, clip: caja, timeout: 120_000 });
	} finally {
		await page.close();
	}
}

for (const { nombre, width, height } of anchos) {
	test(`capturas ${nombre} (${width}px)`, async ({ browser, baseURL, page }) => {
		await page.goto(baseURL!, { waitUntil: 'networkidle' });
		const total = await page.locator(SELECTOR_BLOQUES).count();
		await page.close();

		for (let i = 0; i < total; i++) {
			await capturarBloque(browser, baseURL!, i, `screenshots/${nombre}-${width}`, width, height);
		}
	});
}
