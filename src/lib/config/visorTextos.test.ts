import { describe, expect, it } from 'vitest';
import { mensajePedirPrecio } from './visorTextos';
import { whatsappUrl } from '$lib/utils/whatsapp';

const cargado = (nombre: string, origen: 'archivo' | 'ejemplo') =>
	({ fase: 'loaded', nombre, origen, carga: 1 }) as const;

describe('mensajePedirPrecio', () => {
	it('archivo propio: nombre del archivo y aviso de que lo manda por el chat', () => {
		expect(mensajePedirPrecio({ vista: cargado('soporte.stl', 'archivo'), ejemplo: null })).toBe(
			'Hola printo, quiero saber cuánto sale imprimir soporte.stl. Te mando el archivo por acá.'
		);
	});

	it('ejemplos con su artículo (BUILD.md)', () => {
		const casos = [
			['santa', 'Santa borracho', 'el Santa borracho'],
			['miniatura', 'Miniatura', 'la Miniatura'],
			['jarron', 'Jarrón', 'el Jarrón'],
			['cuadro', 'Cuadro en relieve', 'el Cuadro en relieve']
		] as const;
		for (const [id, nombre, conArticulo] of casos) {
			expect(mensajePedirPrecio({ vista: cargado(nombre, 'ejemplo'), ejemplo: id })).toBe(
				`Hola printo, quiero saber cuánto sale imprimir ${conArticulo} del visor.`
			);
		}
	});

	it('sin modelo abierto no hay mensaje', () => {
		expect(mensajePedirPrecio({ vista: { fase: 'empty' }, ejemplo: null })).toBeNull();
		expect(mensajePedirPrecio({ vista: { fase: 'error', tipo: 'tamano' }, ejemplo: null })).toBeNull();
	});

	it('el link codifica acentos y signos', () => {
		const mensaje = mensajePedirPrecio({ vista: cargado('Jarrón', 'ejemplo'), ejemplo: 'jarron' })!;
		expect(whatsappUrl(mensaje)).toBe(
			'https://wa.me/59896341462?text=Hola%20printo%2C%20quiero%20saber%20cu%C3%A1nto%20sale%20imprimir%20el%20Jarr%C3%B3n%20del%20visor.'
		);
	});
});
