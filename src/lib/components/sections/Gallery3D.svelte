<script lang="ts">
	/**
	 * Galería de trabajos realizados - Carrusel horizontal con auto-scroll
	 */

	interface GalleryItem {
		id: string;
		title: string;
		description: string;
		image: string;
		category: string;
	}

	const galleryItems: GalleryItem[] = [
		{
			id: "1",
			title: "Tu compañero peludo",
			description: "Dale vida a su personalidad única",
			image: "/images/galery/20260120_184323 (1).jpg",
			category: "Mascotas",
		},
		{
			id: "2",
			title: "Panel de manga favorito",
			description: "El momento que cambió toda la historia",
			image: "/images/galery/20260120_212023 (1).jpg",
			category: "Colección",
		},
		{
			id: "3",
			title: "Juntos para siempre",
			description: "Inmortalizamos tu historia de amor",
			image: "/images/galery/20260120_211651 (1).jpg",
			category: "Momentos",
		},
		{
			id: "4",
			title: "Tu escena favorita",
			description: "Dale forma a ese panel inolvidable",
			image: "/images/galery/20260120_211545(2).jpg",
			category: "Ilustración",
		},
	];

	// Triplicar items para scroll infinito continuo
	const displayItems = [...galleryItems, ...galleryItems, ...galleryItems];

	const MAX_SPEED = 0.5;
	const EASE_DECEL = 0.008;
	const EASE_ACCEL = 0.06;

	let scrollContainer: HTMLDivElement;
	let isDragging = $state(false);
	let isHovering = $state(false);
	let startX = $state(0);
	let scrollStart = $state(0);
	let currentSpeed = MAX_SPEED;

	function handlePointerDown(e: PointerEvent) {
		if (e.pointerType === "touch") return;
		isDragging = true;
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollStart = scrollContainer.scrollLeft;
		scrollContainer.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 1.5;
		scrollContainer.scrollLeft = scrollStart - walk;
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		scrollContainer.releasePointerCapture(e.pointerId);
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
		isDragging = false;
	}

	$effect(() => {
		if (!scrollContainer) return;

		function getOneSetWidth(): number {
			const count = galleryItems.length;
			const first = scrollContainer.children[0] as HTMLElement;
			const nthChild = scrollContainer.children[count] as HTMLElement;
			return nthChild.offsetLeft - first.offsetLeft;
		}

		function animate() {
			const targetSpeed = isHovering || isDragging ? 0 : MAX_SPEED;
			const easing = targetSpeed > currentSpeed ? EASE_ACCEL : EASE_DECEL;
			currentSpeed += (targetSpeed - currentSpeed) * easing;

			if (currentSpeed > 0.01 && scrollContainer) {
				scrollContainer.scrollLeft += currentSpeed;

				// Reset para loop infinito: al pasar un set completo, volver atrás
				const oneSet = getOneSetWidth();
				if (scrollContainer.scrollLeft >= oneSet) {
					scrollContainer.scrollLeft -= oneSet;
				}
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

		<!-- Contenedor scrollable -->
		<div
			bind:this={scrollContainer}
			class="flex gap-4 overflow-x-auto hide-scrollbar px-6 py-2"
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
</section>
