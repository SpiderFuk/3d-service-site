# Especificación Técnica - Proyecto Web Impresión 3D

## Resumen del Proyecto

Página web SPA para un negocio de impresión 3D con visualizador de modelos 3D interactivo. Los usuarios pueden ver modelos precargados o subir sus propios archivos STL/3MF para visualizarlos.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Svelte + SvelteKit | 5.x |
| Bundler | Vite | (incluido en SvelteKit) |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Motor 3D | Three.js | 0.160+ |
| Dependencia 3MF | JSZip | 3.10+ |
| Iconos | Lucide Svelte | latest |

---

## Arquitectura del Proyecto

### Estructura de Carpetas

```
proyecto-impresion3d/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.svelte
│   │   │   │   └── Footer.svelte
│   │   │   │
│   │   │   ├── sections/
│   │   │   │   ├── Hero.svelte
│   │   │   │   ├── Services.svelte
│   │   │   │   ├── FilamentColors.svelte
│   │   │   │   ├── ModelViewer.svelte
│   │   │   │   ├── Gallery3D.svelte
│   │   │   │   └── ContactWhatsApp.svelte
│   │   │   │
│   │   │   ├── viewer/
│   │   │   │   ├── ThreeCanvas.svelte
│   │   │   │   ├── ViewerControls.svelte
│   │   │   │   ├── ModelInfo.svelte
│   │   │   │   ├── FileUploader.svelte
│   │   │   │   └── ModelThumbnails.svelte
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Button.svelte
│   │   │       ├── Card.svelte
│   │   │       └── ColorSwatch.svelte
│   │   │
│   │   ├── loaders/
│   │   │   ├── types.ts
│   │   │   ├── ModelLoaderFactory.ts
│   │   │   ├── STLLoaderAdapter.ts
│   │   │   ├── ThreeMFLoaderAdapter.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── three/
│   │   │   ├── sceneSetup.ts
│   │   │   ├── controls.ts
│   │   │   ├── lighting.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── modelStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── whatsapp.ts
│   │   │   ├── fileValidation.ts
│   │   │   └── modelCalculations.ts
│   │   │
│   │   └── config/
│   │       ├── filamentColors.ts
│   │       ├── services.ts
│   │       └── contact.ts
│   │
│   ├── routes/
│   │   ├── +page.svelte          # SPA principal
│   │   └── +layout.svelte        # Layout con Navbar/Footer
│   │
│   └── app.css                   # Tailwind + estilos globales
│
├── static/
│   ├── models/                   # Modelos 3D precargados
│   │   ├── engranaje.stl
│   │   ├── soporte.stl
│   │   ├── maceta.3mf
│   │   └── figura.stl
│   │
│   ├── images/
│   │   ├── logo.svg
│   │   └── og-image.png
│   │
│   └── favicon.ico
│
├── svelte.config.js
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Patrón Factory para Loaders 3D

### Interface Base

```typescript
// src/lib/loaders/types.ts

import type * as THREE from 'three';

export interface ModelInfo {
  name: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  volume: number;        // en cm³
  triangles: number;
  fileSize: number;      // en bytes
}

export interface IModelLoader {
  load(file: File): Promise<THREE.Object3D>;
  parse(buffer: ArrayBuffer): THREE.Object3D;
  getSupportedExtensions(): string[];
  getModelInfo(object: THREE.Object3D): ModelInfo;
  dispose(): void;
}

export type LoaderType = 'stl' | '3mf' | 'obj';
```

### Factory Implementation

```typescript
// src/lib/loaders/ModelLoaderFactory.ts

import type { IModelLoader, LoaderType } from './types';
import { STLLoaderAdapter } from './STLLoaderAdapter';
import { ThreeMFLoaderAdapter } from './ThreeMFLoaderAdapter';

class ModelLoaderFactory {
  private static loaders: Map<string, IModelLoader> = new Map();
  private static initialized = false;

  private static initialize(): void {
    if (this.initialized) return;
    
    this.loaders.set('stl', new STLLoaderAdapter());
    this.loaders.set('3mf', new ThreeMFLoaderAdapter());
    // Futuro: this.loaders.set('obj', new OBJLoaderAdapter());
    
    this.initialized = true;
  }

  static getLoader(filename: string): IModelLoader {
    this.initialize();
    
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (!extension) {
      throw new Error('No se pudo determinar la extensión del archivo');
    }

    const loader = this.loaders.get(extension);
    
    if (!loader) {
      throw new Error(
        `Formato no soportado: .${extension}. ` +
        `Formatos válidos: ${this.getSupportedFormats().join(', ')}`
      );
    }

    return loader;
  }

  static getSupportedFormats(): string[] {
    this.initialize();
    return Array.from(this.loaders.keys()).map(ext => `.${ext}`);
  }

  static isSupported(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? this.loaders.has(extension) : false;
  }
}

export { ModelLoaderFactory };
```

### STL Loader Adapter

```typescript
// src/lib/loaders/STLLoaderAdapter.ts

