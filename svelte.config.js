import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      ƒ: './src/lib/shared/function',
      $assets: './src/assets',
      $backend: './src/backend',
      $components: './src/components',
      $layouts: './src/layouts',
      $lib: './src/lib',
      $middleware: './src/middleware',
      $security: './src/security',
      $styles: './src/styles'
    }
  }
};

export default config;
