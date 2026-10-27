/**
 * Escena del Visor 3D (sección 08 de BUILD.md)
 *
 * Un renderer por visor montado, reutilizado entre modelos. Sin OrbitControls:
 * el modelo solo gira sobre su eje vertical (giro.ts), sin zoom ni paneo.
 * Renderiza a pedido (cuando cambia el modelo, el giro o el tamaño), sin loop
 * permanente: si nada cambia, no se dibuja nada.
 *
 * Luces y cámara como sceneSetup.ts (ambiente 0.6, direccional 0.8, relleno 0.3;
 * FOV 50). Se mantiene la corrección de orientación del visor anterior (ThreeCanvas).
 *
 * Encuadre: todos los modelos ocupan lo mismo del marco, sean altos, chatos o
 * redondos. La cámara se aleja lo justo para que el cilindro que barre el modelo
 * al girar ocupe el 75 % (FOCO) del alto o del ancho del marco, y se recalcula si
 * cambia la proporción del marco.
 *
 * Al aparecer, el modelo entra con medio giro corto y un leve crecimiento
 * (sin animación con prefers-reduced-motion; el primer giro de la persona la corta).
 */

import {
	AmbientLight,
	Box3,
	DirectionalLight,
	Group,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
	type Material,
	type Object3D
} from 'three';
import { crearControlGiro } from './giro';

export interface OpcionesVisor {
	/** Elemento donde va el canvas (ocupa todo su tamaño) */
	contenedor: HTMLElement;
	/** Elemento enfocable que recibe las flechas (el marco) */
	teclado?: HTMLElement;
	/** Se llama cada vez que la persona gira el modelo */
	ongiro?: () => void;
}

export interface MostrarOpciones {
	/** Aplicar la corrección de orientación de los STL/3MF (por defecto true) */
	corregirOrientacion?: boolean;
}

export interface VisorEscena {
	/** Reemplaza el modelo actual (libera el anterior) y ajusta la cámara */
	mostrar(objeto: Object3D, opciones?: MostrarOpciones): void;
	/** Saca el modelo de la escena y libera geometrías y materiales */
	limpiar(): void;
	/** Libera todo: modelo, renderer, contexto WebGL, canvas y observadores */
	dispose(): void;
	/** Giro actual sobre el eje vertical, en radianes */
	readonly giro: number;
	/** Fija el giro y redibuja */
	girar(angulo: number): void;
	readonly tieneModelo: boolean;
	readonly canvas: HTMLCanvasElement;
}

/** Libera geometrías y materiales de un objeto (y sus hijos) */
export function liberarObjeto(objeto: Object3D): void {
	const materiales = new Set<Material>();
	objeto.traverse((hijo) => {
		if (hijo instanceof Mesh) {
			hijo.geometry?.dispose();
			const m = hijo.material as Material | Material[] | undefined;
			if (Array.isArray(m)) m.forEach((x) => materiales.add(x));
			else if (m) materiales.add(m);
		}
	});
	materiales.forEach((m) => m.dispose());
}

/** Parte del alto y del ancho del marco que ocupa el modelo (el resto queda de aire) */
export const FOCO = 0.75;

/** Dirección de la cámara desde el centro: vista frontal-superior inclinada */
export const DIRECCION_CAMARA = new Vector3(0.3, 0.5, 1).normalize();

/** Entrada del modelo: duración y giro inicial (radianes) */
const ENTRADA_MS = 700;
const ENTRADA_GIRO = -0.6;

/**
 * Cilindro vertical que contiene al modelo en cualquier giro: radio desde el eje Y
 * y alturas mínima y máxima. Se mide sobre los vértices (no la caja), así un jarrón
 * redondo no queda más chico que una pieza cuadrada.
 */
export interface Cilindro {
	radio: number;
	yMin: number;
	yMax: number;
}

