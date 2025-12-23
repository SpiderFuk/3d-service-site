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
 * Obtiene la sección activa según el scroll
 */
export function getActiveSection(sections: string[]): string | null {
	const scrollPosition = window.scrollY + window.innerHeight / 3;

	for (const sectionId of sections) {
		const element = document.getElementById(sectionId);
		if (element) {
			const { offsetTop, offsetHeight } = element;
			if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
				return sectionId;
			}
		}
	}

	return null;
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
