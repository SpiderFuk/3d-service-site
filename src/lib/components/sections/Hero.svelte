<script lang="ts">
	/**
	 * Sección Hero principal
	 * Texto a la izquierda y bloque cobalto con el carrete a la derecha (abajo en celular)
	 */

	import { ArrowRight } from 'lucide-svelte';
	import { contactInfo } from '$lib/config/contact';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { scrollToSection } from '$lib/utils/scroll';
	import Button from '../ui/Button.svelte';
	import { materialsCount as materialsCountStore, colorsCount as colorsCountStore } from '$lib/stores/materialsStore';

	function handleCTA() {
		openWhatsApp();
	}

	function handleViewerClick() {
		scrollToSection('viewer');
	}

	const materialsCount = $derived($materialsCountStore);
	const colorsCount = $derived($colorsCountStore);

	// Carrete: discos concentricos de afuera hacia adentro (ver docs/brand.md)
	const discosCarrete = [
		{ radio: 146, color: 'var(--tomate)' },
		{ radio: 116, color: 'var(--mantequilla)' },
		{ radio: 86, color: 'var(--menta)' },
		{ radio: 56, color: 'var(--crema)' },
		{ radio: 26, color: 'var(--cobalto)' }
	];
</script>

<section id="hero" class="bg-background lg:min-h-[calc(100vh-4rem)] flex items-center">
	<div class="container mx-auto px-4 md:px-16 py-12 md:py-20">
		<div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
			<!-- Contenido -->
			<div class="space-y-6">
				<p
					class="inline-flex items-center gap-2 bg-white border-2 border-tinta rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-tinta"
				>
					<span class="w-2 h-2 rounded-full bg-tomate" aria-hidden="true"></span>
					Impresión 3D en {contactInfo.city}
				</p>

				<h1 class="text-[44px] sm:text-6xl lg:text-[72px] leading-[0.95] text-tinta">
					Tu idea,<br />
					<span class="text-primary whitespace-nowrap">en tus manos.</span>
				</h1>

				<p class="text-lg leading-relaxed text-text-secondary max-w-xl">
					Mandanos tu archivo o contanos qué necesitás y lo imprimimos. Así de simple.
				</p>

				<div class="flex flex-col sm:flex-row gap-4">
					<Button variant="whatsapp" size="lg" onclick={handleCTA}>
						Pedir presupuesto
						<ArrowRight size={20} />
					</Button>

					<Button variant="outline" size="lg" onclick={handleViewerClick}>
						Ver el visor 3D
					</Button>
				</div>

				<!-- Características rápidas -->
				<div class="grid grid-cols-3 gap-3 pt-4 max-w-md">
					<div class="bg-mantequilla rounded-brand-lg p-4">
						<p class="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-tinta">24-48h</p>
						<p class="text-sm font-semibold text-tinta">Entrega rápida</p>
					</div>
					<div class="bg-menta rounded-brand-lg p-4">
						<p class="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-tinta">{materialsCount}+</p>
						<p class="text-sm font-semibold text-tinta">Materiales</p>
					</div>
					<div class="bg-tomate rounded-brand-lg p-4">
						<p class="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-tinta">{colorsCount}+</p>
						<p class="text-sm font-semibold text-tinta">Colores</p>
					</div>
				</div>
			</div>

			<!-- Bloque cobalto con el carrete (decorativo) -->
			<div
				class="bg-cobalto rounded-brand-xl p-8 sm:p-12 flex items-center justify-center"
				aria-hidden="true"
			>
				<svg viewBox="0 0 300 300" class="w-full max-w-[280px] sm:max-w-sm h-auto">
					{#each discosCarrete as disco (disco.radio)}
						<circle cx="150" cy="150" r={disco.radio} fill={disco.color} />
					{/each}
				</svg>
			</div>
		</div>
	</div>
</section>
