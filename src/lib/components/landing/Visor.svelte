<script lang="ts">
	/**
	 * Visor 3D (#visor), BUILD.md sección 08
	 *
	 * No está en el menú; se llega desde "Ver tu modelo en 3D" (Tres caminos).
	 * Layout: desktop texto + ejemplos a la izquierda y visor a la derecha;
	 * 960 a 1199 px todo en una columna (texto, ejemplos, visor);
	 * teléfono texto, visor y después los ejemplos.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Ejemplos from './visor/Ejemplos.svelte';
	import Marco from './visor/Marco.svelte';
	import { viewerState } from '$lib/stores/viewerState';
	import type { EjemploId } from '$lib/config/visorEjemplos';

	function elegirEjemplo(id: EjemploId) {
		viewerState.abrirEjemplo(id);
	}

	function abrirArchivo(file: File) {
		viewerState.abrirArchivo(file);
	}
</script>

<Section id="visor" contentClass="">
	<div class="visor">
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
	}
</style>
