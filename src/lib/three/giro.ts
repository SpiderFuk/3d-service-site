/**
 * Giro del Visor 3D: solo sobre el eje vertical (yaw), sin zoom ni paneo
 *
 * - Arrastre con mouse o dedo: el desplazamiento horizontal gira el modelo
 *   (cruzar todo el ancho del marco = una vuelta). El gesto vertical en el
 *   teléfono queda para la página (`touch-action: pan-y` en el marco y el canvas).
 * - Flechas izquierda/derecha con el marco enfocado: ±15°.
 *
 * No importa Three.js: solo calcula ángulos y escucha eventos del DOM.
 */

/** Paso de las flechas: 15° */
export const PASO_TECLA = Math.PI / 12;

/** Ángulo (radianes) para un arrastre horizontal de `dx` px en un marco de `ancho` px */
export function giroPorArrastre(dx: number, ancho: number): number {
	if (!(ancho > 0) || !Number.isFinite(dx)) return 0;
	return (dx / ancho) * 2 * Math.PI;
}

/** Ángulo para una tecla, o null si la tecla no gira el modelo */
export function giroPorTecla(tecla: string): number | null {
	if (tecla === 'ArrowRight') return PASO_TECLA;
	if (tecla === 'ArrowLeft') return -PASO_TECLA;
	return null;
}

export interface OpcionesControlGiro {
	/** Donde se arrastra (el canvas) */
	superficie: HTMLElement;
	/** Elemento enfocable que recibe las flechas (el marco) */
	teclado?: HTMLElement;
	/** Si hay un modelo para girar */
	activo: () => boolean;
	obtener: () => number;
	fijar: (angulo: number) => void;
	/** Se llama en cada giro hecho por la persona */
	ongiro?: () => void;
}

export interface ControlGiro {
	dispose(): void;
}

export function crearControlGiro({
	superficie,
	teclado,
	activo,
	obtener,
	fijar,
	ongiro
}: OpcionesControlGiro): ControlGiro {
	let puntero: number | null = null;
	let ultimoX = 0;

	function girarDe(delta: number) {
		if (!delta) return;
		fijar(obtener() + delta);
		ongiro?.();
	}

	function alBajar(e: PointerEvent) {
		if (!activo() || puntero !== null) return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		puntero = e.pointerId;
		ultimoX = e.clientX;
		superficie.setPointerCapture(e.pointerId);
		superficie.classList.add('girando');
	}

	function alMover(e: PointerEvent) {
		if (e.pointerId !== puntero) return;
		const dx = e.clientX - ultimoX;
		ultimoX = e.clientX;
		girarDe(giroPorArrastre(dx, superficie.clientWidth));
	}

	function alSoltar(e: PointerEvent) {
		if (e.pointerId !== puntero) return;
		if (superficie.hasPointerCapture(e.pointerId)) superficie.releasePointerCapture(e.pointerId);
		puntero = null;
		superficie.classList.remove('girando');
	}

	function alTeclear(e: KeyboardEvent) {
		// Solo con el foco en el marco mismo (no en un botón adentro) y sin atajos
		if (e.target !== teclado || e.altKey || e.ctrlKey || e.metaKey || !activo()) return;
		const delta = giroPorTecla(e.key);
		if (delta === null) return;
		e.preventDefault();
		girarDe(delta);
	}

	superficie.addEventListener('pointerdown', alBajar);
	superficie.addEventListener('pointermove', alMover);
	superficie.addEventListener('pointerup', alSoltar);
	superficie.addEventListener('pointercancel', alSoltar);
	superficie.addEventListener('lostpointercapture', alSoltar);
	teclado?.addEventListener('keydown', alTeclear);

	return {
		dispose() {
			superficie.removeEventListener('pointerdown', alBajar);
			superficie.removeEventListener('pointermove', alMover);
			superficie.removeEventListener('pointerup', alSoltar);
			superficie.removeEventListener('pointercancel', alSoltar);
			superficie.removeEventListener('lostpointercapture', alSoltar);
			teclado?.removeEventListener('keydown', alTeclear);
			superficie.classList.remove('girando');
			puntero = null;
		}
	};
}
