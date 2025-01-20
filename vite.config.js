import { defineConfig } from "vite";
import { resolve } from 'path';
import {viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        modal1: resolve(__dirname, 'modal1.html'),
        modal2: resolve(__dirname, 'modal2.html'),
      },
      output:{
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true,
    // assetsDir: 'assets',
  },
  publicDir: 'public',
  base: './',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'CNAME', dest: '' } // Adjust the path if CNAME is in a different location
      ],
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Transform link and script tags to use relative paths
        return html
          .replace(/(href|src)="\//g, '$1=".')
          .replace(/(href|src)="\.\/assets/g, '$1="assets');
      }
    }
  ]
});
