import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from 'path'

  
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: [
        // @ts-ignore __dirname is polyfilled by vite
      {find: '~', replacement: path.resolve(__dirname, 'src')},
        // @ts-ignore
      {find: '~assets', replacement: path.resolve(__dirname, '../../assets')},
    ]
  },
  server: {
    port: 8080,
  },
    // https://github.com/sitek94/vite-deploy-demo
  base: '/chess-two-ways/' // for Github pages
})

