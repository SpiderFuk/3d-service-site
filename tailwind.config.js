/**
 * Tema de Tailwind: lee los tokens de src/lib/styles/tokens.css (no definir colores acá).
 *
 * Breakpoints (BUILD.md): teléfono hasta 959 px, desktop chico 960 a 1199 px, desktop 1200 px+.
 * Se mantienen como min-width simples para que Tailwind genere también las variantes max-*:
 *   max-desk:        teléfono (< 960 px)
 *   desk:max-wide:   desktop chico (960 a 1199 px)
 *   wide:            desktop (≥ 1200 px)
 *   max-xs:          teléfonos chicos (< 360 px)
 */

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				xs: '360px',
				desk: '960px',
				wide: '1200px'
			},
			colors: {
				cobalto: 'var(--color-cobalto)',
				tomate: 'var(--color-tomate)',
				mantequilla: 'var(--color-mantequilla)',
				menta: 'var(--color-menta)',
				crema: 'var(--color-crema)',
				blanco: 'var(--color-blanco)',
				tinta: {
					DEFAULT: 'var(--color-tinta)',
					suave: 'var(--color-tinta-suave)'
				}
			},
			fontFamily: {
				display: 'var(--font-display)',
				sans: 'var(--font-sans)'
			},
			borderRadius: {
				chip: 'var(--radius-md)',
				card: 'var(--radius-lg)',
				tile: 'var(--radius-xl)',
				pill: 'var(--radius-pill)'
			},
			borderWidth: {
				DEFAULT: 'var(--border-width)'
			},
			// Todos los bordes son tinta (preflight usa este valor por defecto)
			borderColor: {
				DEFAULT: 'var(--color-tinta)'
			},
			boxShadow: {
				extrude: 'var(--shadow-extrude)',
				'extrude-md': 'var(--shadow-extrude-md)',
				'extrude-sm': 'var(--shadow-extrude-sm)'
			},
			spacing: {
				gutter: 'var(--gutter)',
				section: 'var(--section-pad-y)',
				tap: 'var(--tap-min)'
			},
			maxWidth: {
				page: 'var(--page-max)'
			},
			scrollMargin: {
				nav: 'var(--scroll-offset)'
			}
		}
	},
	plugins: []
};
