<!--
	Carrete chico de los botones de presupuesto (Hero y barra): anillos tomate,
	mantequilla y menta dibujados con CSS. Decorativo.
-->
<span class="carrete" aria-hidden="true"><span></span><span></span></span>

<style>
	.carrete {
		flex: none;
		position: relative;
		width: 26px;
		height: 26px;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-tomate);
	}

	.carrete span {
		position: absolute;
		inset: 3px;
		border-radius: 50%;
		background: var(--color-mantequilla);
	}

	.carrete span + span {
		inset: 7px;
		background: var(--color-menta);
	}
</style>
