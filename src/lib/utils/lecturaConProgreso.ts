/**
 * Lectura de archivos con progreso para el Visor 3D (sin Three.js)
 *
 * El avance se informa como fracción de 0 a 1. Nada sale del navegador:
 * los archivos propios se leen localmente y los ejemplos se bajan del propio sitio.
 */

type Avance = (fraccion: number) => void;

/** Lee un archivo local informando el avance (FileReader onprogress) */
export function leerConProgreso(file: Blob, avance: Avance): Promise<void> {
	return new Promise((resolve, reject) => {
		const lector = new FileReader();
		lector.onprogress = (e) => {
			if (e.lengthComputable && e.total > 0) avance(e.loaded / e.total);
		};
		lector.onload = () => {
			avance(1);
			resolve();
		};
		lector.onerror = () => reject(lector.error ?? new Error('No se pudo leer el archivo'));
		lector.onabort = () => reject(new Error('Lectura cancelada'));
		lector.readAsArrayBuffer(file);
	});
}

/**
 * Baja un archivo informando el avance (Response en streaming).
 * Falla si la respuesta no es 2xx. Sin Content-Length no hay avance parcial.
 */
export async function descargarConProgreso(
	url: string,
	nombre: string,
	avance: Avance
): Promise<File> {
	const respuesta = await fetch(url);
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
