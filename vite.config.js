import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Discord, WhatsApp e gli altri social vogliono l'indirizzo completo dell'immagine
// di anteprima (og:image). Lo ricaviamo dal dominio del sito: su Vercel è automatico
// (dominio di produzione), altrimenti si può impostare SITE_URL, ad es. https://divisionroleplay.it
function siteUrl() {
  const explicit = process.env.SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const raw = explicit || (vercel ? `https://${vercel}` : '');
  return raw.replace(/\/+$/, '');
}

// In locale fa quello che fa Vercel: esegue api/anonimo.js su /api/anonimo.
function localApi(mode) {
  return {
    name: 'local-api',
    configureServer(server) {
      const { DISCORD_WEBHOOK_URL } = loadEnv(mode, process.cwd(), 'DISCORD_');
      if (DISCORD_WEBHOOK_URL) process.env.DISCORD_WEBHOOK_URL = DISCORD_WEBHOOK_URL;
      server.middlewares.use('/api/anonimo', async (req, res) => {
        const mod = await server.ssrLoadModule('/api/anonimo.js');
        await mod.default(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    localApi(mode),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl()),
    },
  ],
}));
