import { describe, expect, it } from 'vitest';
import { giroPorArrastre, giroPorTecla, PASO_TECLA } from './giro';

describe('giroPorArrastre', () => {
	it('cruzar todo el ancho da una vuelta completa', () => {
		expect(giroPorArrastre(400, 400)).toBeCloseTo(2 * Math.PI);
		expect(giroPorArrastre(-200, 400)).toBeCloseTo(-Math.PI);
	});

	it('es proporcional al ancho del marco', () => {
		expect(giroPorArrastre(10, 200)).toBeCloseTo(2 * giroPorArrastre(10, 400));
	});

	it('sin desplazamiento o sin ancho no gira', () => {
		expect(giroPorArrastre(0, 400)).toBe(0);
		expect(giroPorArrastre(50, 0)).toBe(0);
		expect(giroPorArrastre(Number.NaN, 400)).toBe(0);
	});
});

describe('giroPorTecla', () => {
	it('las flechas giran 15°', () => {
		expect(PASO_TECLA).toBeCloseTo((15 * Math.PI) / 180);
		expect(giroPorTecla('ArrowRight')).toBe(PASO_TECLA);
		expect(giroPorTecla('ArrowLeft')).toBe(-PASO_TECLA);
	});

	it('otras teclas no giran (arriba/abajo siguen moviendo la página)', () => {
		expect(giroPorTecla('ArrowUp')).toBeNull();
		expect(giroPorTecla('ArrowDown')).toBeNull();
		expect(giroPorTecla('Enter')).toBeNull();
		expect(giroPorTecla('a')).toBeNull();
	});
});
