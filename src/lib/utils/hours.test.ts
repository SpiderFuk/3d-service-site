import { afterEach, describe, expect, it } from 'vitest';
import { horaMontevideo, horarioCorto, horarioFrase, horarioLargo, isOpenAt } from './hours';

/** Instante a partir de una hora de Montevideo (UTC-3, sin horario de verano) */
function mvd(fecha: string, hora: string): Date {
	return new Date(`${fecha}T${hora}:00-03:00`);
}

// 2026-10-26 es lunes; 2026-10-31 sábado; 2026-11-01 domingo
const LUNES = '2026-10-26';
const VIERNES = '2026-10-30';
const SABADO = '2026-10-31';
const DOMINGO = '2026-11-01';

describe('horaMontevideo', () => {
	it('devuelve día de la semana y minutos en hora de Montevideo', () => {
		expect(horaMontevideo(mvd(LUNES, '10:30'))).toEqual({ dia: 1, minutos: 630 });
		expect(horaMontevideo(mvd(DOMINGO, '00:00'))).toEqual({ dia: 0, minutos: 0 });
	});

	it('usa el día de Montevideo aunque en UTC ya sea el día siguiente', () => {
		// 22:30 del sábado en Montevideo = 01:30 UTC del domingo
		expect(horaMontevideo(mvd(SABADO, '22:30'))).toEqual({ dia: 6, minutos: 1350 });
	});
});

describe('isOpenAt', () => {
	it('lunes a viernes: abre a las 10:00 y cierra a las 18:00', () => {
		expect(isOpenAt(mvd(LUNES, '09:59'))).toBe(false);
		expect(isOpenAt(mvd(LUNES, '10:00'))).toBe(true);
		expect(isOpenAt(mvd(LUNES, '17:59'))).toBe(true);
		expect(isOpenAt(mvd(LUNES, '18:00'))).toBe(false);
		expect(isOpenAt(mvd(VIERNES, '12:00'))).toBe(true);
	});

	it('sábado: abre de 12:00 a 16:00', () => {
		expect(isOpenAt(mvd(SABADO, '10:00'))).toBe(false);
		expect(isOpenAt(mvd(SABADO, '11:59'))).toBe(false);
		expect(isOpenAt(mvd(SABADO, '12:00'))).toBe(true);
		expect(isOpenAt(mvd(SABADO, '15:59'))).toBe(true);
		expect(isOpenAt(mvd(SABADO, '16:00'))).toBe(false);
	});

	it('domingo: cerrado todo el día', () => {
		expect(isOpenAt(mvd(DOMINGO, '00:00'))).toBe(false);
		expect(isOpenAt(mvd(DOMINGO, '12:00'))).toBe(false);
		expect(isOpenAt(mvd(DOMINGO, '23:59'))).toBe(false);
	});

	it('acepta un horario distinto', () => {
		const h = { week: [540, 1020], sat: [600, 780] } as const;
		expect(isOpenAt(mvd(LUNES, '09:00'), h)).toBe(true);
		expect(isOpenAt(mvd(LUNES, '17:00'), h)).toBe(false);
		expect(isOpenAt(mvd(SABADO, '12:59'), h)).toBe(true);
	});

	describe('visitante en otra zona horaria', () => {
		const tzOriginal = process.env.TZ;

		afterEach(() => {
			process.env.TZ = tzOriginal;
		});

		it('no depende del reloj local del visitante', () => {
			// En Tokio, lunes 10:00 de Montevideo ya es lunes 22:00
			process.env.TZ = 'Asia/Tokyo';
			expect(isOpenAt(mvd(LUNES, '10:00'))).toBe(true);
			// En Madrid, sábado 15:30 de Montevideo es sábado 19:30
			process.env.TZ = 'Europe/Madrid';
			expect(isOpenAt(mvd(SABADO, '15:30'))).toBe(true);
			// En Los Ángeles, lunes 09:00 de Montevideo es lunes 05:00 (y domingo en UTC-12)
			process.env.TZ = 'America/Los_Angeles';
			expect(isOpenAt(mvd(LUNES, '09:00'))).toBe(false);
		});
	});
});

describe('textos del horario', () => {
	it('horarioLargo: dos líneas para Contacto', () => {
		expect(horarioLargo()).toEqual(['Lunes a viernes 10 a 18', 'Sábados 12 a 16']);
	});

	it('horarioCorto: una línea para teléfono', () => {
		expect(horarioCorto()).toBe('L a V 10 a 18 · S 12 a 16');
	});

	it('horarioFrase: frase para la pregunta "¿Cuándo me responden?" y lectores de pantalla', () => {
		expect(horarioFrase()).toBe('lunes a viernes de 10 a 18 y sábados de 12 a 16');
	});

	it('muestra minutos cuando la hora no es en punto', () => {
		const h = { week: [570, 1110], sat: [720, 960] } as const;
		expect(horarioCorto(h)).toBe('L a V 9:30 a 18:30 · S 12 a 16');
	});
});
