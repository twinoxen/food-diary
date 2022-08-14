import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa'
import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'Food Diary',
    short_name: 'Food Diary',
    theme_color: '#e9edde',
    icons: [
      {
        src: 'icon-small.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-big.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'icon-big.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: true,
    navigateFallback: 'index.html',
  },
}

export default defineConfig({
  plugins: [solidPlugin(), VitePWA(pwaOptions),],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
