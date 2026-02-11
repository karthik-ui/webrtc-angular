import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4200,
    allowedHosts: [
        'arline-imbricative-willian.ngrok-free.dev',
      '*' // replace with your actual ngrok hostname
    ]
  }
});