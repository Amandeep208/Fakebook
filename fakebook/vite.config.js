import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,      // or '0.0.0.0'
    port: 5173       // Optional: choose your desired port
  }
})
