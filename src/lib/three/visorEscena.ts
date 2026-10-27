/**
 * Escena del Visor 3D (sección 08 de BUILD.md)
 *
 * Un renderer por visor montado, reutilizado entre modelos. Sin OrbitControls:
 * el modelo solo gira sobre su eje vertical (giro.ts), sin zoom ni paneo.
 * Renderiza a pedido (cuando cambia el modelo, el giro o el tamaño), sin loop
 * permanente: si nada cambia, no se dibuja nada.
 *
 * Luces y cámara como sceneSetup.ts (ambiente 0.6, direccional 0.8, relleno 0.3;
 * FOV 50). Se mantienen la corrección de orientación y el ajuste de distancia
 * de la cámara del visor anterior (ThreeCanvas).
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

export interface OpcionesVisor {
	/** Elemento donde va el canvas (ocupa todo su tamaño) */
	contenedor: HTMLElement;
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

/** Color cobalto leído del token CSS (tokens.css es el único lugar con el hex) */
function colorCobalto(elemento: HTMLElement): string | undefined {
	const valor = getComputedStyle(elemento).getPropertyValue('--color-cobalto').trim();
	return valor || undefined;
}

export function crearVisorEscena({ contenedor }: OpcionesVisor): VisorEscena {
	const scene = new Scene();

	const camera = new PerspectiveCamera(50, 1, 0.1, 2000);
	camera.position.set(0, 80, 150);

	// Fondo transparente: se ve el blanco del marco
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);
	const canvas = renderer.domElement;
	canvas.classList.add('visor-canvas');
	contenedor.appendChild(canvas);

	scene.add(new AmbientLight(0xffffff, 0.6));
	const luz = new DirectionalLight(0xffffff, 0.8);
	luz.position.set(5, 10, 7.5);
	scene.add(luz);
	const relleno = new DirectionalLight(0xffffff, 0.3);
	relleno.position.set(-5, 0, -5);
	scene.add(relleno);

	// El pivote gira (eje Y del mundo); el modelo adentro guarda su orientación corregida
	const pivote = new Group();
	scene.add(pivote);
	let modelo: Object3D | null = null;

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
		pedirRender();
	}

	const observadorTamano = new ResizeObserver(ajustarTamano);
	observadorTamano.observe(contenedor);
	ajustarTamano();

	/** Cámara a una distancia que deja ver todo el modelo (diagonal de la caja × 1.5) */
	function ajustarCamara(objeto: Object3D) {
		const caja = new Box3().setFromObject(objeto);
		const tamano = caja.getSize(new Vector3());
		const diagonal = Math.sqrt(tamano.x ** 2 + tamano.y ** 2 + tamano.z ** 2);
		const fov = camera.fov * (Math.PI / 180);
		const distancia = (diagonal / (2 * Math.tan(fov / 2))) * 1.5;

		// Vista frontal-superior inclinada, como el visor anterior
		camera.position.set(distancia * 0.3, distancia * 0.5, distancia);
		camera.near = Math.max(0.1, distancia / 100);
		camera.far = Math.max(2000, distancia * 10);
		camera.updateProjectionMatrix();
		camera.lookAt(0, 0, 0);
	}

	function limpiar() {
		if (!modelo) return;
		pivote.remove(modelo);
		liberarObjeto(modelo);
		modelo = null;
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
		ajustarCamara(pivote);
		pedirRender();
	}

	function girar(angulo: number) {
		pivote.rotation.y = angulo;
		pedirRender();
	}

	function dispose() {
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
