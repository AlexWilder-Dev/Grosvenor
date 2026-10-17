import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative, so the build works at whatever path Pages serves the repo from.
  base: './',
  plugins: [react()],
})
