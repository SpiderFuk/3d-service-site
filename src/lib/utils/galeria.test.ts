import { describe, expect, it } from 'vitest';
import galeriaLocal from '../../../static/content/data/gallery.json';
import type { Trabajo } from '$lib/types/content';
import { armarGaleria, elegirDestacado, PIEZAS_GALERIA } from './galeria';

const items: Trabajo[] = galeriaLocal.items;
const ids = items.map((t) => t.id);

describe('elegirDestacado', () => {
	it('mapea el azar [0, 1) a cada pieza', () => {
		expect(elegirDestacado(items, 0)).toBe(ids[0]);
		expect(elegirDestacado(items, 0.5)).toBe(ids[2]);
		expect(elegirDestacado(items, 0.9999)).toBe(ids[4]);
	});

	it('sin piezas devuelve undefined', () => {
		expect(elegirDestacado([], 0.3)).toBeUndefined();
	});
});

describe('armarGaleria', () => {
	it('la destacada va primero y el resto sigue el orden guardado', () => {
		for (const id of ids) {
			const g = armarGaleria(items, id)!;
			expect(g.destacado.id).toBe(id);
			expect(g.resto.map((t) => t.id)).toEqual(ids.filter((x) => x !== id));
		}
	});

	it('siempre llena la grilla con 5 piezas aunque el JSON tenga más', () => {
		const mas = [...items, { ...items[0], id: 'extra-1' }, { ...items[1], id: 'extra-2' }];
		const g = armarGaleria(mas, 'extra-2')!;
		expect(g.destacado.id).toBe('extra-2');
		expect(1 + g.resto.length).toBe(PIEZAS_GALERIA);
		expect(g.resto.map((t) => t.id)).toEqual(ids.slice(0, 4));
	});

	it('mantiene la misma destacada si llega una copia con otro orden', () => {
		const elegido = elegirDestacado(items, 0.7);
		const remota = [...items].reverse();
		expect(armarGaleria(remota, elegido)!.destacado.id).toBe(elegido);
	});

	it('si el id ya no existe destaca la primera; sin piezas devuelve null', () => {
		expect(armarGaleria(items, 'no-existe')!.destacado.id).toBe(ids[0]);
		expect(armarGaleria([], 'x')).toBeNull();
	});
});
