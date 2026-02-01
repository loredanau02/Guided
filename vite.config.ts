import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // Use IPv4 localhost instead of IPv6
    port: 8000, // Using port 8000 since it works on your system
    strictPort: false, // Try next port if 8000 is busy
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
