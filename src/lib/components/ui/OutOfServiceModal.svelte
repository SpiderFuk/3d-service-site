<script lang="ts">
	/**
	 * Modal de notificación de servicio fuera de línea
	 * Aparece en la primera visita del usuario
	 */

	import { AlertTriangle, X } from 'lucide-svelte';
	import { uiStore } from '$lib/stores/uiStore';
	import { outOfServiceConfig } from '$lib/config/outOfServiceConfig';
	import Button from './Button.svelte';
	import Card from './Card.svelte';

	/**
	 * Cierra el modal y actualiza el estado
	 */
	function handleDismiss() {
		uiStore.dismissOutOfServiceModal();
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
		<Card padding="lg" class="relative border-2 border-amber-300 bg-amber-50">
			<!-- Botón cerrar -->
			<button
				onclick={handleDismiss}
				class="absolute top-4 right-4 p-1 hover:bg-amber-100 rounded-lg transition-colors"
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
				<h2 id="modal-title" class="text-2xl font-bold text-amber-900">
					{outOfServiceConfig.modal.title}
				</h2>

				<!-- Mensaje -->
				<p class="text-amber-800 leading-relaxed">
					{outOfServiceConfig.modal.message}
				</p>

				<!-- Botón -->
				<Button variant="primary" size="lg" fullWidth onclick={handleDismiss}>
					{outOfServiceConfig.modal.buttonText}
				</Button>
			</div>
		</Card>
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
