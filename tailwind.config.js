/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#3B82F6',
				whatsapp: '#25D366',
				background: {
					DEFAULT: '#FFFFFF',
					secondary: '#F8FAFC'
				},
				text: {
					DEFAULT: '#1E293B',
					secondary: '#64748B'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: []
};
