// Pegar dentro de theme.extend en tailwind.config.js.
// Se mantienen los nombres existentes (primary, background, text) para que TODO el sitio
// se recolore de una vez; se agregan los nombres de marca para usar a partir de ahora.
colors: {
  primary: '#2B3CFF',                       // cobalto
  whatsapp: '#25D366',                      // se mantiene (color funcional de WhatsApp)
  background: { DEFAULT: '#FFF4E0', secondary: '#FFFFFF' }, // crema / blanco
  text: { DEFAULT: '#1B1B2F', secondary: '#4A4A63' },        // tinta / tinta suave
  cobalto: '#2B3CFF',
  tomate: '#FF5A47',
  mantequilla: '#FFD84D',
  menta: '#86E3C0',
  crema: '#FFF4E0',
  tinta: '#1B1B2F'
},
fontFamily: {
  sans: ['Figtree', 'system-ui', 'sans-serif'],
  display: ['"Bricolage Grotesque"', '"Trebuchet MS"', 'system-ui', 'sans-serif']
},
borderRadius: { brand: '20px', 'brand-lg': '24px', 'brand-xl': '28px' }
