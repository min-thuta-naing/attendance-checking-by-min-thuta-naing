import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
   server: {
    host: "0.0.0.0",  //to allow http://93.127.128.243:5173  access via VPS IP also
     port: 5173,
  },
})