export function medirCilindro(objeto: Object3D): Cilindro {
	objeto.updateMatrixWorld(true);
	const v = new Vector3();
	let radio2 = 0;
	let yMin = Infinity;
	let yMax = -Infinity;
	objeto.traverse((hijo) => {
		if (!(hijo instanceof Mesh)) return;
		const pos = hijo.geometry?.getAttribute('position');
		if (!pos) return;
		for (let i = 0; i < pos.count; i++) {
			v.fromBufferAttribute(pos, i).applyMatrix4(hijo.matrixWorld);
			radio2 = Math.max(radio2, v.x * v.x + v.z * v.z);
			yMin = Math.min(yMin, v.y);
			yMax = Math.max(yMax, v.y);
		}
	});
	return { radio: Math.sqrt(radio2), yMin, yMax };
}

/**
 * Distancia de la cámara (sobre DIRECCION_CAMARA, mirando al origen) para que el
 * cilindro entre en el FOCO del marco, en alto y en ancho. Para cada punto p de los bordes del cilindro:
 * |x| ≤ FOCO·tan(fovH/2)·prof y |y| ≤ FOCO·tan(fovV/2)·prof, con prof = d − p·dir.
 */
export function distanciaEncuadre(cilindro: Cilindro, fovGrados: number, aspecto: number): number {
	const tanV = Math.tan((fovGrados * Math.PI) / 360) * FOCO;
	const tanH = tanV * aspecto;
	const adelante = DIRECCION_CAMARA.clone().negate();
	const derecha = new Vector3().crossVectors(adelante, new Vector3(0, 1, 0)).normalize();
	const arriba = new Vector3().crossVectors(derecha, adelante);

	const p = new Vector3();
	let distancia = 0;
	const PASOS = 48;
	for (let i = 0; i < PASOS; i++) {
		const a = (i / PASOS) * Math.PI * 2;
		for (const y of [cilindro.yMin, cilindro.yMax]) {
			p.set(Math.cos(a) * cilindro.radio, y, Math.sin(a) * cilindro.radio);
			const haciaCamara = p.dot(DIRECCION_CAMARA);
			distancia = Math.max(
				distancia,
				haciaCamara + Math.abs(p.dot(derecha)) / tanH,
				haciaCamara + Math.abs(p.dot(arriba)) / tanV
			);
		}
	}
	return distancia;
}

/** Color cobalto leído del token CSS (tokens.css es el único lugar con el hex) */
function colorCobalto(elemento: HTMLElement): string | undefined {
	const valor = getComputedStyle(elemento).getPropertyValue('--color-cobalto').trim();
	return valor || undefined;
}

