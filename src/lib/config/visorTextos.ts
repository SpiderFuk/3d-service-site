/**
 * Textos del Visor 3D que se usan en más de un lugar (BUILD.md, sección 08)
 *
 * El marco y la región en vivo leen de acá, así un cambio de texto se hace una vez.
 */

import type { TipoError, ViewerState } from '$lib/stores/viewerState';
import { mensajes } from '$lib/config/whatsappMessages';
import { getEjemplo } from '$lib/config/visorEjemplos';

/** Nombre del marco sin modelo abierto (vacío, cargando o error) */
export const nombreMarcoVacio = 'Visor 3D. Elegí un archivo o un ejemplo.';

/** Nombre del marco con el modelo abierto */
export function nombreMarcoCargado(nombre: string): string {
	return `Vista 3D de ${nombre}. Usá las flechas para girarla.`;
}

/** Texto de carga, sin porcentaje (el porcentaje se agrega en pantalla) */
export function textoAbriendo(nombre: string): string {
	return `Abriendo ${nombre}…`;
}

/** Textos de error; los botones van debajo del marco */
export const mensajesError: Record<TipoError, string> = {
	tipo: 'Este archivo no lo podemos abrir. Probá con un STL.',
	tamano: 'Pesa más de 50 MB. Mandánoslo por WhatsApp y lo vemos.',
	danado: 'No pudimos abrirlo. Puede estar dañado: probá exportarlo de nuevo.'
};

/**
 * Mensaje de WhatsApp de "Pedir el precio" con el modelo abierto: archivo propio
 * con su nombre, ejemplo con su artículo ("el Santa borracho", "la Miniatura").
 * null si no hay modelo abierto.
 */
export function mensajePedirPrecio({ vista, ejemplo }: ViewerState): string | null {
	if (vista.fase !== 'loaded') return null;
	if (vista.origen === 'ejemplo' && ejemplo) {
		return mensajes.visorEjemplo(getEjemplo(ejemplo).conArticulo);
	}
	return mensajes.visorArchivo(vista.nombre);
}
