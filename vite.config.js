import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE_URL } from './src/config.js'

// https://vite.dev/config/
export default defineConfig({
  base: BASE_URL,
  plugins: [react()],
})
