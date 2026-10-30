/**
 * Galería de Trabajos: pieza destacada al azar + el resto en su orden guardado
 */

import type { Trabajo } from '$lib/types/content';

/** Piezas que entran en la grilla: 1 destacada (2 × 2) + 4 chicas, sin huecos */
export const PIEZAS_GALERIA = 5;

/**
 * Elige la pieza destacada. Se llama UNA vez por visita, al montar la sección.
 * Devuelve el id (no el índice) para que la misma pieza siga destacada si
 * después llega una copia nueva del JSON con otro orden.
 */
export function elegirDestacado(items: Trabajo[], azar: number = Math.random()): string | undefined {
	if (items.length === 0) return undefined;
	const indice = Math.min(Math.floor(azar * items.length), items.length - 1);
	return items[indice].id;
}

/**
 * Arma la grilla: la destacada primero y después las demás en su orden guardado,
 * hasta completar PIEZAS_GALERIA. Si el id ya no existe, destaca la primera.
 */
export function armarGaleria(
	items: Trabajo[],
	idDestacado: string | undefined
): { destacado: Trabajo; resto: Trabajo[] } | null {
	if (items.length === 0) return null;
	const destacado = items.find((t) => t.id === idDestacado) ?? items[0];
	const resto = items.filter((t) => t !== destacado).slice(0, PIEZAS_GALERIA - 1);
	return { destacado, resto };
}
