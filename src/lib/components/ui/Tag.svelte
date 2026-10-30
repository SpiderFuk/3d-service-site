<script lang="ts">
	/**
	 * Etiqueta tipo píldora (tags, chips, "Disponible", "Agotado")
	 */
	import type { Snippet } from 'svelte';

	export type TagColor = 'crema' | 'blanco' | 'mantequilla' | 'menta' | 'tomate';

	interface Props {
		color?: TagColor;
		class?: string;
		children?: Snippet;
	}

	let { color = 'crema', class: className = '', children }: Props = $props();
</script>

<span class="tag {className}" style:background="var(--color-{color})">
	{@render children?.()}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 6px 12px;
		border: var(--border);
		border-radius: var(--radius-pill);
		color: var(--color-tinta);
		font-size: 14px;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
	}
</style>
