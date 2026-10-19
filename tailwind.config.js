/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			// Tokens de marca "Filamento" (ver docs/brand.md y static/brand/brand.css).
			// Se mantienen primary/background/text para que todo el sitio se recolore.
			colors: {
				primary: '#2B3CFF', // cobalto
				whatsapp: '#25D366', // color funcional de WhatsApp
				background: {
					DEFAULT: '#FFF4E0', // crema
					secondary: '#FFFFFF' // blanco
				},
				text: {
					DEFAULT: '#1B1B2F', // tinta
					secondary: '#4A4A63' // tinta suave
				},
				cobalto: '#2B3CFF',
				tomate: '#FF5A47',
				mantequilla: '#FFD84D',
				menta: '#86E3C0',
				crema: '#FFF4E0',
				tinta: {
					DEFAULT: '#1B1B2F',
					suave: '#4A4A63'
				}
			},
			fontFamily: {
				sans: ['Figtree', 'system-ui', 'sans-serif'],
				display: ['"Bricolage Grotesque"', '"Trebuchet MS"', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				brand: '20px',
				'brand-lg': '24px',
				'brand-xl': '28px'
			},
			boxShadow: {
				extrude: 'var(--extrude)'
			}
		}
	},
	plugins: []
};
