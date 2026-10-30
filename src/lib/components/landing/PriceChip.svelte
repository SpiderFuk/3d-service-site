<script lang="ts">
	/**
	 * Factor de precio de Precio y plazos: título y una línea, fondo crema, radio 20 px
	 * (va dentro de un <ul>)
	 */
	interface Props {
		titulo: string;
		linea: string;
	}

	let { titulo, linea }: Props = $props();
</script>

<li class="chip">
	<strong class="chip-titulo">{titulo}</strong>
	<span class="chip-linea">{linea}</span>
</li>

<style>
	.chip {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 14px;
		border-radius: var(--radius-md);
		background: var(--color-crema);
	}

	.chip-titulo {
		font-size: 16px;
		font-weight: 600;
	}

	.chip-linea {
		font-size: 14px;
		color: var(--color-tinta-suave);
	}

	@media (max-width: 959px) {
		.chip {
			padding: 8px 12px;
		}

		.chip-titulo {
			font-size: 15px;
		}
	}
</style>
