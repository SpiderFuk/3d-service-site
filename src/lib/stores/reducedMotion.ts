/**
 * Preferencia del sistema "reducir movimiento" (prefers-reduced-motion)
 * Se usa para detener animaciones automaticas: carrusel de la galeria y autorrotacion 3D
 */

import { readable } from 'svelte/store';

export const prefersReducedMotion = readable(false, (set) => {
	if (typeof window === 'undefined' || !window.matchMedia) return;

	const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(consulta.matches);

	const alCambiar = (evento: MediaQueryListEvent) => set(evento.matches);
	consulta.addEventListener('change', alCambiar);
	return () => consulta.removeEventListener('change', alCambiar);
});
