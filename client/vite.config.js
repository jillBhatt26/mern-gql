import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.VITE_PORT || 3000;
const BE_URL = process.env.VITE_BE_URL || `http://localhost:${port}/graphql`;

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port,
        proxy: {
            '/graphql': BE_URL
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
});
