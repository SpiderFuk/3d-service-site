/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import build from '../../../design/landing-v1/BUILD.md?raw';
import { preguntasFrecuentes } from './faq';
import { horarioFrase } from '$lib/utils/hours';

/** Las ocho filas "N. ¿Pregunta? · Respuesta" de la sección 09 de BUILD.md */
function preguntasDeBuild(): { pregunta: string; respuesta: string }[] {
	const seccion = build.split('### 09 Preguntas')[1].split('### 10 Contacto')[0];
	return [...seccion.matchAll(/^\s+\d\. (¿[^?]+\?) · (.+)$/gm)].map(([, pregunta, respuesta]) => ({
		pregunta,
		// La 8 lleva una nota para el desarrollador al final
		respuesta: respuesta.replace(/ \(from the hours setting\)$/, '')
	}));
}

describe('preguntasFrecuentes', () => {
	it('tiene las ocho preguntas con el texto exacto de BUILD.md', () => {
		const esperadas = preguntasDeBuild();
		expect(esperadas).toHaveLength(8);
		expect(preguntasFrecuentes).toEqual(esperadas);
	});

	it('arma la respuesta 8 desde el horario', () => {
		expect(preguntasFrecuentes[7].respuesta).toBe(
			`En minutos, en horario de atención: ${horarioFrase()}.`
		);
	});
});
