<script lang="ts">
	/**
	 * Visor 3D (#visor), BUILD.md sección 08
	 *
	 * No está en el menú; se llega desde "Ver tu modelo en 3D" (Tres caminos).
	 * Layout: desktop texto + ejemplos a la izquierda y visor a la derecha;
	 * 960 a 1199 px todo en una columna (texto, ejemplos, visor);
	 * teléfono texto, visor y después los ejemplos.
	 */
	import { onMount, tick } from 'svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Ejemplos from './visor/Ejemplos.svelte';
	import Marco from './visor/Marco.svelte';
	import { viewerState, type OrigenModelo, type TipoError } from '$lib/stores/viewerState';
	import type { EjemploId } from '$lib/config/visorEjemplos';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	type Runtime = typeof import('$lib/three/viewerRuntime');

	let seccion: HTMLDivElement;
	let runtime: Promise<Runtime> | null = null;

	/**
	 * Baja el chunk de Three.js una sola vez. Lo dispara la cercanía a la sección
	 * o, si la persona elige algo antes, la propia carga. Si falla la red, se
	 * vuelve a intentar en el próximo pedido.
	 */
	function cargarRuntime(): Promise<Runtime> {
		runtime ??= import('$lib/three/viewerRuntime').catch((error) => {
			runtime = null;
			throw error;
		});
		return runtime;
	}

	// Carga diferida: cuando la sección está a 600 px de la pantalla
	onMount(() => {
		if (!('IntersectionObserver' in window)) return;
		const observador = new IntersectionObserver(
			(entradas) => {
				if (entradas.some((e) => e.isIntersecting)) {
					observador.disconnect();
					cargarRuntime().catch(() => {});
				}
			},
			{ rootMargin: '600px 0px' }
		);
		observador.observe(seccion);
		return () => observador.disconnect();
	});

	function elegirEjemplo(id: EjemploId) {
		viewerState.abrirEjemplo(id);
	}

	function abrirArchivo(file: File) {
		viewerState.abrirArchivo(file);
	}

	/** "Probar otro": vuelve al estado vacío y deja el foco en "Elegir archivo" */
	async function probarOtro() {
		viewerState.reiniciar();
		await tick();
		document.getElementById('visor-elegir')?.focus();
	}

	// Solo en desarrollo: forzar cada estado desde la consola para revisarlo a mano
	// (__visor.cargando('pieza.stl', 55), __visor.error('tamano'), __visor.vacio()…)
	onMount(() => {
		if (!import.meta.env.DEV) return;
		const w = window as unknown as Record<string, unknown>;
		w.__visor = {
			vacio: () => viewerState.reiniciar(),
			cargando: (nombre = 'soporte-auriculares.stl', pct = 55) =>
				viewerState.forzar({
					vista: { fase: 'loading', nombre, pct, origen: 'archivo', carga: -1 },
					ejemplo: null
				}),
			cargado: (nombre = 'soporte-auriculares.stl', origen: OrigenModelo = 'archivo') =>
				viewerState.forzar({
					vista: { fase: 'loaded', nombre, origen, carga: -1 },
					ejemplo: null
				}),
			error: (tipo: TipoError = 'tipo') =>
				viewerState.forzar({ vista: { fase: 'error', tipo }, ejemplo: null })
		};
		return () => {
			delete w.__visor;
		};
	});
</script>

<Section id="visor" contentClass="">
	<div class="visor" bind:this={seccion}>
		<div class="vtext">
			<SectionHeading
				id="visor-titulo"
				eyebrow="Visor 3D"
				primera="Antes de imprimirla,"
				segunda="dale una vuelta."
			/>
			<p class="vlinea">
				Abrí tu STL o 3MF acá y giralo para verlo por todos lados. No se sube a ningún lado hasta
				que nos lo mandes.
			</p>
		</div>

		<div class="vexw">
			<p class="vex-intro">¿No tenés un archivo a mano? Probá con uno de estos:</p>
			<Ejemplos seleccionado={$viewerState.ejemplo} onelegir={elegirEjemplo} />
		</div>

		<div class="vstage">
			<Marco vista={$viewerState.vista} onarchivo={abrirArchivo} />

			{#if $viewerState.vista.fase === 'error'}
				<div class="vactions">
					{#if $viewerState.vista.tipo === 'tamano'}
						<Button href={whatsappUrl(mensajes.visorArchivoGrande)}>Mandar por WhatsApp</Button>
					{/if}
					<Button variant="plain" onclick={probarOtro}>Probar otro</Button>
				</div>
			{/if}
		</div>
	</div>
</Section>

<style>
	.visor {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		grid-template-areas:
			't s'
			'e s';
		column-gap: 64px;
		row-gap: 28px;
	}

	.vtext,
	.vexw,
	.vstage {
		min-width: 0;
	}

	.vtext {
		grid-area: t;
		align-self: end;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.vlinea {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}

	.vexw {
		grid-area: e;
		align-self: start;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.vex-intro {
		margin: 0;
		font-weight: 600;
	}

	/* Deja lugar a la extrusión del marco (abajo y a la derecha) */
	.vstage {
		grid-area: s;
		align-self: center;
		padding: 0 20px 20px 0;
	}

	/* Acciones debajo del marco (pasan la extrusión) */
	.vactions {
		margin-top: 36px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	/* Desktop chico: texto y ejemplos arriba, visor abajo */
	@media (min-width: 960px) and (max-width: 1199px) {
		.visor {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				't'
				'e'
				's';
			row-gap: 24px;
		}

		.vstage {
			margin-top: 12px;
		}
	}

	/* Teléfono: texto, visor y después los ejemplos */
	@media (max-width: 959px) {
		.visor {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				't'
				's'
				'e';
			row-gap: 16px;
		}

		.vtext {
			gap: 12px;
		}

		.vstage {
			padding: 0 12px 12px 0;
		}

		/* Botones a todo el ancho, uno debajo del otro */
		.vactions {
			margin-top: 20px;
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
		}
	}
</style>
