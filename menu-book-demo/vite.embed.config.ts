import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@images': path.resolve(__dirname, '../images'),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: '../menu-book-embed',
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/embed.tsx'),
      name: 'BemataMenuBookEmbed',
      formats: ['iife'],
      fileName: () => 'bemata-menu-book',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'bemata-menu-book.js',
        assetFileNames: (assetInfo) => {
          const n = assetInfo.names?.[0] ?? '';
          if (n.endsWith('.css')) return 'bemata-menu-book.css';
          return 'bemata-menu-book-assets/[name]-[hash][extname]';
        },
        inlineDynamicImports: true,
      },
    },
  },
});
