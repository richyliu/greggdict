import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Keep the original dictionary files as the source of truth, and copy them
  // into the static asset bundle for both local development and deployment.
  publicDir: path.resolve(projectRoot, '../assets'),
  plugins: [react(), tailwindcss(), cloudflare()],
});
