/// <reference types="vite/client" />
import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import galeriaLocal from '../../../static/content/data/gallery.json';
import { esGaleriaValida } from './trabajosStore';

describe('piezas de Trabajos (gallery.json)', () => {
	it('tiene las 5 piezas de BUILD.md, en orden', () => {
		expect(
			galeriaLocal.items.map((t) => [t.categoria, t.titulo, t.linea].join(' · '))
		).toEqual([
			'Colección · Tu panel de manga favorito · El momento que cambió toda la historia, ahora en relieve.',
			'Momentos · Juntos para siempre · Su historia, en una pieza para la repisa.',
			'Ilustración · Tu escena favorita · La escena que te marcó, ahora al alcance de la mano.',
			'Mascotas · Tu compañero peludo · Con toda su personalidad, en blanco y negro.',
			'Mascotas · Tu gato, en relieve · Hasta el último bigote, en blanco y negro.'
		]);
	});

	it('cada foto existe en static/', () => {
		const archivos = Object.keys(import.meta.glob('../../../static/images/**/*')).map((ruta) =>
			ruta.replace('../../../static', '')
		);
		for (const t of galeriaLocal.items) {
			expect(archivos, t.foto).toContain(t.foto);
		}
	});

	it('el JSON local pasa la validación', () => {
		expect(esGaleriaValida(galeriaLocal)).toBe(true);
	});
});

describe('esGaleriaValida', () => {
	it('rechaza el esquema viejo (title, description, image)', () => {
		const viejo = {
			items: Array.from({ length: 5 }, (_, i) => ({
				id: String(i),
				title: 'Tu compañero peludo',
				description: 'Dale vida a su personalidad única',
				image: '/images/galery/x.jpg',
				category: 'Mascotas',
				createdAt: ''
			})),
			updatedAt: ''
		};
		expect(esGaleriaValida(viejo)).toBe(false);
	});

	it('rechaza menos de 5 piezas (la grilla quedaría con huecos)', () => {
		expect(esGaleriaValida({ items: galeriaLocal.items.slice(0, 4), updatedAt: '' })).toBe(false);
	});

	it('rechaza ids repetidos y campos vacíos', () => {
		const repetidos = structuredClone(galeriaLocal);
		repetidos.items[1].id = repetidos.items[0].id;
		expect(esGaleriaValida(repetidos)).toBe(false);

		const vacio = structuredClone(galeriaLocal);
		vacio.items[2].foto = '';
		expect(esGaleriaValida(vacio)).toBe(false);

		expect(esGaleriaValida(null)).toBe(false);
	});
});

describe('loadTrabajos', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it('usa la copia remota si es válida', async () => {
		const remoto = structuredClone(galeriaLocal);
		remoto.items[0].titulo = 'Otro título';
		vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(remoto))));

		const { trabajosStore, loadTrabajos } = await import('./trabajosStore');
		await loadTrabajos();
		const estado = get(trabajosStore);
		expect(estado.isRemote).toBe(true);
		expect(estado.trabajos[0].titulo).toBe('Otro título');
	});

	it('se queda con la copia del bundle si la remota tiene otro formato', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ items: [] }))));

		const { trabajosStore, loadTrabajos } = await import('./trabajosStore');
		await loadTrabajos();
		const estado = get(trabajosStore);
		expect(estado.isRemote).toBe(false);
		expect(estado.trabajos).toEqual(galeriaLocal.items);
	});

	it('se queda con la copia del bundle si falla la red', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('offline'))));

		const { trabajosStore, loadTrabajos } = await import('./trabajosStore');
		await loadTrabajos();
		expect(get(trabajosStore).trabajos).toEqual(galeriaLocal.items);
		expect(get(trabajosStore).isLoading).toBe(false);
	});
});