export function crearVisorEscena({ contenedor, teclado, ongiro }: OpcionesVisor): VisorEscena {
	const scene = new Scene();

	const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
	camera.position.set(0, 80, 150);

	// Fondo transparente: se ve el blanco del marco
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearAlpha(0);
	const canvas = renderer.domElement;
	canvas.classList.add('visor-canvas');
	contenedor.appendChild(canvas);

	// Luces blancas (color por defecto de Three.js): sin colores escritos acá
	scene.add(new AmbientLight(undefined, 0.6));
	const luz = new DirectionalLight(undefined, 0.8);
	luz.position.set(5, 10, 7.5);
	scene.add(luz);
	const relleno = new DirectionalLight(undefined, 0.3);
	relleno.position.set(-5, 0, -5);
	scene.add(relleno);

	// El pivote gira (eje Y del mundo); el modelo adentro guarda su orientación corregida
	const pivote = new Group();
	scene.add(pivote);
	let modelo: Object3D | null = null;
	let cilindro: Cilindro | null = null;

	const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
	let cuadroEntrada = 0;
	function cortarEntrada() {
		cancelAnimationFrame(cuadroEntrada);
		cuadroEntrada = 0;
		pivote.scale.setScalar(1);
	}

	// Render a pedido: como mucho un cuadro por frame
	let cuadroPendiente = 0;
	function pedirRender() {
		if (cuadroPendiente) return;
		cuadroPendiente = requestAnimationFrame(() => {
			cuadroPendiente = 0;
			renderer.render(scene, camera);
		});
	}

	function ajustarTamano() {
		const ancho = contenedor.clientWidth;
		const alto = contenedor.clientHeight;
		if (!ancho || !alto) return;
		camera.aspect = ancho / alto;
		camera.updateProjectionMatrix();
		renderer.setSize(ancho, alto);
		if (cilindro) ajustarCamara();
		pedirRender();
	}

	const observadorTamano = new ResizeObserver(ajustarTamano);
	observadorTamano.observe(contenedor);
	ajustarTamano();

	/** Cámara a la distancia de encuadre del modelo actual, con la proporción actual del marco */
	function ajustarCamara() {
		if (!cilindro) return;
		const distancia = distanciaEncuadre(cilindro, camera.fov, camera.aspect);
		camera.position.copy(DIRECCION_CAMARA).multiplyScalar(distancia);
		camera.near = Math.max(0.1, distancia / 100);
		camera.far = Math.max(2000, distancia * 10);
		camera.updateProjectionMatrix();
		camera.lookAt(0, 0, 0);
	}

	/** Medio giro corto y crecimiento leve hasta quedar quieto de frente */
	function animarEntrada() {
		cortarEntrada();
		if (movimientoReducido.matches) return;
		const inicio = performance.now();
		const paso = (ahora: number) => {
			const t = Math.min(1, (ahora - inicio) / ENTRADA_MS);
			const suave = 1 - (1 - t) ** 3;
			pivote.rotation.y = ENTRADA_GIRO * (1 - suave);
			pivote.scale.setScalar(0.92 + 0.08 * suave);
			renderer.render(scene, camera);
			cuadroEntrada = t < 1 ? requestAnimationFrame(paso) : 0;
		};
		cuadroEntrada = requestAnimationFrame(paso);
	}

	function limpiar() {
		cortarEntrada();
		if (!modelo) return;
		pivote.remove(modelo);
		liberarObjeto(modelo);
		modelo = null;
		cilindro = null;
		pedirRender();
	}

	function mostrar(objeto: Object3D, { corregirOrientacion = true }: MostrarOpciones = {}) {
		limpiar();

		// Un solo material cobalto para todo el modelo; se liberan los del loader
		const material = new MeshStandardMaterial({ roughness: 0.6, metalness: 0.1 });
		const color = colorCobalto(contenedor);
		if (color) material.color.set(color);

		objeto.traverse((hijo) => {
			if (!(hijo instanceof Mesh)) return;
			const anterior = hijo.material as Material | Material[];
			if (Array.isArray(anterior)) anterior.forEach((m) => m.dispose());
			else anterior?.dispose();
			hijo.material = material;
			if (!hijo.geometry.getAttribute('normal')) hijo.geometry.computeVertexNormals();
		});

		if (corregirOrientacion) {
			// Los modelos vienen rotados 90° en X (transversal) y 90° en Z (frontal)
			objeto.rotation.x = -Math.PI / 2;
			objeto.rotation.z = -Math.PI / 2;
		}

		// Centrar el modelo en el pivote para que gire sobre sí mismo
		pivote.rotation.y = 0;
		pivote.add(objeto);
		objeto.updateMatrixWorld(true);
		const centro = new Box3().setFromObject(objeto).getCenter(new Vector3());
		objeto.position.sub(centro);
		objeto.updateMatrixWorld(true);

		modelo = objeto;
		cilindro = medirCilindro(pivote);
		ajustarCamara();
		pedirRender();
		animarEntrada();
	}

	function girar(angulo: number) {
		cortarEntrada();
		pivote.rotation.y = angulo;
		pedirRender();
	}

	const control = crearControlGiro({
		superficie: canvas,
		teclado,
		activo: () => modelo !== null,
		obtener: () => pivote.rotation.y,
		fijar: girar,
		ongiro
	});

	function dispose() {
		control.dispose();
		limpiar();
		cancelAnimationFrame(cuadroPendiente);
		cuadroPendiente = 0;
		observadorTamano.disconnect();
		renderer.dispose();
		renderer.forceContextLoss();
		canvas.remove();
	}

	return {
		mostrar,
		limpiar,
		dispose,
		girar,
		get giro() {
			return pivote.rotation.y;
		},
		get tieneModelo() {
			return modelo !== null;
		},
		canvas
	};
}
