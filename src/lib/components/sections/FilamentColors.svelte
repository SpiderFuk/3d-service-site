<script lang="ts">
	/**
	 * Sección de colores de filamento y materiales
	 * Consume datos del materialsStore (remoto con fallback local)
	 */

	import { availableMaterials, materialsStore, getColoresForMaterial } from '$lib/stores/materialsStore';
	import ColorSwatch from '../ui/ColorSwatch.svelte';
	import Card from '../ui/Card.svelte';

	const materiales = $derived($availableMaterials);

	let selectedMaterial = $state('pla');

	// Verificar que el material seleccionado siga disponible
	$effect(() => {
		if (!materiales.find((m) => m.id === selectedMaterial)) {
			selectedMaterial = materiales[0]?.id || 'pla';
		}
	});

	// Los colores se actualizan automáticamente cuando cambia el material seleccionado
	const colores = $derived(getColoresForMaterial($materialsStore.materials, selectedMaterial));
	const materialActual = $derived(materiales.find((m) => m.id === selectedMaterial));
</script>

<section id="filaments" class="py-20 bg-white">
	<div class="container mx-auto px-4 md:px-16">
		<div class="text-center mb-12">
			<p class="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-secondary mb-3">
				Materiales
			</p>
			<h2 class="text-3xl md:text-5xl text-text mb-4">Materiales y colores</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Amplia variedad de materiales y colores para tus proyectos
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
			<!-- Materiales -->
			<div>
				<h3 class="text-2xl text-text mb-6">Materiales disponibles</h3>
				<div class="space-y-4">
					{#each materiales as material (material.id)}
						<Card
							padding="md"
							hover={true}
							class="cursor-pointer transition-all {selectedMaterial === material.id
								? 'ring-4 ring-primary ring-offset-2'
								: ''}"
						>
							<button
								onclick={() => (selectedMaterial = material.id)}
								class="w-full text-left rounded-brand focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-tinta"
								aria-pressed={selectedMaterial === material.id}
							>
								<div class="flex items-start justify-between mb-2">
									<h4 class="font-display text-xl font-bold text-text">{material.nombre}</h4>
									<span
										class="px-3 py-1 text-sm font-semibold rounded-full {material.disponible
											? 'bg-menta text-tinta'
											: 'bg-crema text-text-secondary'}"
									>
										{material.disponible ? 'Disponible' : 'No disponible'}
									</span>
								</div>
								<p class="text-text-secondary mb-3">{material.descripcion}</p>
								<div class="flex flex-wrap gap-2">
									{#each material.propiedades as propiedad (propiedad)}
										<span
											class="px-3 py-1 bg-crema text-text-secondary text-xs font-medium rounded-full"
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
				<h3 class="text-2xl text-text mb-6">
					Colores en {materialActual?.nombre ?? 'PLA'}
				</h3>
				<Card padding="lg">
					<div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
						{#each colores as color (color.id)}
							<ColorSwatch {color} size="lg" />
						{/each}
					</div>

					<div class="mt-6 pt-6 border-t-2 border-crema">
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
