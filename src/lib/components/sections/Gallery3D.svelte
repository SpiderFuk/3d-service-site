<script lang="ts">
	/**
	 * Galería de trabajos realizados - Carrusel horizontal con auto-scroll
	 * Carga items desde /content/data/gallery.json con fallback local
	 */

	import { onMount } from 'svelte';
	import { fetchContent } from '$lib/services/contentService';
	import type { GalleryItem, GalleryContent } from '$lib/types/content';

	const fallbackItems: GalleryItem[] = [
		{
			id: "1",
			title: "Tu compañero peludo",
			description: "Dale vida a su personalidad única",
			image: "/images/galery/20260120_184323 (1).jpg",
			category: "Mascotas",
			createdAt: "2026-01-20T18:43:23Z",
		},
		{
			id: "2",
			title: "Panel de manga favorito",
			description: "El momento que cambió toda la historia",
			image: "/images/galery/20260120_212023 (1).jpg",
			category: "Colección",
			createdAt: "2026-01-20T21:20:23Z",
		},
		{
			id: "3",
			title: "Juntos para siempre",
			description: "Inmortalizamos tu historia de amor",
			image: "/images/galery/20260120_211651 (1).jpg",
			category: "Momentos",
			createdAt: "2026-01-20T21:16:51Z",
		},
		{
			id: "4",
			title: "Tu escena favorita",
			description: "Dale forma a ese panel inolvidable",
			image: "/images/galery/20260120_211545(2).jpg",
			category: "Ilustración",
			createdAt: "2026-01-20T21:15:45Z",
		},
	];

	let galleryItems = $state<GalleryItem[]>(fallbackItems);
	let isLoading = $state(true);

	// Triplicar items para scroll infinito continuo
	const displayItems = $derived([...galleryItems, ...galleryItems, ...galleryItems]);

	onMount(async () => {
		const fallback: GalleryContent = { items: fallbackItems, updatedAt: '' };
		const content = await fetchContent<GalleryContent>('gallery', fallback);

		// Ordenar por createdAt (más reciente primero) si viene del remoto
		if (content.updatedAt) {
			content.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}

		galleryItems = content.items;
		isLoading = false;
	});

	const MAX_SPEED = 0.5;
	const EASE_DECEL = 0.008;
	const EASE_ACCEL = 0.06;

	let trackEl: HTMLDivElement;
	let isDragging = $state(false);
	let isHovering = $state(false);
	let startX = 0;
	let dragStart = 0;
	let currentSpeed = MAX_SPEED;
	let offset = 0;

	function handlePointerDown(e: PointerEvent) {
		if (e.pointerType === "touch") return;
		isDragging = true;
		startX = e.pageX;
		dragStart = offset;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		e.preventDefault();
		offset = dragStart + (e.pageX - startX);
		trackEl.style.transform = `translateX(${offset}px)`;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
		isDragging = false;
	}

	$effect(() => {
		if (!trackEl) return;

		function animate() {
			if (!isDragging) {
				const targetSpeed = isHovering ? 0 : MAX_SPEED;
				const easing = targetSpeed > currentSpeed ? EASE_ACCEL : EASE_DECEL;
				currentSpeed += (targetSpeed - currentSpeed) * easing;

				if (currentSpeed > 0.01) {
					offset -= currentSpeed;
				}

				// Medir ancho de un set desde el DOM (soporta items dinámicos)
				const count = galleryItems.length;
				if (count > 0 && trackEl.children.length > count) {
					const w =
						(trackEl.children[count] as HTMLElement).offsetLeft -
						(trackEl.children[0] as HTMLElement).offsetLeft;
					if (w > 0) {
						if (offset <= -w) offset += w;
						else if (offset > 0) offset -= w;
					}
				}

				trackEl.style.transform = `translateX(${offset}px)`;
			} else {
				currentSpeed += (0 - currentSpeed) * EASE_DECEL;
			}

			rafId = requestAnimationFrame(animate);
		}

		let rafId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafId);
	});
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
	</div>

	<div class="relative">
		<!-- Gradientes en los bordes -->
		<div
			class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background-secondary to-transparent z-10 pointer-events-none"
		></div>
		<div
			class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background-secondary to-transparent z-10 pointer-events-none"
		></div>

		<!-- Contenedor: recorta el track y captura eventos de puntero -->
		<div
			class="overflow-hidden py-2"
			class:cursor-grabbing={isDragging}
			class:cursor-grab={!isDragging}
			role="region"
			aria-label="Galería de proyectos"
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointercancel={handlePointerUp}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
		>
			<div bind:this={trackEl} class="flex gap-4 will-change-transform">
			{#each displayItems as item, i (i)}
				<div
					class="flex-shrink-0 w-[280px] rounded-xl overflow-hidden shadow-card select-none"
				>
					<div class="relative aspect-square">
						<img
							src={item.image}
							alt={item.title}
							class="w-full h-full object-cover pointer-events-none"
							draggable="false"
						/>
						<div
							class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12"
						>
							<span
								class="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-1.5"
							>
								{item.category}
							</span>
							<h3
								class="text-white font-semibold text-base leading-tight"
							>
								{item.title}
							</h3>
							<p
								class="text-white/80 text-sm mt-1 leading-snug"
							>
								{item.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
			</div>
		</div>
	</div>
</section>
