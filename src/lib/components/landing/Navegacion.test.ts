/// <reference types="vite/client" />
/**
 * BUILD.md (01 Navegación): los links y el botón de desktop se ocultan en el teléfono
 * solo con la media query; un display en línea la pisaría. Se revisa el código fuente.
 */
import { describe, expect, it } from 'vitest';
import fuente from './Navegacion.svelte?raw';

const marcado = fuente.slice(fuente.indexOf('</script>'), fuente.indexOf('<style>'));
const estilos = fuente.slice(fuente.indexOf('<style>'));
const reglasTelefono = estilos.slice(estilos.indexOf('@media (max-width: 959px)'));

describe('Navegacion: ocultar lo de desktop en el teléfono', () => {
	it('no usa display en línea en el marcado', () => {
		expect(marcado).not.toMatch(/style="[^"]*display/);
		expect(marcado).not.toMatch(/style:display/);
	});

	it('la media query del teléfono oculta los links y el botón de desktop', () => {
		expect(reglasTelefono).toMatch(/\.barra-enlaces,\s*\.barra-cta\s*\{\s*display:\s*none;/);
	});

	it('la píldora, el botón de menú y el panel arrancan ocultos fuera del teléfono', () => {
		const antesDelTelefono = estilos.slice(0, estilos.indexOf('@media (max-width: 959px)'));
		expect(antesDelTelefono).toMatch(
			/\.barra-movil :global\(\.barra-pildora\),\s*\.barra-menu\s*\{\s*display:\s*none;/
		);
		expect(antesDelTelefono).toMatch(/\.panel\s*\{\s*display:\s*none;/);
	});
});
