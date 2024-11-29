import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Certifique-se de que o alias está configurado corretamente
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:32832', // Redireciona as requisições para o back-end
    },
  },
});