import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import type { IModelLoader, ModelInfo } from './types';

export class STLLoaderAdapter implements IModelLoader {
  private loader: STLLoader;
  private defaultMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.loader = new STLLoader();
    this.defaultMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.1,
      roughness: 0.8,
    });
  }

  async load(file: File): Promise<THREE.Object3D> {
    const buffer = await file.arrayBuffer();
    return this.parse(buffer);
  }

  parse(buffer: ArrayBuffer): THREE.Object3D {
    const geometry = this.loader.parse(buffer);
    geometry.computeVertexNormals();
    geometry.center();
    
    const mesh = new THREE.Mesh(geometry, this.defaultMaterial.clone());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  getSupportedExtensions(): string[] {
    return ['stl'];
  }

  getModelInfo(object: THREE.Object3D): ModelInfo {
    const mesh = object as THREE.Mesh;
    const geometry = mesh.geometry as THREE.BufferGeometry;
    
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      name: '',
      dimensions: {
        width: Math.round(size.x * 100) / 100,
        height: Math.round(size.y * 100) / 100,
        depth: Math.round(size.z * 100) / 100,
      },
      volume: this.calculateVolume(geometry),
      triangles: geometry.attributes.position.count / 3,
      fileSize: 0,
    };
  }

  private calculateVolume(geometry: THREE.BufferGeometry): number {
    // Cálculo simplificado usando bounding box
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Volumen aproximado (el real requiere cálculo de mesh cerrado)
    const volumeMm3 = size.x * size.y * size.z;
    const volumeCm3 = volumeMm3 / 1000;
    
    return Math.round(volumeCm3 * 100) / 100;
  }

  dispose(): void {
    this.defaultMaterial.dispose();
  }
}
```

### 3MF Loader Adapter

```typescript
// src/lib/loaders/ThreeMFLoaderAdapter.ts

import * as THREE from 'three';
import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';
import type { IModelLoader, ModelInfo } from './types';

export class ThreeMFLoaderAdapter implements IModelLoader {
  private loader: ThreeMFLoader;

  constructor() {
    this.loader = new ThreeMFLoader();
  }

  async load(file: File): Promise<THREE.Object3D> {
    const buffer = await file.arrayBuffer();
    return this.parse(buffer);
  }

  parse(buffer: ArrayBuffer): THREE.Object3D {
    const group = this.loader.parse(buffer);
    
    // Centrar el modelo
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    
    // Configurar sombras para todos los meshes
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return group;
  }

  getSupportedExtensions(): string[] {
    return ['3mf'];
  }

  getModelInfo(object: THREE.Object3D): ModelInfo {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);

    let triangles = 0;
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry as THREE.BufferGeometry;
        triangles += geometry.attributes.position.count / 3;
      }
    });

    return {
      name: '',
      dimensions: {
        width: Math.round(size.x * 100) / 100,
        height: Math.round(size.y * 100) / 100,
        depth: Math.round(size.z * 100) / 100,
      },
      volume: this.calculateVolume(size),
      triangles,
      fileSize: 0,
    };
  }

  private calculateVolume(size: THREE.Vector3): number {
    const volumeMm3 = size.x * size.y * size.z;
    const volumeCm3 = volumeMm3 / 1000;
    return Math.round(volumeCm3 * 100) / 100;
  }

  dispose(): void {
    // ThreeMFLoader no requiere cleanup especial
  }
}
```

---

## Configuración Three.js

### Scene Setup

```typescript
// src/lib/three/sceneSetup.ts

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SceneConfig {
  container: HTMLElement;
  backgroundColor?: number;
  enableShadows?: boolean;
}

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  dispose: () => void;
}

export function createScene(config: SceneConfig): SceneContext {
  const { container, backgroundColor = 0xf1f5f9, enableShadows = true } = config;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(100, 100, 100);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  if (enableShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 10;
  controls.maxDistance = 500;

  // Lighting
  setupLighting(scene);

  // Grid helper
  const gridHelper = new THREE.GridHelper(200, 20, 0xcccccc, 0xe5e5e5);
  scene.add(gridHelper);

  // Animation loop
  let animationId: number;
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  function handleResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', handleResize);

  // Dispose function
  function dispose() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    controls.dispose();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  }

  return { scene, camera, renderer, controls, dispose };
}

function setupLighting(scene: THREE.Scene): void {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Main directional light
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(50, 100, 50);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-50, 50, -50);
  scene.add(fillLight);
}
```

---

## Integración WhatsApp

```typescript
// src/lib/utils/whatsapp.ts

import type { ModelInfo } from '$lib/loaders/types';

const WHATSAPP_NUMBER = '549XXXXXXXXXX'; // Configurar número real

interface WhatsAppMessage {
  name?: string;
  message?: string;
  modelInfo?: ModelInfo;
}

