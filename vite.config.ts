import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  base: mode === 'production' ? '/dist/' : '/',
  build: {
    outDir: mode === 'production' ? 'laravel/public/dist' : 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/css': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/js': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/livewire': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/ticket': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
      '/vendor': {
        target: 'http://localhost:8000',
        changeOrigin: false,
      },
    },
  },
}))
