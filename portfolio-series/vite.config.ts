import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `${process.env.GITHUB_ACTIONS === 'true' ? '/Tanmay-portfolio' : ''}/netflix/` : '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public/netflix',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
}));
