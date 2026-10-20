/**
 * Logo 3D de printo: la p extruida en cobalto con una extrusion tomate centrada detras,
 * como una pieza recien impresa (ver docs/brand.md)
 *
 * Geometria tomada de static/brand/logo/svg/printo-p-cobalto.svg:
 * un palo con extremos redondeados y un aro, ambos con trazo de 162.
 * Se arma un unico contorno (union de palo y aro) para poder biselarlo sin costuras.
 */

import {
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	Path,
	Shape,
	Vector2,
	Vector3
} from 'three';
import type { BufferGeometry } from 'three';

const TRAZO = 162;
const RADIO_TRAZO = TRAZO / 2;

// Coordenadas del SVG, con el eje Y hacia arriba
const PALO = { x: 117, yInferior: -44, ySuperior: 461 };
const ARO = { x: 307, y: 271, radio: 190 };

const PROFUNDIDAD_FRENTE = 60;
const BISEL = { tamano: 10, grosor: 10, segmentos: 6 };
const CURVA_SEGMENTOS = 96;
// Radio de los empalmes donde el aro se junta con el palo
const RADIO_EMPALME = 24;

// Extrusion tomate: mismo contorno y misma profundidad que la pieza cobalto, centrada detras de ella
const PROFUNDIDAD_EXTRUSION = PROFUNDIDAD_FRENTE;

// La p mide ~700 unidades; se escala para entrar en el rango de OrbitControls (distancia max 500)
const ESCALA = 0.2;

const COBALTO = 0x2b3cff;
const TOMATE = 0xff5a47;

interface Circulo {
	x: number;
	y: number;
	r: number;
}

/** Interseccion de dos circulos que se cortan (devuelve los dos puntos) */
function interseccionCirculos(a: Circulo, b: Circulo): [number, number][] {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const d = Math.hypot(dx, dy);
	const largo = (d * d + a.r * a.r - b.r * b.r) / (2 * d);
	const alto = Math.sqrt(a.r * a.r - largo * largo);
	const mx = a.x + (dx * largo) / d;
	const my = a.y + (dy * largo) / d;
	return [
		[mx - (dy * alto) / d, my + (dx * alto) / d],
		[mx + (dy * alto) / d, my - (dx * alto) / d]
	];
}

/** Angulo de un punto visto desde el centro de un circulo */
function angulo(centro: { x: number; y: number }, punto: { x: number; y: number }): number {
	return Math.atan2(punto.y - centro.y, punto.x - centro.x);
}

/** Arco corto de un circulo entre dos angulos (elige el sentido solo) */
function arcoCorto(forma: Shape, c: Circulo, desde: number, hasta: number): void {
	const delta = Math.atan2(Math.sin(hasta - desde), Math.cos(hasta - desde));
	forma.absarc(c.x, c.y, c.r, desde, hasta, delta < 0);
}

/**
 * Contorno de la p (antihorario): union del palo y el aro exterior, con el hueco del aro.
 * El aro exterior es tangente al borde izquierdo del palo y el hueco al borde derecho,
 * asi que el contorno solo tiene dos esquinas entrantes (donde el aro se junta con el palo).
 * Esas esquinas se redondean con un empalme para que el bisel no genere picos.
 */
function crearContornoP(): Shape {
	const xIzq = PALO.x - RADIO_TRAZO;
	const xDer = PALO.x + RADIO_TRAZO;
	const aro: Circulo = { x: ARO.x, y: ARO.y, r: ARO.radio + RADIO_TRAZO };
	const tapaSuperior: Circulo = { x: PALO.x, y: PALO.ySuperior, r: RADIO_TRAZO };

	// Empalme inferior: tangente al borde derecho del palo y por fuera del aro
	const empalmeInferior: Circulo = {
		x: xDer + RADIO_EMPALME,
		y: aro.y - Math.sqrt((aro.r + RADIO_EMPALME) ** 2 - (xDer + RADIO_EMPALME - aro.x) ** 2),
		r: RADIO_EMPALME
	};

	// Empalme superior: por fuera del aro y de la tapa superior del palo,
	// del lado que se encuentra primero recorriendo el aro en sentido antihorario
	const [centroSuperior] = interseccionCirculos(
		{ ...aro, r: aro.r + RADIO_EMPALME },
		{ ...tapaSuperior, r: tapaSuperior.r + RADIO_EMPALME }
	)
		.map(([x, y]) => ({ x, y }))
		.sort((p, q) => angulo(aro, p) - angulo(aro, q));
	const empalmeSuperior: Circulo = { ...centroSuperior, r: RADIO_EMPALME };

	const contorno = new Shape();
	contorno.moveTo(xDer, PALO.yInferior);
	contorno.lineTo(xDer, empalmeInferior.y);
	arcoCorto(contorno, empalmeInferior, Math.PI, angulo(empalmeInferior, aro));
	contorno.absarc(aro.x, aro.y, aro.r, angulo(aro, empalmeInferior), angulo(aro, empalmeSuperior), false);
	arcoCorto(contorno, empalmeSuperior, angulo(empalmeSuperior, aro), angulo(empalmeSuperior, tapaSuperior));
	contorno.absarc(tapaSuperior.x, tapaSuperior.y, tapaSuperior.r, angulo(tapaSuperior, empalmeSuperior), Math.PI, false);
	contorno.lineTo(xIzq, PALO.yInferior);
	contorno.absarc(PALO.x, PALO.yInferior, RADIO_TRAZO, Math.PI, Math.PI * 2, false);

	const hueco = new Path();
	hueco.absarc(ARO.x, ARO.y, ARO.radio - RADIO_TRAZO, 0, Math.PI * 2, true);
	contorno.holes.push(hueco);

	return contorno;
}

