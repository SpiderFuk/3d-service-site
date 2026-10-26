/**
 * ¿El taller está abierto ahora? (hora de Montevideo)
 *
 * Se recalcula cada minuto mientras haya suscriptores, así el Hero, Preguntas
 * y la píldora de Contacto cambian juntos al abrir o cerrar.
 */

import { readable } from 'svelte/store';
import { isOpenAt } from '$lib/utils/hours';

const INTERVALO_MS = 60_000;

export const abiertoAhora = readable(isOpenAt(new Date()), (set) => {
	set(isOpenAt(new Date()));
	const id = setInterval(() => set(isOpenAt(new Date())), INTERVALO_MS);
	return () => clearInterval(id);
});
