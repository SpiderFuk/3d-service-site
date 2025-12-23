import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Configuración de Tailwind CSS para patrones geométricos
 * Agregar a tu tailwind.config.ts existente
 */

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Colores del patrón (opcionales, usa los de Tailwind por defecto)
      colors: {
        pattern: {
          bg: '#F8FAFC',
          line: '#CBD5E1',
        },
      },
      // Fondos personalizados con los patrones
      backgroundImage: {
        // Patrón isométrico sutil (el de tu imagen)
        'isometric-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
        
        // Patrón hexagonal
        'hexagon-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 32 L28 40 L28 49 L0 49 L0 40 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.4' opacity='0.4'/%3E%3C/svg%3E")`,
        
        // Patrón de cubos 3D
        'cube-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='69'%3E%3Cpath d='M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z M20 23 L20 46 M0 11.5 L20 23 L40 11.5' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3Cpath d='M20 46 L40 57.5 L40 69 L20 69 L0 69 L0 57.5 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
        
        // Grid triangular
        'triangle-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='28'%3E%3Cpath d='M0 28 L16 0 L32 28 Z M16 28 L32 0' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [
    // Plugin para variantes de intensidad del patrón
    plugin(function ({ addUtilities }) {
      addUtilities({
        // Variantes de intensidad para el patrón isométrico
        '.bg-isometric-light': {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%23E2E8F0' stroke-width='0.4'/%3E%3C/svg%3E")`,
          backgroundColor: '#F8FAFC',
        },
        '.bg-isometric-subtle': {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundColor: '#F8FAFC',
        },
        '.bg-isometric-medium': {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%2394A3B8' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundColor: '#F8FAFC',
        },
        
        // Variantes de tamaño
        '.bg-pattern-sm': {
          backgroundSize: '20px 35px',
        },
        '.bg-pattern-md': {
          backgroundSize: '28px 49px',
        },
        '.bg-pattern-lg': {
          backgroundSize: '40px 70px',
        },
        '.bg-pattern-xl': {
          backgroundSize: '56px 97px',
        },
      });
    }),
  ],
};

export default config;
