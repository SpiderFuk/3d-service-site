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
		vi.stubGlobal('fetch', vi.fn(async () => respuesta([new Uint8Array(30), new Uint8Array(70)], 100)));
		const avances: number[] = [];
		const archivo = await descargarConProgreso('/models/a.stl', 'a.stl', (f) => avances.push(f));
		expect(archivo.size).toBe(100);
		expect(avances).toEqual([0.3, 1, 1]);
	});

	it('falla si la respuesta no es 2xx', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('no', { status: 404 })));
		await expect(descargarConProgreso('/x.stl', 'x.stl', () => {})).rejects.toThrow('404');
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
			descargarConProgreso('/x.stl', 'x.stl', () => {}, control.signal)
		).rejects.toMatchObject({ name: 'AbortError' });
		expect(fetchFalso.mock.calls[0][1]?.signal).toBe(control.signal);
	});
});
