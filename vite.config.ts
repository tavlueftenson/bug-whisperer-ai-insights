
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    'import.meta.env.VITE_BUILD_TIMESTAMP': JSON.stringify(Date.now()),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080
  }
});
