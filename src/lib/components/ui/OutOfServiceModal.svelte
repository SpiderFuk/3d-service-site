<script lang="ts">
	/**
	 * Modal de notificación de servicio fuera de línea
	 * Aparece en la primera visita del usuario
	 * Configuración controlada dinámicamente por AWS AppConfig
	 */

	import { AlertTriangle, X } from 'lucide-svelte';
	import { outOfServiceUI, dismissOutOfServiceModal } from '$lib/stores/uiStore';
	import Button from './Button.svelte';

	// Configuración reactiva desde el derived store
	const config = $derived($outOfServiceUI.config);

	/**
	 * Cierra el modal y actualiza el estado en localStorage
	 */
	function handleDismiss() {
		dismissOutOfServiceModal();
	}

	/**
	 * Maneja el cierre con la tecla Escape
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleDismiss();
		}
	}
</script>

<!-- Backdrop con blur -->
<div
	class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	onkeydown={handleKeydown}
	tabindex="-1"
>
	<!-- Modal Card -->
	<div class="max-w-md w-full animate-fade-in">
		<!-- Colores ambar semanticos; solo radio y tipografia de marca -->
		<div class="relative p-6 md:p-8 bg-amber-50 border-2 border-amber-300 rounded-brand-xl">
			<!-- Botón cerrar -->
			<button
				onclick={handleDismiss}
				class="absolute top-3 right-3 w-11 h-11 flex items-center justify-center hover:bg-amber-100 rounded-full transition-colors"
				aria-label="Cerrar"
			>
				<X size={20} class="text-amber-700" />
			</button>

			<!-- Contenido -->
			<div class="flex flex-col items-center text-center gap-6">
				<!-- Ícono -->
				<div class="p-4 bg-amber-200 rounded-full">
					<AlertTriangle size={48} class="text-amber-600" />
				</div>

				<!-- Título -->
				<h2 id="modal-title" class="text-2xl font-extrabold text-amber-900">
					{config.modal.title}
				</h2>

				<!-- Mensaje -->
				<p class="text-amber-800 leading-relaxed">
					{config.modal.message}
				</p>

				<!-- Botón -->
				<Button variant="primary" size="lg" fullWidth onclick={handleDismiss}>
					{config.modal.buttonText}
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