export function generateWhatsAppUrl(data: WhatsAppMessage): string {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  
  let text = '';
  
  if (data.name) {
    text += `Hola! Mi nombre es ${data.name}.\n\n`;
  } else {
    text += 'Hola!\n\n';
  }
  
  if (data.modelInfo) {
    text += `Quiero cotizar una impresión 3D:\n`;
    text += `- Archivo: ${data.modelInfo.name}\n`;
    text += `- Dimensiones: ${data.modelInfo.dimensions.width}mm x ${data.modelInfo.dimensions.height}mm x ${data.modelInfo.dimensions.depth}mm\n`;
    text += `- Volumen aprox: ${data.modelInfo.volume} cm³\n\n`;
  }
  
  if (data.message) {
    text += data.message;
  }
  
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(data: WhatsAppMessage): void {
  const url = generateWhatsAppUrl(data);
  window.open(url, '_blank');
}
```

---

## Stores (Estado Global)

```typescript
// src/lib/stores/modelStore.ts

import { writable, derived } from 'svelte/store';
import type * as THREE from 'three';
import type { ModelInfo } from '$lib/loaders/types';

interface ModelState {
  currentModel: THREE.Object3D | null;
  modelInfo: ModelInfo | null;
  isLoading: boolean;
  error: string | null;
  fileName: string | null;
}

const initialState: ModelState = {
  currentModel: null,
  modelInfo: null,
  isLoading: false,
  error: null,
  fileName: null,
};

function createModelStore() {
  const { subscribe, set, update } = writable<ModelState>(initialState);

  return {
    subscribe,
    
    setLoading: (loading: boolean) => {
      update(state => ({ ...state, isLoading: loading, error: null }));
    },
    
    setModel: (model: THREE.Object3D, info: ModelInfo, fileName: string) => {
      update(state => ({
        ...state,
        currentModel: model,
        modelInfo: info,
        fileName,
        isLoading: false,
        error: null,
      }));
    },
    
    setError: (error: string) => {
      update(state => ({ ...state, error, isLoading: false }));
    },
    
    clear: () => {
      set(initialState);
    },
  };
}

export const modelStore = createModelStore();

// Derived store para saber si hay modelo cargado
export const hasModel = derived(
  modelStore,
  $modelStore => $modelStore.currentModel !== null
);
```

---

## Configuración de Colores de Filamento

```typescript
// src/lib/config/filamentColors.ts

export interface FilamentColor {
  name: string;
  hex: string;
  available: boolean;
}

export interface FilamentMaterial {
  name: string;
  code: string;
  description: string;
}

export const filamentColors: FilamentColor[] = [
  { name: 'Negro', hex: '#1a1a1a', available: true },
  { name: 'Blanco', hex: '#ffffff', available: true },
  { name: 'Gris', hex: '#808080', available: true },
  { name: 'Rojo', hex: '#e53935', available: true },
  { name: 'Azul', hex: '#1e88e5', available: true },
  { name: 'Verde', hex: '#43a047', available: true },
  { name: 'Amarillo', hex: '#fdd835', available: true },
  { name: 'Naranja', hex: '#fb8c00', available: true },
  { name: 'Rosa', hex: '#ec407a', available: true },
  { name: 'Morado', hex: '#8e24aa', available: true },
  { name: 'Celeste', hex: '#29b6f6', available: true },
  { name: 'Marrón', hex: '#6d4c41', available: true },
  // Agregar más según inventario real
];

export const materials: FilamentMaterial[] = [
  { 
    name: 'PLA', 
    code: 'pla',
    description: 'Biodegradable, ideal para prototipos y decoración' 
  },
  { 
    name: 'PETG', 
    code: 'petg',
    description: 'Resistente, apto para piezas funcionales' 
  },
  { 
    name: 'ABS', 
    code: 'abs',
    description: 'Alta resistencia térmica y mecánica' 
  },
  { 
    name: 'TPU', 
    code: 'tpu',
    description: 'Flexible, ideal para fundas y juntas' 
  },
];
```

---

## Dependencias (package.json)

```json
{
  "name": "impresion3d-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "@types/three": "^0.160.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0",
    "svelte-check": "^3.6.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "jszip": "^3.10.1",
    "lucide-svelte": "^0.300.0",
    "three": "^0.160.0"
  },
  "type": "module"
}
```

---

## Comandos de Inicio

```bash
# Crear proyecto
npm create svelte@latest impresion3d-web
# Seleccionar: Skeleton project, TypeScript, ESLint

# Instalar dependencias
cd impresion3d-web
npm install

# Agregar Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Agregar Three.js y dependencias
npm install three jszip lucide-svelte
npm install -D @types/three

# Iniciar desarrollo
npm run dev
```

---

## Notas de Implementación

1. **Three.js en Svelte**: Usar `onMount` para inicializar Three.js (requiere DOM)
2. **Loaders async**: Los loaders de Three.js son asíncronos, manejar con async/await
3. **Memory leaks**: Implementar cleanup de geometrías y materiales en `onDestroy`
4. **File size**: Considerar límite de ~50MB para archivos subidos
5. **Mobile**: OrbitControls soporta touch, pero considerar controles simplificados
6. **SSR**: Deshabilitar SSR para componentes Three.js o usar dynamic imports
