<script lang="ts">
	/**
	 * Marco del visor: blanco, borde 2 px, radio 24 px y extrusión tomate
	 * (la única de esta vista). 4:3.3 en desktop, 16:9 de 960 a 1199 px, cuadrado en teléfono.
	 *
	 * Estado vacío: área punteada, "Arrastrá tu archivo acá" (oculto en teléfono),
	 * "Elegir archivo" (abre el input de archivo real) y la ayuda de tipos y tamaño.
	 * Se puede soltar un archivo sobre el marco en cualquier estado.
	 */
	import Button from '$lib/components/ui/Button.svelte';
	import { EXTENSIONES_VISOR, type FaseVisor, type TipoError } from '$lib/stores/viewerState';

	interface Props {
		vista: FaseVisor;
		/** Archivo elegido con el input o soltado sobre el marco */
		onarchivo: (file: File) => void;
	}

	let { vista, onarchivo }: Props = $props();

	let marco: HTMLDivElement;
	let input: HTMLInputElement;
	let arrastrando = $state(false);

	const etiqueta = 'Visor 3D. Elegí un archivo o un ejemplo.';

	/** Textos de error (BUILD.md); los botones van debajo del marco */
	const mensajesError: Record<TipoError, string> = {
		tipo: 'Este archivo no lo podemos abrir. Probá con un STL o 3MF.',
		tamano: 'Pesa más de 50 MB. Mandánoslo por WhatsApp y lo vemos.',
		danado: 'No pudimos abrirlo. Puede estar dañado: probá exportarlo de nuevo.'
	};

	function traeArchivos(e: DragEvent): boolean {
		return e.dataTransfer?.types.includes('Files') ?? false;
	}

	function alArrastrarEncima(e: DragEvent) {
		if (!traeArchivos(e)) return;
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
		arrastrando = true;
	}

	function alSalir(e: DragEvent) {
		if (!marco.contains(e.relatedTarget as Node | null)) arrastrando = false;
	}

	function alSoltar(e: DragEvent) {
		if (!traeArchivos(e)) return;
		e.preventDefault();
		arrastrando = false;
		const file = e.dataTransfer?.files[0];
		if (file) onarchivo(file);
	}

	function alElegir() {
		const file = input.files?.[0];
		// Vaciar el input para poder volver a elegir el mismo archivo después de "Probar otro"
		input.value = '';
		if (file) onarchivo(file);
	}
</script>

<!-- El marco es enfocable a propósito (BUILD.md): con el modelo abierto, las flechas lo giran -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={marco}
	class="vframe"
	class:arrastrando
	role="group"
	tabindex="0"
	aria-label={etiqueta}
	ondragenter={alArrastrarEncima}
	ondragover={alArrastrarEncima}
	ondragleave={alSalir}
	ondrop={alSoltar}
>
	{#if vista.fase === 'empty'}
		<div class="vdrop">
			<strong class="vdrag">Arrastrá tu archivo acá</strong>
			<Button id="visor-elegir" onclick={() => input.click()}>Elegir archivo</Button>
			<span class="vayuda">STL o 3MF, hasta 50 MB</span>
		</div>
	{:else if vista.fase === 'loading'}
		<div class="vcargando">
			<span class="vbarra" aria-hidden="true">
				<span class="vbarra-relleno" style:width="{vista.pct}%"></span>
			</span>
			<p class="vcargando-texto">Abriendo {vista.nombre}… {vista.pct}%</p>
		</div>
	{:else if vista.fase === 'error'}
		<div class="vdrop">
			<p class="verror">{mensajesError[vista.tipo]}</p>
		</div>
	{/if}

	<!-- El input real; lo abre "Elegir archivo" -->
	<input
		bind:this={input}
		class="sr-only"
		type="file"
		accept={EXTENSIONES_VISOR.join(',')}
		tabindex="-1"
		aria-hidden="true"
		onchange={alElegir}
	/>
</div>

<style>
	.vframe {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 4 / 3.3;
		overflow: hidden;
		background: var(--color-blanco);
		border: var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-extrude-md);
		/* Solo el gesto horizontal es del visor; el vertical mueve la página */
		touch-action: pan-y;
	}

	.vframe:focus-visible {
		outline-offset: 4px;
	}

	.vdrop {
		position: absolute;
		inset: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px;
		border: 2px dashed var(--color-tinta-suave);
		border-radius: 18px;
		text-align: center;
	}

	.arrastrando .vdrop {
		border-color: var(--color-cobalto);
		background: var(--color-crema);
	}

	.vdrag {
		font-size: 17px;
	}

	.vayuda {
		font-size: 14px;
		color: var(--color-tinta-suave);
	}

	.vcargando {
		width: min(72%, 360px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		text-align: center;
	}

	.vbarra {
		display: block;
		width: 100%;
		height: 16px;
		overflow: hidden;
		background: var(--color-crema);
		border: var(--border);
		border-radius: var(--radius-pill);
	}

	.vbarra-relleno {
		display: block;
		height: 100%;
		background: var(--color-cobalto);
		transition: width 0.15s linear;
	}

	.vcargando-texto,
	.verror {
		margin: 0;
		font-size: 17px;
		font-weight: 600;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.verror {
		max-width: 30ch;
	}

	@media (prefers-reduced-motion: reduce) {
		.vbarra-relleno {
			transition: none;
		}
	}

	@media (min-width: 960px) and (max-width: 1199px) {
		.vframe {
			aspect-ratio: 16 / 9;
		}
	}

	@media (max-width: 959px) {
		.vframe {
			aspect-ratio: 1 / 1;
			border-radius: var(--radius-md);
			box-shadow: var(--shadow-extrude-sm);
		}

		.vdrag {
			display: none;
		}
	}
</style>
