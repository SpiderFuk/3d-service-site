<script lang="ts">
	/**
	 * Muestra información del modelo cargado
	 */

	import { Ruler, Box, Grid3x3 } from 'lucide-svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { formatDimensions, formatVolume, formatNumber } from '$lib/utils/formatters';
	import Card from '../ui/Card.svelte';

	let modelInfo = $derived($modelStore.modelInfo);
	let fileName = $derived($modelStore.fileName);
</script>

{#if modelInfo}
	<Card padding="md" shadow={true}>
		<div class="space-y-4">
			<div>
				<h3 class="font-bold text-lg text-text mb-1">Información del Modelo</h3>
				<p class="text-sm text-text-secondary truncate">{fileName}</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<!-- Dimensiones -->
				<div class="flex items-start gap-3">
					<div class="p-2 bg-primary/10 rounded-lg">
						<Ruler size={20} class="text-primary" />
					</div>
					<div>
						<p class="text-xs text-text-secondary mb-1">Dimensiones</p>
						<p class="text-sm font-semibold text-text">
							{formatDimensions(modelInfo.dimensions.x, modelInfo.dimensions.y, modelInfo.dimensions.z)}
						</p>
					</div>
				</div>

				<!-- Volumen -->
				<div class="flex items-start gap-3">
					<div class="p-2 bg-primary/10 rounded-lg">
						<Box size={20} class="text-primary" />
					</div>
					<div>
						<p class="text-xs text-text-secondary mb-1">Volumen</p>
						<p class="text-sm font-semibold text-text">{formatVolume(modelInfo.volume)}</p>
					</div>
				</div>

				<!-- Triángulos -->
				<div class="flex items-start gap-3">
					<div class="p-2 bg-primary/10 rounded-lg">
						<Grid3x3 size={20} class="text-primary" />
					</div>
					<div>
						<p class="text-xs text-text-secondary mb-1">Triángulos</p>
						<p class="text-sm font-semibold text-text">
							{formatNumber(modelInfo.triangles)}
						</p>
					</div>
				</div>
			</div>
		</div>
	</Card>
{/if}
