import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/<REPO>/',        // IMPORTANT for GitHub Pages when it's a project page
  plugins: [react()],
})
