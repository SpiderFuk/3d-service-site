<script lang="ts">
	/**
	 * Sección de colores de filamento y materiales
	 */

	import { getMaterialesList, getColoresByMaterial } from '$lib/config/filamentColors';
	import ColorSwatch from '../ui/ColorSwatch.svelte';
	import Card from '../ui/Card.svelte';

	const materiales = getMaterialesList();

	let selectedMaterial = $state('pla');

	// Los colores se actualizan automáticamente cuando cambia el material seleccionado
	const colores = $derived(getColoresByMaterial(selectedMaterial));
	const materialActual = $derived(materiales.find((m) => m.id === selectedMaterial));
</script>

<section id="filaments" class="py-20 bg-background-secondary">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
				Materiales y Colores
			</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Amplia variedad de materiales y colores para tus proyectos
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
			<!-- Materiales -->
			<div>
				<h3 class="text-2xl font-bold text-text mb-6">Materiales Disponibles</h3>
				<div class="space-y-4">
					{#each materiales as material}
						<Card
							padding="md"
							shadow={true}
							hover={true}
							class="cursor-pointer transition-all {selectedMaterial === material.id
								? 'ring-2 ring-primary'
								: ''}"
						>
							<button
								onclick={() => (selectedMaterial = material.id)}
								class="w-full text-left"
							>
								<div class="flex items-start justify-between mb-2">
									<h4 class="text-xl font-bold text-text">{material.nombre}</h4>
									<span
										class="px-3 py-1 text-sm font-medium rounded-full {material.disponible
											? 'bg-primary/10 text-primary'
											: 'bg-gray-200 text-gray-500'}"
									>
										{material.disponible ? 'Disponible' : 'No disponible'}
									</span>
								</div>
								<p class="text-text-secondary mb-3">{material.descripcion}</p>
								<div class="flex flex-wrap gap-2">
									{#each material.propiedades as propiedad}
										<span
											class="px-2 py-1 bg-background text-text-secondary text-xs rounded-md"
										>
											{propiedad}
										</span>
									{/each}
								</div>
							</button>
						</Card>
					{/each}
				</div>
			</div>

			<!-- Colores -->
			<div>
				<h3 class="text-2xl font-bold text-text mb-6">
					Colores en {materialActual?.nombre ?? 'PLA'}
				</h3>
				<Card padding="lg" shadow={true}>
					<div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
						{#each colores as color}
							<ColorSwatch {color} size="lg" />
						{/each}
					</div>

					<div class="mt-6 pt-6 border-t border-gray-200">
						<p class="text-sm text-text-secondary">
							<span class="font-medium text-text">Nota:</span>
							Los colores marcados con ✕ están temporalmente agotados.
							Consultá disponibilidad por WhatsApp.
						</p>
					</div>
				</Card>
			</div>
		</div>
	</div>
</section>
