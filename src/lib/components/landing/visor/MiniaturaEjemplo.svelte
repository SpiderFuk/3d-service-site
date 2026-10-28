<script lang="ts">
	/**
	 * Miniatura de cada ejemplo del visor (static/images/visor/<id>.webp, 240 × 240)
	 *
	 * Son renders de los STL de static/models/ (el cuadro, de agus-ine.stl).
	 * Decorativa: el nombre del ejemplo va en el botón.
	 */
	import type { EjemploId } from '$lib/config/visorEjemplos';

	let { id }: { id: EjemploId } = $props();
</script>

<img src="/images/visor/{id}.webp" alt="" width="240" height="240" loading="lazy" />

<style>
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
