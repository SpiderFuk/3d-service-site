<script lang="ts">
	/**
	 * Sección de servicios
	 * Filtra servicios según el flag services-visibility de AppConfig
	 */

	import * as Icons from 'lucide-svelte';
	import { servicesVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { getVisibleServices } from '$lib/utils/visibilityHelpers';
	import Card from '../ui/Card.svelte';
	import { Check } from 'lucide-svelte';

	// Map de iconos
	const iconMap: Record<string, any> = {
		Printer: Icons.Printer,
		Pen: Icons.PenTool,
		Zap: Icons.Zap,
		Wrench: Icons.Wrench
	};

	// Filtrar servicios visibles con feature flag
	$: visibleServices = getVisibleServices($servicesVisibilityFlag);
	$: serviceCount = visibleServices.length;
	$: gridCols = serviceCount === 4
		? 'lg:grid-cols-4'
		: serviceCount === 3
		? 'lg:grid-cols-3'
		: 'lg:grid-cols-2';
</script>

<section id="services" class="py-20 bg-background">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
				Nuestros Servicios
			</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Ofrecemos soluciones completas de impresión 3D adaptadas a tus necesidades
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 {gridCols} gap-6">
			{#each visibleServices as service}
				{@const IconComponent = iconMap[service.icon]}
				<Card padding="lg" shadow={true} hover={true}>
					<div class="space-y-4">
						<div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
							<svelte:component this={IconComponent} size={24} class="text-primary" />
						</div>

						<div>
							<h3 class="text-xl font-bold text-text mb-2">{service.title}</h3>
							<p class="text-text-secondary">{service.description}</p>
						</div>

						<ul class="space-y-2">
							{#each service.features as feature}
								<li class="flex items-start gap-2 text-sm text-text-secondary">
									<Check size={16} class="text-primary flex-shrink-0 mt-0.5" />
									<span>{feature}</span>
								</li>
							{/each}
						</ul>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>
