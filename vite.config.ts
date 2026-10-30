import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Contenido de static/content/data/ importable como módulo: `$contenido/materials.json`
 *
 * En dev, Vite no deja importar archivos de static/ desde JavaScript (los trata
 * como públicos y responde 404), y la página queda en blanco. Este plugin los lee
 * del disco, así static/ sigue siendo el único lugar de cada lista y la misma
 * copia se usa en el bundle y en el pedido de runtime.
 */
function contenidoEstatico(): Plugin {
	const prefijo = '$contenido/';
	const virtual = '\0contenido:';
	const carpeta = resolve('static/content/data');

	return {
		name: 'printo-contenido-estatico',
		enforce: 'pre',
		resolveId(id) {
			if (id.startsWith(prefijo)) return virtual + id.slice(prefijo.length);
		},
		load(id) {
			if (!id.startsWith(virtual)) return;
			const archivo = resolve(carpeta, id.slice(virtual.length));
			this.addWatchFile(archivo);
			// El id termina en .json: el plugin JSON de Vite lo convierte en módulo
			return readFileSync(archivo, 'utf8');
		}
	};
}

export default defineConfig({
	plugins: [contenidoEstatico(), sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node'
	}
});
