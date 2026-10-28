/**
 * Carga de modelos para el Visor 3D (parte del chunk diferido)
 *
 * - cargarModelo: parsea con el ModelLoaderFactory; si el loader falla o el modelo
 *   queda vacío (sin triángulos o con medidas inválidas) lanza un error, que el
 *   visor muestra como "No pudimos abrirlo" (error 'danado').
 * - crearCuadroProvisorio: un cuadro en relieve de muestra hasta que la dueña
 *   mande el archivo real (visorEjemplos.ts, archivo: null).
 */

import { Box3, BoxGeometry, Group, Mesh, PlaneGeometry, Vector3, type Object3D } from 'three';
import { STLLoaderAdapter } from '$lib/loaders/STLLoaderAdapter';
import { liberarObjeto } from './visorEscena';

/** Error de modelo vacío o ilegible (se muestra como archivo dañado) */
export class ModeloInvalidoError extends Error {}

function esModeloValido(objeto: Object3D): boolean {
	let vertices = 0;
	objeto.traverse((hijo) => {
		if (hijo instanceof Mesh) vertices += hijo.geometry?.getAttribute('position')?.count ?? 0;
	});
	if (vertices < 3) return false;

	const tamano = new Box3().setFromObject(objeto).getSize(new Vector3());
	return [tamano.x, tamano.y, tamano.z].every(Number.isFinite) && tamano.length() > 0;
}

/**
 * Parsea un STL ya leído a partir de su contenido. No vuelve a leer el archivo.
 */
export function cargarModelo(buffer: ArrayBuffer): Object3D {
	const objeto = new STLLoaderAdapter().parse(buffer);
	if (!esModeloValido(objeto)) {
		liberarObjeto(objeto);
		throw new ModeloInvalidoError('El modelo está vacío o tiene medidas inválidas');
	}
	return objeto;
}

/**
 * Cuadro en relieve provisorio: lámina de 100 × 140 mm con montañas y sol en
 * relieve, mirando a la cámara (ya está "de pie": no lleva corrección de orientación).
 */
export function crearCuadroProvisorio(): Object3D {
	const cuadro = new Group();

	const lamina = new Mesh(new BoxGeometry(100, 140, 4));
	cuadro.add(lamina);

	const ancho = 92;
	const alto = 132;
	const relieve = new PlaneGeometry(ancho, alto, ancho, alto);
	const pos = relieve.getAttribute('position');
	for (let i = 0; i < pos.count; i++) {
		const x = pos.getX(i);
		const y = pos.getY(i);
		// Silueta de dos montañas (en mm desde el borde de abajo)
		const montana = Math.max(20, 60 - Math.abs(x + 20) * 1.6, 75 - Math.abs(x - 15) * 1.8);
		let z = y + alto / 2 < montana ? 3 : 0;
		// Sol: una cúpula arriba a la derecha
		const d = Math.hypot(x - 20, y - 35);
		if (d < 12) z = Math.max(z, 4 * Math.sqrt(1 - (d / 12) ** 2));
		pos.setZ(i, z);
	}
	relieve.computeVertexNormals();
	const frente = new Mesh(relieve);
	frente.position.z = 2;
	cuadro.add(frente);

	return cuadro;
}
