import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { abiertoAhora } from './hoursStore';

describe('abiertoAhora', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('refleja el horario al suscribirse', () => {
		vi.setSystemTime(new Date('2026-10-26T12:00:00-03:00')); // lunes 12:00
		expect(get(abiertoAhora)).toBe(true);
		vi.setSystemTime(new Date('2026-11-01T12:00:00-03:00')); // domingo
		expect(get(abiertoAhora)).toBe(false);
	});

	it('se recalcula cada minuto', () => {
		vi.setSystemTime(new Date('2026-10-26T17:59:00-03:00'));
		const valores: boolean[] = [];
		const unsubscribe = abiertoAhora.subscribe((v) => valores.push(v));
		expect(valores[valores.length - 1]).toBe(true);

		vi.advanceTimersByTime(60_000); // 18:00
		expect(valores[valores.length - 1]).toBe(false);
		unsubscribe();
	});

	it('limpia el intervalo al desuscribirse', () => {
		vi.setSystemTime(new Date('2026-10-26T12:00:00-03:00'));
		const unsubscribe = abiertoAhora.subscribe(() => {});
		expect(vi.getTimerCount()).toBe(1);
		unsubscribe();
		expect(vi.getTimerCount()).toBe(0);
	});
});
