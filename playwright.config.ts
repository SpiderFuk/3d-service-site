import { defineConfig } from '@playwright/test';

/**
 * Capturas de QA visual (npm run screenshots)
 * Compila el sitio, levanta vite preview y guarda capturas en screenshots/
 */
export default defineConfig({
	testDir: 'tests',
	outputDir: 'test-results',
	timeout: 600_000,
	// En serie: en paralelo las tres capturas compiten por la CPU (raster por software) y la
	// seccion Contacto de escritorio no termina a tiempo
	workers: 1,
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:4173',
		// Sin animaciones automaticas (galeria, autorrotacion 3D): capturas deterministas
		reducedMotion: 'reduce',
		// WebGL por software para que Three.js renderice en modo headless
		launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }
	},
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173 --strictPort',
		url: 'http://localhost:4173',
		reuseExistingServer: true,
		timeout: 180_000
	}
});
