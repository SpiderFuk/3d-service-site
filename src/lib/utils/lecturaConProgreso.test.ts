import { afterEach, describe, expect, it, vi } from 'vitest';
import { descargarConProgreso } from './lecturaConProgreso';

afterEach(() => {
	vi.unstubAllGlobals();
});

/** Respuesta en streaming que entrega los trozos de a uno */
function respuesta(trozos: Uint8Array[], largo?: number): Response {
	const cuerpo = new ReadableStream<Uint8Array>({
		start(c) {
			trozos.forEach((t) => c.enqueue(t));
			c.close();
		}
	});
	const headers = largo ? { 'content-length': String(largo) } : undefined;
	return new Response(cuerpo, { headers });
}

describe('descargarConProgreso', () => {
	it('informa el avance por bytes y termina en 1', async () => {
		const avances: number[] = [];
		const datos = new Uint8Array(100).map((_, i) => i);
		vi.stubGlobal('fetch', vi.fn(async () => respuesta([datos.slice(0, 30), datos.slice(30)], 100)));
		const buffer = await descargarConProgreso('/models/a.stl', (f) => avances.push(f));
		expect(new Uint8Array(buffer)).toEqual(datos);
		expect(avances).toEqual([0.3, 1, 1]);
	});

	it('sin Content-Length o con compresión arma el buffer completo', async () => {
		const datos = new Uint8Array(50).map((_, i) => 200 - i);
		for (const largo of [undefined, 20]) {
			vi.stubGlobal('fetch', vi.fn(async () => respuesta([datos.slice(0, 15), datos.slice(15)], largo)));
			const buffer = await descargarConProgreso('/x.stl', () => {});
			expect(new Uint8Array(buffer)).toEqual(datos);
		}
	});

	it('falla si la respuesta no es 2xx', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('no', { status: 404 })));
		await expect(descargarConProgreso('/x.stl', () => {})).rejects.toThrow('404');
	});

	it('pasa la señal a fetch para poder cortar la descarga', async () => {
		const fetchFalso = vi.fn(async (_url: string, init?: RequestInit) => {
			if (init?.signal?.aborted) throw new DOMException('cortado', 'AbortError');
			return respuesta([new Uint8Array(1)]);
		});
		vi.stubGlobal('fetch', fetchFalso);
		const control = new AbortController();
		control.abort();
		await expect(
			descargarConProgreso('/x.stl', () => {}, control.signal)
		).rejects.toMatchObject({ name: 'AbortError' });
		expect(fetchFalso.mock.calls[0][1]?.signal).toBe(control.signal);
	});
});
