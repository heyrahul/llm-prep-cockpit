import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Must match the GitHub repo name so assets resolve under
// https://<user>.github.io/<REPO_NAME>/
const REPO_NAME = 'llm-prep-cockpit';

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
});
