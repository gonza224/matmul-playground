import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Specify the development server port
    port: 3001,
  },
  // Base name of your app
  base: "/", // Replace this with the subdirectory path if needed
})
