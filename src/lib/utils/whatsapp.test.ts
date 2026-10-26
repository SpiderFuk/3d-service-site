/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import referencia from '../../../design/landing-v1/landing-final.html?raw';
import { mensajes } from '$lib/config/whatsappMessages';
import { whatsappUrl } from './whatsapp';

describe('whatsappUrl', () => {
	it('arma el link wa.me con el número de contacto', () => {
		expect(whatsappUrl('Hola printo, quiero pedir un presupuesto.')).toBe(
			'https://wa.me/59896341462?text=Hola%20printo%2C%20quiero%20pedir%20un%20presupuesto.'
		);
	});

	it('codifica tildes, ñ y signos de apertura', () => {
		const url = whatsappUrl('¿Cuánto sale? Año, diseño');
		expect(url).toBe('https://wa.me/59896341462?text=%C2%BFCu%C3%A1nto%20sale%3F%20A%C3%B1o%2C%20dise%C3%B1o');
		expect(decodeURIComponent(new URL(url).searchParams.get('text') ?? '')).toBe(
			'¿Cuánto sale? Año, diseño'
		);
	});

	it('codifica caracteres que romperían la URL (&, #, +, saltos de línea)', () => {
		const texto = 'pieza #2 & tapa+base\nv2';
		expect(new URL(whatsappUrl(texto)).searchParams.get('text')).toBe(texto);
	});
});

describe('mensajes', () => {
	it('visorArchivo interpola el nombre del archivo', () => {
		expect(mensajes.visorArchivo('maceta (final).stl')).toBe(
			'Hola printo, quiero saber cuánto sale imprimir maceta (final).stl. Te mando el archivo por acá.'
		);
		expect(whatsappUrl(mensajes.visorArchivo('Dragón & castillo #3.3mf'))).toBe(
			'https://wa.me/59896341462?text=Hola%20printo%2C%20quiero%20saber%20cu%C3%A1nto%20sale%20imprimir%20Drag%C3%B3n%20%26%20castillo%20%233.3mf.%20Te%20mando%20el%20archivo%20por%20ac%C3%A1.'
		);
	});

	it('visorEjemplo interpola el ejemplo con su artículo', () => {
		expect(mensajes.visorEjemplo('el Santa borracho')).toBe(
			'Hola printo, quiero saber cuánto sale imprimir el Santa borracho del visor.'
		);
		expect(mensajes.visorEjemplo('la Miniatura')).toBe(
			'Hola printo, quiero saber cuánto sale imprimir la Miniatura del visor.'
		);
	});

	it('cada link de WhatsApp de la referencia sale de un mensaje del catálogo', () => {
		const links = [...referencia.matchAll(/https:\/\/wa\.me\/[^"]+/g)].map((m) => m[0]);
		expect(links.length).toBeGreaterThan(0);

		const fijos: string[] = Object.values(mensajes).flatMap((m) => (typeof m === 'string' ? [m] : []));
		const generados = new Set(fijos.map(whatsappUrl));
		for (const link of links) {
			expect(generados).toContain(link);
		}
	});
});
