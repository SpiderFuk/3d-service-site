<script lang="ts">
	/**
	 * Pie de página. Placeholder: el contenido se construye en el track
	 * rebrand-faq-contact-footer.
	 */
	const anio = new Date().getFullYear();
</script>

<footer class="mx-auto flex max-w-page flex-col gap-9 px-gutter pb-10 pt-[72px] max-desk:gap-4 max-desk:py-8">
	<a href="#inicio" aria-label="printo, volver al inicio" class="block w-[68%] max-desk:w-[60%]">
		<img src="/brand/printo-wordmark-cobalto.svg" alt="" class="block h-auto w-full" />
	</a>
	<p class="m-0 text-sm text-tinta-suave">© {anio} printo · Montevideo y Las Piedras, Uruguay</p>
</footer>
