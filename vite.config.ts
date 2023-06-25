import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactJsx from 'vite-react-jsx'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import multiInput from 'rollup-plugin-multi-input';

// https://vitejs.dev/config/

export default defineConfig({
  root: path.resolve(__dirname, "src"),
  plugins: [
    react(),
    multiInput(),
    viteStaticCopy({
      targets: [
        {
          src: '../node_modules/onnxruntime-web/dist/*.wasm',
          dest: '.'
        }
      ]
    }),
  ],
  build: {
    assetsInlineLimit: 0,
    outDir: "../docs",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/**/*.html")
    }
  }
})
