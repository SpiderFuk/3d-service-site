/**
 * Runtime del Visor 3D: todo lo que necesita Three.js en un solo módulo
 *
 * IMPORTANTE: importarlo solo con `await import('$lib/three/viewerRuntime')`.
 * Así Three.js y los loaders quedan en un chunk aparte que se baja cuando la
 * persona se acerca a #visor (o elige un archivo antes), no en la carga inicial.
 */

export { ModelLoaderFactory } from '$lib/loaders/ModelLoaderFactory';
export { crearVisorEscena, liberarObjeto } from './visorEscena';
export type { VisorEscena, MostrarOpciones } from './visorEscena';
export { cargarModelo, crearCuadroProvisorio } from './modeloVisor';
