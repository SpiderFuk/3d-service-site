<script lang="ts">
	/**
	 * Barra de navegación fija (01 Navegación, BUILD.md)
	 *
	 * Desktop: logo (112 px, a #inicio) y los cuatro links del menú.
	 * Teléfono (hasta 959 px): barra de 64 px, logo de 96 px, píldora "Presupuesto"
	 * (misma regla que el botón de la barra) y botón redondo de menú. El menú abre un panel
	 * con los links (filas de 56 px, el actual en mantequilla), Instagram, el email y
	 * "Pedir presupuesto" a todo el ancho.
	 * Queda dentro de <header>: el Hero mide su alto para saber si la barra tapa su botón.
	 *
	 * "Pedir presupuesto" (cobalto) aparece solo cuando el botón del Hero salió de vista
	 * (heroCtaVisible). Su lugar está reservado siempre: la barra no cambia de tamaño
	 * al aparecer el botón, así el margen del observer del Hero sigue siendo correcto.
	 *
	 * Link actual: un IntersectionObserver sobre las secciones con ancla escribe
	 * uiStore.activeSection; solo los cuatro destinos del menú marcan un link.
	 * Debajo de los links, una sola barra cobalto se desliza hasta el link actual.
	 * Al tocar un ancla (barra, panel, pie o cualquier botón de la página) el destino
	 * pasa a ser el actual enseguida, sin recorrer las secciones del medio.
	 */
	import { onDestroy, onMount, tick } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CarreteChico from './CarreteChico.svelte';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { uiStore, heroCtaVisible } from '$lib/stores/uiStore';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { contactInfo } from '$lib/config/contact';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';
	import { observarSeccionActual } from '$lib/utils/scroll';

	const items = $derived(getVisibleNavItems($sectionsVisibilityFlag));
	const seccionActual = $derived($uiStore.activeSection);
	const menuAbierto = $derived($uiStore.isMobileMenuOpen);

	let barra: HTMLElement;
	let menuBoton: HTMLButtonElement;
	let panel: HTMLDivElement;
	let listaEnlaces: HTMLUListElement;

	/** Barra del link actual: posición y ancho medidos del link, relativos a la lista */
	let indicador = $state({ x: 0, ancho: 0, visible: false });
	/** Sin transición hasta la primera ubicación: la barra no entra deslizándose desde 0 */
	let indicadorAnimado = $state(false);

	function medirIndicador() {
		const link = listaEnlaces?.querySelector<HTMLElement>('.barra-enlace.actual');
		if (!link) {
			indicador.visible = false;
			return;
		}
		const caja = link.getBoundingClientRect();
		indicador = {
			x: caja.left - listaEnlaces.getBoundingClientRect().left,
			ancho: caja.width,
			visible: true
		};
		if (!indicadorAnimado) requestAnimationFrame(() => (indicadorAnimado = true));
	}

	// Se mide después de que el DOM marca el link actual (y cuando cambian los items)
	$effect(() => {
		void seccionActual;
		void items;
		medirIndicador();
	});

	// Los links cambian de ancho con la fuente web y con el ancho de la ventana
	onMount(() => {
		const observador = new ResizeObserver(medirIndicador);
		observador.observe(listaEnlaces);
		return () => observador.disconnect();
	});

	/**
	 * Mientras dura el scroll suave de un clic en un ancla, el observer no cambia
	 * el link actual. Termina cuando el scroll se queda quieto 150 ms (o si no
	 * arranca en 300 ms, p. ej. porque la sección ya estaba en su lugar).
	 */
	let siguiendoClic = false;

	onMount(() => {
		let espera: ReturnType<typeof setTimeout> | undefined;

		const soltar = () => {
			siguiendoClic = false;
			window.removeEventListener('scroll', alScroll);
		};
		const alScroll = () => {
			clearTimeout(espera);
			espera = setTimeout(soltar, 150);
		};
		const alClic = (evento: MouseEvent) => {
			const link = (evento.target as Element | null)?.closest?.('a[href^="#"]');
			const id = link?.getAttribute('href')?.slice(1);
			if (!id || !document.getElementById(id)?.matches('main section[id]')) return;

			uiStore.setActiveSection(id);
			siguiendoClic = true;
			window.addEventListener('scroll', alScroll, { passive: true });
			clearTimeout(espera);
			espera = setTimeout(soltar, 300);
		};

		document.addEventListener('click', alClic);
		return () => {
			document.removeEventListener('click', alClic);
			clearTimeout(espera);
			soltar();
		};
	});

	/** Cierra el menú; por defecto devuelve el foco al botón de menú */
	function cerrarMenu(devolverFoco = true) {
		if (!menuAbierto) return;
		uiStore.closeMobileMenu();
		if (devolverFoco) menuBoton?.focus({ preventScroll: true });
	}

	/** Abre el menú y lleva el foco al primer link */
	async function abrirMenu() {
		uiStore.toggleMobileMenu();
		await tick();
		panel?.querySelector<HTMLElement>('a')?.focus();
	}

	function alternarMenu() {
		if (menuAbierto) cerrarMenu();
		else abrirMenu();
	}

	/**
	 * Tocar cualquier link del panel (ancla, Instagram, email, WhatsApp) cierra el menú.
	 * Con los links externos el foco vuelve al botón de menú; con las anclas lo maneja
	 * el navegador (el siguiente Tab sigue desde la sección destino).
	 */
	function alTocarPanel(evento: MouseEvent) {
		const link = (evento.target as HTMLElement).closest('a');
		if (link) cerrarMenu(!link.getAttribute('href')?.startsWith('#'));
	}

	/** Si el foco sale de la barra con Tab (p. ej. después del último link), se cierra */
	function alSalirFoco(evento: FocusEvent) {
		const destino = evento.relatedTarget as Node | null;
		if (menuAbierto && destino && !barra.contains(destino)) cerrarMenu(false);
	}

	// Mientras el menú está abierto: bloquear el scroll del body, Escape cierra y
	// pasar a desktop (más de 959 px) cierra. La limpieza corre al cerrar por cualquier
	// camino y al destruir el componente, así el bloqueo siempre se libera.
	$effect(() => {
		if (!menuAbierto) return;

		const overflowPrevio = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const alTeclear = (evento: KeyboardEvent) => {
			if (evento.key === 'Escape') {
				evento.preventDefault();
				cerrarMenu();
			}
		};
		const escritorio = window.matchMedia('(min-width: 960px)');
		const alCambiarAncho = () => {
			if (escritorio.matches) cerrarMenu(false);
		};

		window.addEventListener('keydown', alTeclear);
		escritorio.addEventListener('change', alCambiarAncho);

		return () => {
			document.body.style.overflow = overflowPrevio;
			window.removeEventListener('keydown', alTeclear);
			escritorio.removeEventListener('change', alCambiarAncho);
		};
	});

	// Si la barra se desmonta (p. ej. por flags), el menú no queda abierto en el store
	onDestroy(() => uiStore.closeMobileMenu());

	// Se vuelve a observar cuando los flags muestran u ocultan secciones
	$effect(() => {
		void $sectionsVisibilityFlag;
		let activo = true;
		let desconectar = () => {};

		tick().then(() => {
			if (!activo) return;
			const secciones = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
			desconectar = observarSeccionActual(secciones, (id) => {
				if (!siguiendoClic) uiStore.setActiveSection(id);
			});
		});

		return () => {
			activo = false;
			desconectar();
		};
	});
