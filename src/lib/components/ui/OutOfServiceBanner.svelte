<script lang="ts">
	/**
	 * Banner sticky de notificación de servicio fuera de línea
	 * Aparece después de cerrar el modal
	 */

	import { AlertTriangle, AlertCircle, Info, X } from 'lucide-svelte';
	import { uiStore } from '$lib/stores/uiStore';
	import { outOfServiceConfig } from '$lib/config/outOfServiceConfig';

	// Mapea el nombre del ícono al componente
	const iconMap = {
		'alert-triangle': AlertTriangle,
		'alert-circle': AlertCircle,
		info: Info
	};

	const IconComponent = $derived(iconMap[outOfServiceConfig.banner.icon]);

	/**
	 * Cierra el banner si es dismissible
	 */
	function handleDismiss() {
		if (outOfServiceConfig.banner.dismissible) {
			uiStore.dismissOutOfServiceBanner();
		}
	}
</script>

<div
	class="sticky top-16 left-0 right-0 z-[40] bg-amber-100 border-b-2 border-amber-400 shadow-sm"
	role="alert"
	aria-live="polite"
>
	<div class="container mx-auto px-4 py-3">
		<div class="flex items-center justify-center gap-3 relative">
			<!-- Ícono -->
			<IconComponent size={20} class="text-amber-600 flex-shrink-0" />

			<!-- Mensaje -->
			<p class="text-sm md:text-base font-medium text-amber-800 text-center">
				{outOfServiceConfig.banner.message}
			</p>

			<!-- Botón cerrar (solo si es dismissible) -->
			{#if outOfServiceConfig.banner.dismissible}
				<button
					onclick={handleDismiss}
					class="absolute right-0 p-1 hover:bg-amber-200 rounded-lg transition-colors"
					aria-label="Cerrar banner"
				>
					<X size={18} class="text-amber-700" />
				</button>
			{/if}
		</div>
	</div>
</div>
