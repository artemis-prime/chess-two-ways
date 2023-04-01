import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: [
      {find: '~', replacement: path.resolve(__dirname, 'src')},
      {find: 'assets', replacement: path.resolve(__dirname, '../../assets')},
    ]
  },
  server: {
    port: 8080,
  }
})