</script>

<header class="barra" bind:this={barra} onfocusout={alSalirFoco}>
	<nav aria-label="Principal" class="barra-nav">
		<a href="#inicio" aria-label="printo, ir al inicio" class="barra-logo">
			<img src="/brand/printo-wordmark-cobalto.svg" alt="" />
		</a>

		<div class="barra-centro">
			<ul class="barra-enlaces" bind:this={listaEnlaces}>
				{#each items as item (item.href)}
					{@const actual = seccionActual === item.href.slice(1)}
					<li>
						<a
							href={item.href}
							aria-label={item.ariaLabel}
							aria-current={actual ? 'location' : undefined}
							class="barra-enlace"
							class:actual>{item.label}</a
						>
					</li>
				{/each}
			</ul>
			<span
				class="barra-indicador"
				class:visible={indicador.visible}
				class:animado={indicadorAnimado}
				style:width="{indicador.ancho}px"
				style:transform="translateX({indicador.x}px)"
				aria-hidden="true"
			></span>
		</div>

		<div class="barra-cta">
			{#if !$heroCtaVisible}
				<Button
					variant="quote"
					href={whatsappUrl(mensajes.presupuesto)}
					class="barra-cta-boton"
					aria-label="Pedir presupuesto por WhatsApp"
				>
					<CarreteChico />
					Pedir presupuesto
				</Button>
			{/if}
		</div>

		<!-- Solo teléfono (en desktop queda vacío, en la misma celda que el botón) -->
		<div class="barra-movil">
			{#if !$heroCtaVisible}
				<Button
					variant="quote"
					href={whatsappUrl(mensajes.presupuesto)}
					class="barra-pildora"
					aria-label="Presupuesto por WhatsApp"
				>
					<CarreteChico tamano="sm" class="pildora-carrete" />
					Presupuesto
				</Button>
			{/if}
			<button
				type="button"
				id="menu-boton"
				bind:this={menuBoton}
				class="barra-menu"
				class:abierto={menuAbierto}
				aria-controls="menu-movil"
				aria-expanded={menuAbierto}
				aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
				onclick={alternarMenu}
			>
				<span class="barra-menu-rayas" aria-hidden="true"><span></span><span></span><span></span></span>
			</button>
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<!-- El clic se delega a los links del panel (que ya son interactivos con teclado) -->
		<div
			id="menu-movil"
			class="panel"
			hidden={!menuAbierto}
			bind:this={panel}
			onclick={alTocarPanel}
		>
			<ul class="panel-enlaces">
				{#each items as item (item.href)}
					{@const actual = seccionActual === item.href.slice(1)}
					<li>
						<a
							href={item.href}
							aria-label={item.ariaLabel}
							aria-current={actual ? 'location' : undefined}
							class="panel-enlace"
							class:actual>{item.label}</a
						>
					</li>
				{/each}
			</ul>

			<div class="panel-canales">
				<a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener">Instagram</a>
				<a href="mailto:{contactInfo.email}">{contactInfo.email}</a>
			</div>

			<Button
				variant="quote"
				size="lg"
				full
				href={whatsappUrl(mensajes.presupuesto)}
				aria-label="Pedir presupuesto por WhatsApp"
			>
				<CarreteChico />
				Pedir presupuesto
			</Button>
		</div>
	</nav>
</header>

<style>
	.barra {
		position: sticky;
		top: 0;
		z-index: 20;
		border-bottom: var(--border);
		background: var(--color-crema);
	}

	/* Alto fijo desde --header-height (las anclas y el panel del menú lo usan).
	   Tres columnas: logo | links | botón. Las de los costados miden lo mismo (1fr),
	   así los links quedan centrados en la página aunque el logo y el botón difieran.
	   Si no hay lugar para dos costados iguales, la del botón conserva su mínimo. */
	.barra-nav {
		max-width: 1440px;
		height: calc(var(--header-height) - var(--border-width));
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		column-gap: 24px;
	}

	.barra-logo {
		grid-column: 1;
		justify-self: start;
		display: flex;
		align-items: center;
		min-height: var(--tap-min);
	}

	.barra-logo img {
		display: block;
		width: 112px;
		height: auto;
	}

	.barra-centro {
		grid-column: 2;
		position: relative;
	}

	.barra-enlaces {
		display: flex;
		align-items: center;
		gap: 4px 32px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.barra-enlace {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		color: var(--color-tinta);
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
	}

	.barra-enlace:hover {
		color: var(--color-cobalto);
	}

	/* Desktop chico: links más juntos para que entren las tres columnas centradas */
	@media (min-width: 960px) and (max-width: 1199px) {
		.barra-enlaces {
			column-gap: 24px;
		}
	}

	/* Link de la sección en vista: 600 y barra cobalto de 4 px debajo */
	.barra-enlace.actual {
		font-weight: 600;
	}

	/* Una sola barra para todos los links: se desliza y cambia de ancho al cambiar de sección */
	.barra-indicador {
		position: absolute;
		left: 0;
		bottom: 4px;
		height: 4px;
		border-radius: var(--radius-pill);
		background: var(--color-cobalto);
		opacity: 0;
		pointer-events: none;
	}

	.barra-indicador.visible {
		opacity: 1;
	}

	.barra-indicador.animado {
		transition:
			transform 0.35s cubic-bezier(0.3, 0.7, 0.2, 1),
			width 0.35s cubic-bezier(0.3, 0.7, 0.2, 1),
			opacity 0.2s ease;
	}

	/* Lugar fijo del botón: mismo ancho y alto con o sin botón (sin saltos de la barra) */
	.barra-cta {
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		/* Ancho del botón (≈219 px): reservarlo de más descentraría los links en desktop chico */
		min-width: 224px;
		min-height: var(--tap-min);
	}

	/* 44 px de alto, como los links: la barra mide lo mismo que sin botón */
	.barra-cta :global(.barra-cta-boton) {
		height: var(--tap-min);
		/* Menos aire a la izquierda: el carrete ya ocupa ese lugar */
		padding-left: 12px;
		animation: aparecer 0.15s ease-out;
	}

	@keyframes aparecer {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.barra-cta :global(.barra-cta-boton),
		.barra-movil :global(.barra-pildora) {
			animation: none;
		}

		.barra-indicador.animado {
			transition: none;
		}

		.barra-menu-rayas span {
			transition: none;
		}
	}

	/* Misma celda que .barra-cta: en desktop está vacía, en el teléfono reemplaza al botón */
	.barra-movil {
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Píldora y botón de menú: solo en el teléfono */
	.barra-movil :global(.barra-pildora),
	.barra-menu {
		display: none;
	}

	/* Botón redondo de menú con tres rayas dibujadas con CSS (cruz cuando está abierto) */
	.barra-menu {
		align-items: center;
		justify-content: center;
		width: var(--tap-min);
		height: var(--tap-min);
		padding: 0;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-blanco);
		cursor: pointer;
	}

	.barra-menu-rayas {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.barra-menu-rayas span {
		width: 18px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-tinta);
		transition: transform 0.15s ease, opacity 0.15s ease;
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(2) {
		opacity: 0;
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	/* Panel del menú: debajo de la barra, ocupa el resto de la pantalla */
	.panel {
		display: none;
		position: fixed;
		top: var(--header-height);
		right: 0;
		bottom: 0;
		left: 0;
		flex-direction: column;
		gap: 20px;
		padding: 16px var(--gutter) 24px;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--color-crema);
	}

	.panel-enlaces {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.panel-enlace {
		display: flex;
		align-items: center;
		min-height: 56px;
		padding: 0 20px;
		border: var(--border);
		border-radius: var(--radius-md);
		background: var(--color-blanco);
		color: var(--color-tinta);
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.panel-enlace:hover {
		color: var(--color-tinta);
	}

	.panel-enlace.actual {
		background: var(--color-mantequilla);
	}

	@media (prefers-reduced-motion: reduce) {
		.panel-enlace {
			transition: none;
		}
	}

	.panel-canales {
		display: flex;
		flex-wrap: wrap;
		gap: 0 24px;
	}

	.panel-canales a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-weight: 600;
	}

	/* Teléfono: solo CSS, sin display en línea que pise la media query */
	@media (max-width: 959px) {
		.barra-logo img {
			width: 96px;
		}

		.barra-menu {
			display: flex;
		}

		/* El panel se muestra solo en el teléfono y solo abierto (sin el atributo hidden) */
		.panel:not([hidden]) {
			display: flex;
		}

		/* Píldora chica "Presupuesto": 44 px de alto para el dedo */
		.barra-movil :global(.barra-pildora) {
			display: inline-flex;
			height: var(--tap-min);
			gap: 8px;
			padding: 0 16px 0 10px;
			font-size: 15px;
			animation: aparecer 0.15s ease-out;
		}

		.barra-centro,
		.barra-enlaces,
		.barra-cta {
			display: none;
		}
	}

	/* Bajo 360 px la píldora pierde el carrete para que entre todo */
	@media (max-width: 359px) {
		.barra-movil :global(.pildora-carrete) {
			display: none;
		}

		.barra-movil :global(.barra-pildora) {
			padding: 0 14px;
		}
	}
</style>