/**
 * Muestrea el contorno y quita puntos repetidos: absarc repite el punto donde termina
 * el tramo anterior, y esos segmentos de largo cero rompen las normales del bisel
 */
function sinPuntosRepetidos(contorno: Shape): Shape {
	const limpiar = (puntos: Vector2[]) => {
		const resultado = puntos.filter((p, i) => i === 0 || p.distanceTo(puntos[i - 1]) > 1e-6);
		if (resultado.length > 1 && resultado[0].distanceTo(resultado[resultado.length - 1]) < 1e-6) {
			resultado.pop();
		}
		return resultado;
	};

	const limpio = new Shape(limpiar(contorno.getPoints(CURVA_SEGMENTOS / 2)));
	for (const hueco of contorno.holes) {
		limpio.holes.push(new Path(limpiar(hueco.getPoints(CURVA_SEGMENTOS / 2))));
	}
	return limpio;
}

function extruir(contorno: Shape, profundidad: number): ExtrudeGeometry {
	return new ExtrudeGeometry(contorno, {
		depth: profundidad,
		bevelEnabled: true,
		bevelSize: BISEL.tamano,
		bevelThickness: BISEL.grosor,
		bevelSegments: BISEL.segmentos,
		curveSegments: CURVA_SEGMENTOS
	});
}

/**
 * Normales suaves en los laterales y el bisel (grupo 1 de ExtrudeGeometry),
 * manteniendo planas las tapas. Solo se promedian caras con menos de 60° entre si.
 */
function suavizarLaterales(geometria: BufferGeometry): void {
	geometria.computeVertexNormals();
	const laterales = geometria.groups.find((g) => g.materialIndex === 1);
	if (!laterales) return;

	const posicion = geometria.getAttribute('position');
	const normal = geometria.getAttribute('normal');
	const fin = laterales.start + laterales.count;
	const limite = Math.cos(Math.PI / 3);
	const clave = (i: number) =>
		`${posicion.getX(i).toFixed(3)},${posicion.getY(i).toFixed(3)},${posicion.getZ(i).toFixed(3)}`;

	const normalesPorPunto = new Map<string, Vector3[]>();
	for (let i = laterales.start; i < fin; i++) {
		const n = new Vector3(normal.getX(i), normal.getY(i), normal.getZ(i));
		const lista = normalesPorPunto.get(clave(i));
		if (lista) lista.push(n);
		else normalesPorPunto.set(clave(i), [n]);
	}

	for (let i = laterales.start; i < fin; i++) {
		const propia = new Vector3(normal.getX(i), normal.getY(i), normal.getZ(i));
		const suma = new Vector3();
		for (const n of normalesPorPunto.get(clave(i)) ?? []) {
			if (n.dot(propia) > limite) suma.add(n);
		}
		suma.normalize();
		normal.setXYZ(i, suma.x, suma.y, suma.z);
	}
	normal.needsUpdate = true;
}

/**
 * Crea el logo como Group listo para agregar a la escena
 */
export function createPrintoLogo(): Group {
	const contorno = sinPuntosRepetidos(crearContornoP());
	const logo = new Group();

	// Pieza cobalto: la cara frontal queda en z = PROFUNDIDAD_FRENTE + BISEL.grosor
	const frente = extruir(contorno, PROFUNDIDAD_FRENTE);
	suavizarLaterales(frente);

	// Extrusion tomate: mismo contorno, recta hacia atras. Su cara frontal coincide con la
	// trasera de la pieza cobalto (z = -BISEL.grosor); donde se juntan los biseles queda una
	// ranura fina que separa los dos colores, como dos capas impresas
	const extrusion = extruir(contorno, PROFUNDIDAD_EXTRUSION);
	extrusion.translate(0, 0, -(PROFUNDIDAD_EXTRUSION + 2 * BISEL.grosor));
	suavizarLaterales(extrusion);

	// Un poco de emision para que los colores de marca no se apaguen con la iluminacion de la escena
	const materialCobalto = new MeshStandardMaterial({
		color: COBALTO,
		emissive: COBALTO,
		emissiveIntensity: 0.25,
		roughness: 0.45
	});
	const materialTomate = new MeshStandardMaterial({
		color: TOMATE,
		emissive: TOMATE,
		emissiveIntensity: 0.2,
		roughness: 0.55
	});
	logo.add(new Mesh(frente, materialCobalto));
	logo.add(new Mesh(extrusion, materialTomate));

	logo.scale.setScalar(ESCALA);
	logo.traverse((child) => {
		if (child instanceof Mesh) {
			child.castShadow = true;
			child.receiveShadow = true;
			// ThreeCanvas recalcula normales de todo modelo; estas ya son suaves y no se deben pisar
			child.userData.preserveNormals = true;
		}
	});

	// ThreeCanvas aplica rotation.x = rotation.z = -90° a todo modelo (correccion de STL).
	// Este grupo interno aplica la rotacion inversa para que la p quede de frente.
	const compensacion = new Group();
	compensacion.rotation.set(Math.PI / 2, 0, Math.PI / 2, 'ZYX');
	compensacion.add(logo);

	const raiz = new Group();
	raiz.add(compensacion);
	return raiz;
}
