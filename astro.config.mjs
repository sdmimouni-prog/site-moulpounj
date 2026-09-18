import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  output: 'static',
  site: 'https://site-moulpounj.vercel.app',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Prebundle the lazy map dependency before pages request it.
    optimizeDeps: { include: ['leaflet'] },
  },
  server: { host: '127.0.0.1', port: 4325 },
});
