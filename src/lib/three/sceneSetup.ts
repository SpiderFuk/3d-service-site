/**
 * Configuración centralizada de escena Three.js
 */

import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	DirectionalLight,
	PCFSoftShadowMap,
	Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Object3D } from 'three';

export interface SceneConfig {
	container: HTMLElement;
	enableShadows?: boolean;
	backgroundColor?: string;
	autoRotate?: boolean;
	autoRotateSpeed?: number;
	enableUserControls?: boolean;
}

export interface SceneContext {
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	controls: OrbitControls;
	dispose: () => void;
	addModel: (model: Object3D) => void;
	removeModel: (model: Object3D) => void;
	clearModels: () => void;
}

/**
 * Crea y configura una escena Three.js completa
 */
export function createScene(config: SceneConfig): SceneContext {
	const {
		container,
		enableShadows = true,
		backgroundColor = '#F8FAFC',
		autoRotate = false,
		autoRotateSpeed = 2.0,
		enableUserControls = true
	} = config;

	// Crear escena
	const scene = new Scene();
	scene.background = new Color(backgroundColor);

	// Crear cámara (vista frontal-superior inclinada)
	const camera = new PerspectiveCamera(
		50,
		container.clientWidth / container.clientHeight,
		0.1,
		2000
	);
	camera.position.set(0, 80, 150);

	// Crear renderer
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	if (enableShadows) {
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = PCFSoftShadowMap;
	}

	container.appendChild(renderer.domElement);

	// Crear controles
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 20;
	controls.maxDistance = 500;
	controls.maxPolarAngle = Math.PI * 0.95; // Permite rotar casi hasta abajo (171°)
	controls.minPolarAngle = 0; // Permite vista completamente desde arriba
	controls.autoRotate = autoRotate;
	controls.autoRotateSpeed = autoRotateSpeed;

	// Deshabilitar interacción del usuario si está configurado
	if (!enableUserControls) {
		controls.enableRotate = false;
		controls.enableZoom = false;
		controls.enablePan = false;
	}

	// Iluminación
	const ambientLight = new AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	const directionalLight = new DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(5, 10, 7.5);

	if (enableShadows) {
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.left = -50;
		directionalLight.shadow.camera.right = 50;
		directionalLight.shadow.camera.top = 50;
		directionalLight.shadow.camera.bottom = -50;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
	}

	scene.add(directionalLight);

	// Luz de relleno
	const fillLight = new DirectionalLight(0xffffff, 0.3);
	fillLight.position.set(-5, 0, -5);
	scene.add(fillLight);

	// Array para trackear modelos
	const models: Object3D[] = [];

	// Animation loop
	let animationId: number;
	function animate() {
		animationId = requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
	animate();

	// Handle resize
	const handleResize = () => {
		const width = container.clientWidth;
		const height = container.clientHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
	};

	window.addEventListener('resize', handleResize);

	// Context methods
	const addModel = (model: Object3D) => {
		scene.add(model);
		models.push(model);
	};

	const removeModel = (model: Object3D) => {
		scene.remove(model);
		const index = models.indexOf(model);
		if (index > -1) {
			models.splice(index, 1);
		}
	};

	const clearModels = () => {
		models.forEach((model) => scene.remove(model));
		models.length = 0;
	};

	const dispose = () => {
		window.removeEventListener('resize', handleResize);
		cancelAnimationFrame(animationId);
		controls.dispose();
		renderer.dispose();

		// Limpiar modelos
		clearModels();

		// Remover canvas del DOM
		if (container.contains(renderer.domElement)) {
			container.removeChild(renderer.domElement);
		}
	};

	return {
		scene,
		camera,
		renderer,
		controls,
		dispose,
		addModel,
		removeModel,
		clearModels
	};
}
