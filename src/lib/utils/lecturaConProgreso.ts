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
 * Lee un archivo local informando el avance (FileReader onprogress).
 * Con `signal` se puede cortar: llama a lector.abort() y rechaza con AbortError.
 */
export function leerConProgreso(file: Blob, avance: Avance, signal?: AbortSignal): Promise<void> {
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
			resolve();
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
 * Baja un archivo informando el avance (Response en streaming).
 * Falla si la respuesta no es 2xx. Sin Content-Length no hay avance parcial.
 * Con `signal` se corta la descarga (fetch rechaza con AbortError).
 */
export async function descargarConProgreso(
	url: string,
	nombre: string,
	avance: Avance,
	signal?: AbortSignal
): Promise<File> {
	const respuesta = await fetch(url, { signal });
	if (!respuesta.ok) throw new Error(`No se pudo bajar ${url}: ${respuesta.status}`);

	// Con compresión, Content-Length es el tamaño comprimido: se limita a 1
	const total = Number(respuesta.headers.get('content-length')) || 0;
	const lector = respuesta.body?.getReader();
	if (!lector) {
		const blob = await respuesta.blob();
		avance(1);
		return new File([blob], nombre);
	}

	const partes: Uint8Array[] = [];
	let recibido = 0;
	for (;;) {
		const { done, value } = await lector.read();
		if (done) break;
		partes.push(value);
		recibido += value.byteLength;
		if (total > 0) avance(Math.min(1, recibido / total));
	}
	avance(1);
	return new File(partes as BlobPart[], nombre);
}
