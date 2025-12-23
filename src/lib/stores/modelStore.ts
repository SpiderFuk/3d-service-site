/**
 * Store para gestionar el estado del modelo 3D cargado
 */

import { writable } from 'svelte/store';
import type { Object3D } from 'three';
import type { ModelInfo } from '$lib/loaders/types';

export interface ModelState {
	currentModel: Object3D | null;
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
	fileName: null
};

function createModelStore() {
	const { subscribe, set, update } = writable<ModelState>(initialState);

	return {
		subscribe,

		/**
		 * Establece un nuevo modelo
		 */
		setModel: (model: Object3D, info: ModelInfo, fileName: string) => {
			update((state) => ({
				...state,
				currentModel: model,
				modelInfo: { ...info, filename: fileName },
				fileName,
				error: null
			}));
		},

		/**
		 * Limpia el modelo actual
		 */
		clearModel: () => {
			update((state) => ({
				...state,
				currentModel: null,
				modelInfo: null,
				fileName: null,
				error: null
			}));
		},

		/**
		 * Establece el estado de carga
		 */
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},

		/**
		 * Establece un error
		 */
		setError: (error: string) => {
			update((state) => ({
				...state,
				error,
				isLoading: false
			}));
		},

		/**
		 * Limpia el error
		 */
		clearError: () => {
			update((state) => ({ ...state, error: null }));
		},

		/**
		 * Resetea el store al estado inicial
		 */
		reset: () => set(initialState)
	};
}

export const modelStore = createModelStore();
