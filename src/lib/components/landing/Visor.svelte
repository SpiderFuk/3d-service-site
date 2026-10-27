<script lang="ts">
	/**
	 * Visor 3D (#visor), BUILD.md sección 08
	 *
	 * No está en el menú; se llega desde "Ver tu modelo en 3D" (Tres caminos).
	 * Layout: desktop texto + ejemplos a la izquierda y visor a la derecha;
	 * 960 a 1199 px todo en una columna (texto, ejemplos, visor);
	 * teléfono texto, visor y después los ejemplos.
	 */
	import { onDestroy, onMount, tick } from 'svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Ejemplos from './visor/Ejemplos.svelte';
	import Marco from './visor/Marco.svelte';
	import { viewerState, type OrigenModelo, type TipoError } from '$lib/stores/viewerState';
	import { getEjemplo, type EjemploId } from '$lib/config/visorEjemplos';
	import { asset } from '$app/paths';
	import { descargarConProgreso, leerConProgreso } from '$lib/utils/lecturaConProgreso';
	import type { VisorEscena } from '$lib/three/viewerRuntime';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { mensajesError, nombreMarcoCargado, textoAbriendo } from '$lib/config/visorTextos';

	type Runtime = typeof import('$lib/three/viewerRuntime');

	let seccion: HTMLDivElement;
	let marco = $state<HTMLDivElement>();
	let lienzo = $state<HTMLDivElement>();
	let runtime: Promise<Runtime> | null = null;
	/** Un solo renderer por visor montado; se crea con la primera carga */
	let escena: VisorEscena | null = null;

	/**
	 * Región en vivo (polite): se anuncia una vez por cambio de estado (empieza
	 * a abrir, abierto, error), nunca cada porcentaje. Se vacía antes de escribir
	 * para que un mismo texto dos veces seguidas (el mismo error) se vuelva a leer.
	 */
	let anuncio = $state('');
	async function anunciar(texto: string) {
		anuncio = '';
		await tick();
		anuncio = texto;
	}

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

	// Al desmontar: liberar renderer, contexto WebGL, canvas y escuchas, y volver
	// a vacío (corta cualquier carga en curso; el store sobrevive al componente)
	onDestroy(() => {
		escena?.dispose();
		escena = null;
		viewerState.reiniciar();
	});

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

	/**
	 * Abre un modelo: lee o baja el archivo (con progreso) mientras se baja el
	 * runtime, y después lo muestra. Si mientras tanto la persona eligió otra cosa,
	 * el resultado se descarta. Cualquier falla del loader, de la red o un modelo
	 * vacío termina en "No pudimos abrirlo" (error 'danado').
	 *
	 * obtener devuelve el archivo a abrir, o null para el cuadro provisorio.
	 */
	async function abrir(
		carga: number,
		nombre: string,
		obtener: (avance: (f: number) => void) => Promise<File | null>
	) {
		anunciar(textoAbriendo(nombre));
		const avance = (fraccion: number) => viewerState.progreso(carga, fraccion * 95);
		const pedidoRuntime = cargarRuntime();
		pedidoRuntime.catch(() => {}); // el error se maneja abajo, al esperarlo

		try {
			const archivo = await obtener(avance);
			const rt = await pedidoRuntime;
			if (!viewerState.esActual(carga) || !lienzo) return;

			escena ??= rt.crearVisorEscena({ contenedor: lienzo, teclado: marco });
			escena.limpiar();

			const objeto = archivo ? await rt.cargarModelo(archivo) : rt.crearCuadroProvisorio();
			if (!viewerState.esActual(carga)) {
				rt.liberarObjeto(objeto);
				return;
			}
			escena.mostrar(objeto, { corregirOrientacion: archivo !== null });
			viewerState.progreso(carga, 100);
			viewerState.listo(carga);
			anunciar(nombreMarcoCargado(nombre));
		} catch (error) {
			if (!viewerState.esActual(carga)) return;
			if (import.meta.env.DEV) console.error('Visor 3D:', error);
			escena?.limpiar();
			viewerState.fallo(carga, 'danado');
			anunciar(mensajesError.danado);
		}
	}

	function elegirEjemplo(id: EjemploId) {
		const ejemplo = getEjemplo(id);
		const carga = viewerState.abrirEjemplo(id);
		abrir(carga, ejemplo.nombre, async (avance) => {
			// Sin archivo todavía (Cuadro en relieve): modelo provisorio
			if (!ejemplo.archivo) return null;
			const url = asset(`/models/${ejemplo.archivo}` as Parameters<typeof asset>[0]);
			return descargarConProgreso(url, ejemplo.archivo, avance);
		});
	}

	function abrirArchivo(file: File) {
		// Si el foco estaba en "Elegir archivo" (que desaparece al cambiar de estado),
		// pasa al marco para no perderlo
		if (marco?.contains(document.activeElement)) marco.focus();

		const carga = viewerState.abrirArchivo(file);
		// Tipo o tamaño inválido: no se lee ni se intenta abrir
		if (carga === null) {
			escena?.limpiar();
			const vista = $viewerState.vista;
			if (vista.fase === 'error') anunciar(mensajesError[vista.tipo]);
			return;
		}
		abrir(carga, file.name, async (avance) => {
			await leerConProgreso(file, avance);
			return file;
		});
	}

	/** "Probar otro": vuelve al estado vacío y deja el foco en "Elegir archivo" */
	async function probarOtro() {
		escena?.limpiar();
		viewerState.reiniciar();
		anuncio = '';
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
			<Marco vista={$viewerState.vista} onarchivo={abrirArchivo} bind:marco bind:lienzo />

			{#if $viewerState.vista.fase === 'error'}
				<div class="vactions">
					{#if $viewerState.vista.tipo === 'tamano'}
						<Button href={whatsappUrl(mensajes.visorArchivoGrande)}>Mandar por WhatsApp</Button>
					{/if}
					<Button variant="plain" onclick={probarOtro}>Probar otro</Button>
				</div>
			{/if}

			<p class="sr-only" aria-live="polite">{anuncio}</p>
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
