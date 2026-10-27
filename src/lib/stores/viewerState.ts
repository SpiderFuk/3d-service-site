/**
 * Estado del Visor 3D (sección 08 de BUILD.md)
 *
 * Fases: empty → loading(nombre, pct) → loaded(nombre, origen), o error(tipo).
 * Además guarda el ejemplo elegido (la tarjeta en mantequilla con aria-pressed).
 *
 * Cada carga tiene un número propio: si la persona elige otro archivo o ejemplo
 * mientras uno se abre, el progreso y el resultado del anterior se ignoran.
 * No depende de Three.js: el runtime del visor solo llama a estas funciones.
 */

import { writable } from 'svelte/store';
import { getEjemplo, type EjemploId } from '$lib/config/visorEjemplos';
import { MAX_FILE_SIZE } from '$lib/utils/fileValidation';

/** De dónde viene el modelo: archivo propio o ejemplo del visor */
export type OrigenModelo = 'archivo' | 'ejemplo';

/** tipo: no es STL/3MF · tamano: más de 50 MB · danado: el loader no pudo abrirlo */
export type TipoError = 'tipo' | 'tamano' | 'danado';

export type FaseVisor =
	| { fase: 'empty' }
	| { fase: 'loading'; nombre: string; pct: number; origen: OrigenModelo; carga: number }
	| { fase: 'loaded'; nombre: string; origen: OrigenModelo; carga: number }
	| { fase: 'error'; tipo: TipoError };

export interface ViewerState {
	vista: FaseVisor;
	/** Ejemplo elegido; null si no hay ninguno o se abrió un archivo propio */
	ejemplo: EjemploId | null;
}

/** Extensiones que acepta el visor (el input de archivo usa la misma lista) */
export const EXTENSIONES_VISOR = ['.stl', '.3mf'] as const;

export type ResultadoValidacion = 'ok' | Extract<TipoError, 'tipo' | 'tamano'>;

/**
 * Valida un archivo antes de abrirlo: primero el tipo, después el tamaño.
 * Con más de 50 MB no se intenta abrir.
 */
export function validarArchivoVisor(file: Pick<File, 'name' | 'size'>): ResultadoValidacion {
	const nombre = file.name.toLowerCase();
	const punto = nombre.lastIndexOf('.');
	const extension = punto >= 0 ? nombre.slice(punto) : '';
	if (!(EXTENSIONES_VISOR as readonly string[]).includes(extension)) return 'tipo';
	if (file.size > MAX_FILE_SIZE) return 'tamano';
	return 'ok';
}

const inicial: ViewerState = { vista: { fase: 'empty' }, ejemplo: null };

function crearViewerState() {
	const { subscribe, set, update } = writable<ViewerState>(inicial);
	let ultimaCarga = 0;

	/** Aplica el cambio solo si la carga sigue siendo la actual */
	function siEsLaActual(carga: number, cambio: (s: ViewerState) => ViewerState) {
		update((s) => {
			const v = s.vista;
			if ((v.fase === 'loading' || v.fase === 'loaded') && v.carga === carga) return cambio(s);
			return s;
		});
	}

	function empezar(nombre: string, origen: OrigenModelo, ejemplo: EjemploId | null): number {
		const carga = ++ultimaCarga;
		set({ vista: { fase: 'loading', nombre, pct: 0, origen, carga }, ejemplo });
		return carga;
	}

	return {
		subscribe,

		/**
		 * Archivo propio (input o arrastrar y soltar).
		 * Devuelve el número de carga, o null si no pasó la validación (queda en error).
		 */
		abrirArchivo(file: Pick<File, 'name' | 'size'>): number | null {
			const resultado = validarArchivoVisor(file);
			if (resultado !== 'ok') {
				ultimaCarga++;
				set({ vista: { fase: 'error', tipo: resultado }, ejemplo: null });
				return null;
			}
			return empezar(file.name, 'archivo', null);
		},

		/** Ejemplo del visor; la tarjeta queda marcada */
		abrirEjemplo(id: EjemploId): number {
			return empezar(getEjemplo(id).nombre, 'ejemplo', id);
		},

		/** Porcentaje de lectura (0 a 100) */
		progreso(carga: number, pct: number) {
			const valor = Math.min(100, Math.max(0, Math.round(pct)));
			siEsLaActual(carga, (s) =>
				s.vista.fase === 'loading' ? { ...s, vista: { ...s.vista, pct: valor } } : s
			);
		},

		/** El modelo ya está en la escena */
		listo(carga: number) {
			siEsLaActual(carga, (s) =>
				s.vista.fase === 'loading'
					? {
							...s,
							vista: { fase: 'loaded', nombre: s.vista.nombre, origen: s.vista.origen, carga }
						}
					: s
			);
		},

		/** El loader no pudo abrir el archivo */
		fallo(carga: number, tipo: TipoError = 'danado') {
			siEsLaActual(carga, (s) => ({ ...s, vista: { fase: 'error', tipo } }));
		},

		/** "Probar otro": vuelve al estado vacío y suelta el ejemplo elegido */
		reiniciar() {
			ultimaCarga++;
			set(inicial);
		},

		/** Solo para desarrollo: fuerza un estado para revisarlo a mano */
		forzar(estado: ViewerState) {
			ultimaCarga++;
			set(estado);
		}
	};
}

export const viewerState = crearViewerState();
