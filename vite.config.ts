import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Guided/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 8000,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          tiptap: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-highlight', '@tiptap/extension-placeholder'],
          charts: ['recharts'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
