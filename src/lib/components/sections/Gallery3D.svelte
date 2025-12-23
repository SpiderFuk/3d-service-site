<script lang="ts">
	/**
	 * Galería de trabajos realizados
	 */

	import Card from '../ui/Card.svelte';

	interface GalleryItem {
		id: string;
		title: string;
		description: string;
		image?: string;
		category: string;
	}

	// TODO: Reemplazar con imágenes reales de trabajos
	const galleryItems: GalleryItem[] = [
		{
			id: '1',
			title: 'Prototipo Mecánico',
			description: 'Engranajes funcionales en PETG',
			category: 'Industrial'
		},
		{
			id: '2',
			title: 'Figura Decorativa',
			description: 'Escultura detallada en PLA',
			category: 'Arte'
		},
		{
			id: '3',
			title: 'Organizador de Escritorio',
			description: 'Diseño personalizado',
			category: 'Funcional'
		},
		{
			id: '4',
			title: 'Carcasa Personalizada',
			description: 'Protección a medida',
			category: 'Accesorios'
		},
		{
			id: '5',
			title: 'Repuesto Industrial',
			description: 'Pieza de reemplazo en ABS',
			category: 'Industrial'
		},
		{
			id: '6',
			title: 'Miniatura de Arquitectura',
			description: 'Maqueta de edificio',
			category: 'Arquitectura'
		}
	];
</script>

<section id="gallery" class="py-20 bg-background-secondary">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
				Galería de Proyectos
			</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Algunos de nuestros trabajos más recientes
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each galleryItems as item}
				<Card padding="none" shadow={true} hover={true}>
					<div class="aspect-square bg-background rounded-t-lg flex items-center justify-center">
						{#if item.image}
							<img
								src={item.image}
								alt={item.title}
								class="w-full h-full object-cover rounded-t-lg"
							/>
						{:else}
							<div class="text-6xl text-text-secondary/20">3D</div>
						{/if}
					</div>

					<div class="p-4">
						<span
							class="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2"
						>
							{item.category}
						</span>
						<h3 class="text-lg font-bold text-text mb-1">{item.title}</h3>
						<p class="text-sm text-text-secondary">{item.description}</p>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>
