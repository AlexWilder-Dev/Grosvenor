import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/grosvenor-arms-brixton/',
  plugins: [react()],
})
