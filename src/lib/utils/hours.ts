/**
 * Utilidades del horario de atención (siempre en hora de Montevideo,
 * nunca con el reloj local del visitante)
 */

import { horario as horarioConfig, ZONA_HORARIA, type Horario, type Rango } from '$lib/config/hours';

const formato = new Intl.DateTimeFormat('es-UY', {
	timeZone: ZONA_HORARIA,
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	hourCycle: 'h23'
});

/** Día de la semana (0 = domingo) y minutos desde la medianoche en Montevideo */
export function horaMontevideo(fecha: Date): { dia: number; minutos: number } {
	const partes = Object.fromEntries(
		formato.formatToParts(fecha).map((p) => [p.type, Number(p.value)])
	) as Record<Intl.DateTimeFormatPartTypes, number>;

	// El día de la semana sale de la fecha numérica para no depender del idioma
	const dia = new Date(Date.UTC(partes.year, partes.month - 1, partes.day)).getUTCDay();

	return { dia, minutos: partes.hour * 60 + partes.minute };
}

function rangoDelDia(dia: number, h: Horario): Rango | null {
	if (dia >= 1 && dia <= 5) return h.week;
	if (dia === 6) return h.sat;
	return null;
}

/** ¿El taller está abierto en ese instante? */
export function isOpenAt(fecha: Date, h: Horario = horarioConfig): boolean {
	const { dia, minutos } = horaMontevideo(fecha);
	const rango = rangoDelDia(dia, h);
	return rango !== null && minutos >= rango[0] && minutos < rango[1];
}

/** 600 → "10", 570 → "9:30" */
function hora(minutos: number): string {
	const h = Math.floor(minutos / 60);
	const m = minutos % 60;
	return m === 0 ? String(h) : `${h}:${String(m).padStart(2, '0')}`;
}

function tramo([apertura, cierre]: Rango): string {
	return `${hora(apertura)} a ${hora(cierre)}`;
}

/** Contacto (desktop): ["Lunes a viernes 10 a 18", "Sábados 12 a 16"] */
export function horarioLargo(h: Horario = horarioConfig): [string, string] {
	return [`Lunes a viernes ${tramo(h.week)}`, `Sábados ${tramo(h.sat)}`];
}

/** Contacto (teléfono): "L a V 10 a 18 · S 12 a 16" */
export function horarioCorto(h: Horario = horarioConfig): string {
	return `L a V ${tramo(h.week)} · S ${tramo(h.sat)}`;
}

/** Preguntas y lectores de pantalla: "lunes a viernes de 10 a 18 y sábados de 12 a 16" */
export function horarioFrase(h: Horario = horarioConfig): string {
	return `lunes a viernes de ${tramo(h.week)} y sábados de ${tramo(h.sat)}`;
}
