/**
 * Horario de atención: ÚNICO lugar donde se define
 *
 * Minutos desde la medianoche, hora de Montevideo. [apertura, cierre).
 * De acá salen el titular del Hero, la respuesta "¿Cuándo me responden?" y
 * el horario + la píldora "abierto ahora" de Contacto. Domingo cerrado; no se
 * contemplan feriados.
 */

export type Rango = readonly [apertura: number, cierre: number];

export interface Horario {
	/** Lunes a viernes */
	week: Rango;
	/** Sábados */
	sat: Rango;
}

export const horario: Horario = {
	week: [600, 1080], // 10:00 a 18:00
	sat: [720, 960] // 12:00 a 16:00
};

export const ZONA_HORARIA = 'America/Montevideo';
