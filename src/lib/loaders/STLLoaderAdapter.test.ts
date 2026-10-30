import { describe, expect, it } from 'vitest';
import { Box3, Mesh, Vector3 } from 'three';
import { STLLoaderAdapter } from './STLLoaderAdapter';
import { ThreeMFLoaderAdapter } from './ThreeMFLoaderAdapter';
import { ModelLoaderFactory } from './ModelLoaderFactory';

/** STL binario de un cubo de 10 mm con una esquina en el origen */
function cuboStl(): ArrayBuffer {
	const v = [
		[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0],
		[0, 0, 10], [10, 0, 10], [10, 10, 10], [0, 10, 10]
	];
	const caras = [
		[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4],
		[1, 2, 6], [1, 6, 5], [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7]
	];
	const buffer = new ArrayBuffer(84 + 50 * caras.length);
	const vista = new DataView(buffer);
	vista.setUint32(80, caras.length, true);
	caras.forEach((cara, i) => {
		let o = 84 + i * 50 + 12;
		for (const k of cara) {
			for (const c of v[k]) {
				vista.setFloat32(o, c, true);
				o += 4;
			}
		}
	});
	return buffer;
}

describe('parse(buffer) de los adapters', () => {
	it('STL: parsea sin leer un File y devuelve el modelo centrado', () => {
		const objeto = new STLLoaderAdapter().parse(cuboStl());
		expect(objeto).toBeInstanceOf(Mesh);
		expect((objeto as Mesh).geometry.getAttribute('position').count).toBe(36);
		const caja = new Box3().setFromObject(objeto);
		expect(caja.getCenter(new Vector3()).length()).toBeCloseTo(0);
		expect(caja.getSize(new Vector3()).toArray()).toEqual([10, 10, 10]);
	});

	it('STL: contenido ilegible lanza un error', () => {
		expect(() => new STLLoaderAdapter().parse(new TextEncoder().encode('hola').buffer)).toThrow();
	});

	it('3MF: contenido que no es un zip lanza un error', () => {
		expect(() => new ThreeMFLoaderAdapter().parse(new Uint8Array([1, 2, 3, 4]).buffer)).toThrow();
	});

	it('el factory da parse para STL y 3MF', () => {
		expect(ModelLoaderFactory.getLoader('a.STL').parse).toBeTypeOf('function');
		expect(ModelLoaderFactory.getLoader('a.3mf').parse).toBeTypeOf('function');
	});
});
