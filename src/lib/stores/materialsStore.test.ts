import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import stockLocal from '../../../static/content/data/materials.json';
import { esStockValido } from './materialsStore';

describe('stock de filamento (materials.json)', () => {
	it('tiene PLA y PETG con la lista de BUILD.md', () => {
		const pla = stockLocal.materials.pla.colores;
		const petg = stockLocal.materials.petg.colores;
		expect(pla).toHaveLength(12);
		expect(petg).toHaveLength(3);
		expect(pla.filter((c) => c.agotado).map((c) => c.nombre)).toEqual(['Azul', 'Verde', 'Violeta']);
		expect(petg.filter((c) => c.agotado).map((c) => c.nombre)).toEqual(['Negro']);
	});

	it('usa hex válidos (#RRGGBB, o #RRGGBBAA para translúcidos)', () => {
		const colores = [...stockLocal.materials.pla.colores, ...stockLocal.materials.petg.colores];
		for (const c of colores) {
			const translucido = 'translucido' in c && c.translucido === true;
			expect(c.hex).toMatch(translucido ? /^#[0-9A-F]{8}$/ : /^#[0-9A-F]{6}$/);
		}
	});

	it('ids únicos dentro de cada material', () => {
		for (const m of Object.values(stockLocal.materials)) {
			const ids = m.colores.map((c) => c.id);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it('el JSON local pasa la validación', () => {
		expect(esStockValido(stockLocal)).toBe(true);
	});
});

describe('esStockValido', () => {
	it('rechaza el esquema viejo (colores como objeto, sin "agotado")', () => {
		const viejo = {
			materials: {
				pla: {
					nombre: 'PLA',
					disponible: true,
					colores: { negro: { nombre: 'Negro', hex: '#000000', disponible: true } }
				},
				petg: { nombre: 'PETG', disponible: true, colores: {} }
			},
			updatedAt: ''
		};
		expect(esStockValido(viejo)).toBe(false);
	});

	it('rechaza datos sin PLA o PETG', () => {
		expect(esStockValido({ materials: { pla: stockLocal.materials.pla }, updatedAt: '' })).toBe(
			false
		);
		expect(esStockValido(null)).toBe(false);
	});
});

describe('loadMaterials', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it('usa el stock remoto si es válido', async () => {
		const remoto = structuredClone(stockLocal);
		remoto.materials.pla.colores[0].agotado = true;
		vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(remoto))));

		const { materialsStore, loadMaterials } = await import('./materialsStore');
		await loadMaterials();
		const estado = get(materialsStore);
		expect(estado.isRemote).toBe(true);
		expect(estado.materials.pla.colores[0].agotado).toBe(true);
	});

	it('se queda con el stock local si el remoto tiene otro formato', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(JSON.stringify({ materials: { pla: {} }, updatedAt: 'x' })))
		);

		const { materialsStore, loadMaterials } = await import('./materialsStore');
		await loadMaterials();
		const estado = get(materialsStore);
		expect(estado.isRemote).toBe(false);
		expect(estado.materials).toEqual(stockLocal.materials);
	});

	it('se queda con el stock local si falla la red', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('offline'))));

		const { materialsStore, loadMaterials } = await import('./materialsStore');
		await loadMaterials();
		expect(get(materialsStore).isRemote).toBe(false);
		expect(get(materialsStore).isLoading).toBe(false);
	});
});
