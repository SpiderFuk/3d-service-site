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

	const galleryItems: GalleryItem[] = [
		{
			id: '1',
			title: 'Imagen de una perro',
			description: 'Impresión en PLA de alta calidad',
			image: '/images/galery/20260120_211829 (1).jpg',
			category: 'Cuadros'
		},
		{
			id: '2',
			title: 'Panel de manga favorito',
			description: 'Arte detallada',
			image: '/images/galery/20260120_212023 (1).jpg',
			category: 'Arte'
		},
		{
			id: '6',
			title: 'Imagen de un gato',
			description: 'Impresión en PLA detallada',
			image: '/images/galery/20260120_184323 (1).jpg',
			category: 'Cuadros'
		},
		{
			id: '4',
			title: 'Cuadro con pareja',
			description: 'Tu propia foto en 3D',
			image: '/images/galery/20260120_211651 (1).jpg',
			category: 'Cuadros'
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

		<div class="flex flex-wrap justify-center gap-6">
			{#each galleryItems as item}
				<div class="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] max-w-xs">
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
				</div>
			{/each}
		</div>
	</div>
</section>
