/**
 * Lectura de archivos con progreso para el Visor 3D (sin Three.js)
 *
 * El avance se informa como fracción de 0 a 1. Nada sale del navegador:
 * los archivos propios se leen localmente y los ejemplos se bajan del propio sitio.
 */

type Avance = (fraccion: number) => void;

/** Error de lectura cortada (otra carga, "Probar otro" o el visor se desmontó) */
function errorCortado(): DOMException {
	return new DOMException('Lectura cortada', 'AbortError');
}

/**
 * Lee un archivo local informando el avance (FileReader onprogress) y devuelve
 * su contenido, listo para parsear sin volver a leerlo.
 * Con `signal` se puede cortar: llama a lector.abort() y rechaza con AbortError.
 */
export function leerConProgreso(
	file: Blob,
	avance: Avance,
	signal?: AbortSignal
): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) return reject(errorCortado());
		const lector = new FileReader();
		const cortar = () => lector.abort();
		signal?.addEventListener('abort', cortar, { once: true });
		const terminar = () => signal?.removeEventListener('abort', cortar);
		lector.onprogress = (e) => {
			if (e.lengthComputable && e.total > 0) avance(e.loaded / e.total);
		};
		lector.onload = () => {
			terminar();
			avance(1);
			resolve(lector.result as ArrayBuffer);
		};
		lector.onerror = () => {
			terminar();
			reject(lector.error ?? new Error('No se pudo leer el archivo'));
		};
		lector.onabort = () => {
			terminar();
			reject(errorCortado());
		};
		lector.readAsArrayBuffer(file);
	});
}

/**
 * Baja un archivo informando el avance (Response en streaming) y devuelve su
 * contenido. Falla si la respuesta no es 2xx. Sin Content-Length no hay avance
 * parcial. Con `signal` se corta la descarga (fetch rechaza con AbortError).
 *
 * Con Content-Length los trozos se copian a un solo buffer reservado de antemano
 * (sin copia extra al final). Si el servidor comprime, Content-Length es menor que
 * lo recibido: se juntan los trozos y se arma el buffer al terminar.
 */
export async function descargarConProgreso(
	url: string,
	avance: Avance,
	signal?: AbortSignal
): Promise<ArrayBuffer> {
	const respuesta = await fetch(url, { signal });
	if (!respuesta.ok) throw new Error(`No se pudo bajar ${url}: ${respuesta.status}`);

	const total = Number(respuesta.headers.get('content-length')) || 0;
	const lector = respuesta.body?.getReader();
	if (!lector) {
		const buffer = await respuesta.arrayBuffer();
		avance(1);
		return buffer;
	}

	let destino: Uint8Array | null = total > 0 ? new Uint8Array(total) : null;
	const partes: Uint8Array[] = [];
	let recibido = 0;
	for (;;) {
		const { done, value } = await lector.read();
		if (done) break;
		if (destino && recibido + value.byteLength <= destino.byteLength) {
			destino.set(value, recibido);
		} else {
			// Más bytes que Content-Length (compresión): pasar a juntar trozos
			if (destino) partes.push(destino.subarray(0, recibido));
			destino = null;
			partes.push(value);
		}
		recibido += value.byteLength;
		if (total > 0) avance(Math.min(1, recibido / total));
	}
	avance(1);

	if (destino) {
		return recibido === destino.byteLength
			? (destino.buffer as ArrayBuffer)
			: (destino.buffer.slice(0, recibido) as ArrayBuffer);
	}
	const junto = new Uint8Array(recibido);
	let posicion = 0;
	for (const parte of partes) {
		junto.set(parte, posicion);
		posicion += parte.byteLength;
	}
	return junto.buffer;
}
