/**
 * Utilidades para scroll y navegación
 */

/**
 * Hace scroll suave a una sección por ID
 */
export function scrollToSection(sectionId: string): void {
	const element = document.getElementById(sectionId);
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
}

/**
 * Franja de detección de la sección actual: una línea al 30 % del alto de la ventana,
 * por debajo de la barra fija (la sección que la cruza es la actual).
 */
const FRANJA_SECCION_ACTUAL = '-30% 0px -69% 0px';

/**
 * Observa las secciones y avisa cuál está en vista (reemplaza el cálculo por scroll).
 *
 * Si ninguna cruza la franja (p. ej. con el pie en vista) se mantiene la última.
 * Devuelve la función que desconecta el observer.
 */
export function observarSeccionActual(
	secciones: HTMLElement[],
	alCambiar: (id: string) => void
): () => void {
	const enFranja = new Set<string>();

	const observer = new IntersectionObserver(
		(entradas) => {
			for (const entrada of entradas) {
				if (entrada.isIntersecting) enFranja.add(entrada.target.id);
				else enFranja.delete(entrada.target.id);
			}

			// En orden del documento, la última que cruza la franja
			const actual = secciones.filter((s) => enFranja.has(s.id)).pop();
			if (actual) alCambiar(actual.id);
		},
		{ rootMargin: FRANJA_SECCION_ACTUAL }
	);

	secciones.forEach((s) => observer.observe(s));
	return () => observer.disconnect();
}

/**
 * Debounce para eventos de scroll
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
