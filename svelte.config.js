import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Carpeta de salida
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // Importante para SPA
      precompress: false,
      strict: true
    })
  }
};

export default config;