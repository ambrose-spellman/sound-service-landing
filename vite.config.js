import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        modal1: resolve(__dirname, 'modal1.html'),
        modal2: resolve(__dirname, 'modal2.html'),
      },
    },
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true,
    // assetsDir: 'assets',
  },
  publicDir: 'public',
  base: '/sound-service-landing/',
 
});