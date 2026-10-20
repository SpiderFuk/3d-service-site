/**
 * Logo 3D de printo: la p extruida en cobalto con capas tomate detras,
 * como una pieza recien impresa (ver docs/brand.md)
 *
 * Geometria tomada de static/brand/logo/svg/printo-p-cobalto.svg:
 * un palo con extremos redondeados y un aro, ambos con trazo de 162
 */

import { ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Path, Shape } from 'three';

const TRAZO = 162;
const RADIO_TRAZO = TRAZO / 2;

// Palo de la p (coordenadas del SVG, con el eje Y hacia arriba)
const PALO = { x: 117, yInferior: -44, ySuperior: 461 };
// Aro de la p
const ARO = { x: 307, y: 271, radio: 190 };

const PROFUNDIDAD_FRENTE = 60;
const CAPAS_EXTRUSION = 5;
const PASO_CAPA = { xy: 12, z: 16 };

// La p mide ~700 unidades; se escala para entrar en el rango de OrbitControls (distancia max 500)
const ESCALA = 0.2;

const COBALTO = 0x2b3cff;
const TOMATE = 0xff5a47;

function crearFormasP(): Shape[] {
	const palo = new Shape();
	palo.moveTo(PALO.x - RADIO_TRAZO, PALO.yInferior);
	palo.lineTo(PALO.x - RADIO_TRAZO, PALO.ySuperior);
	palo.absarc(PALO.x, PALO.ySuperior, RADIO_TRAZO, Math.PI, 0, true);
	palo.lineTo(PALO.x + RADIO_TRAZO, PALO.yInferior);
	palo.absarc(PALO.x, PALO.yInferior, RADIO_TRAZO, 0, -Math.PI, true);

	const aro = new Shape();
	aro.absarc(ARO.x, ARO.y, ARO.radio + RADIO_TRAZO, 0, Math.PI * 2, false);
	const hueco = new Path();
	hueco.absarc(ARO.x, ARO.y, ARO.radio - RADIO_TRAZO, 0, Math.PI * 2, true);
	aro.holes.push(hueco);

	return [palo, aro];
}

/**
 * Crea el logo como Group listo para agregar a la escena
 */
export function createPrintoLogo(): Group {
	const formas = crearFormasP();
	const logo = new Group();

	const frente = new ExtrudeGeometry(formas, {
		depth: PROFUNDIDAD_FRENTE,
		bevelEnabled: false,
		curveSegments: 48
	});
	// Un poco de emision para que los colores de marca no se apaguen con la iluminacion de la escena
	const materialCobalto = new MeshStandardMaterial({
		color: COBALTO,
		emissive: COBALTO,
		emissiveIntensity: 0.25,
		roughness: 0.5
	});
	logo.add(new Mesh(frente, materialCobalto));

	// Capas tomate escalonadas hacia abajo, a la derecha y hacia atras
	const capa = new ExtrudeGeometry(formas, {
		depth: PASO_CAPA.z,
		bevelEnabled: false,
		curveSegments: 48
	});
	const materialTomate = new MeshStandardMaterial({
		color: TOMATE,
		emissive: TOMATE,
		emissiveIntensity: 0.2,
		roughness: 0.6
	});
	for (let i = 1; i <= CAPAS_EXTRUSION; i++) {
		const mesh = new Mesh(capa, materialTomate);
		mesh.position.set(PASO_CAPA.xy * i, -PASO_CAPA.xy * i, -PASO_CAPA.z * i);
		logo.add(mesh);
	}

	logo.scale.setScalar(ESCALA);
	logo.traverse((child) => {
		if (child instanceof Mesh) {
			child.castShadow = true;
			child.receiveShadow = true;
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
