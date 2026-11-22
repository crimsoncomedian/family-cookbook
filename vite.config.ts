import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project at /family-cookbook/
// https://vite.dev/config/
export default defineConfig({
  base: '/family-cookbook/',
  plugins: [react()],
})
