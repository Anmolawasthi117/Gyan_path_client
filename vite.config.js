import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    hmr: false,
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
})
