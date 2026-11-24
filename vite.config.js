import { defineConfig } from 'vite';
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

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl()),
    },
  ],
});
