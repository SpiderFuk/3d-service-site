<script lang="ts">
	/**
	 * Controles para el visor 3D
	 */

	import { RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-svelte';
	import Button from '../ui/Button.svelte';

	interface Props {
		onReset?: () => void;
		onZoomIn?: () => void;
		onZoomOut?: () => void;
		onFullscreen?: () => void;
	}

	let { onReset, onZoomIn, onZoomOut, onFullscreen }: Props = $props();
</script>

<div class="flex gap-2 bg-white p-2 rounded-lg shadow-md">
	<Button variant="secondary" size="sm" onclick={onReset} title="Resetear vista">
		<RotateCcw size={18} />
	</Button>

	<Button variant="secondary" size="sm" onclick={onZoomIn} title="Acercar">
		<ZoomIn size={18} />
	</Button>

	<Button variant="secondary" size="sm" onclick={onZoomOut} title="Alejar">
		<ZoomOut size={18} />
	</Button>

	<Button variant="secondary" size="sm" onclick={onFullscreen} title="Pantalla completa">
		<Maximize size={18} />
	</Button>
</div>
