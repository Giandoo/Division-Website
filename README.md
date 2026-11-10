# Division — sito v2 (React)

Sito del server FiveM **Division**, roleplay ambientato nel 2077, fatto con React + Vite.
Animazioni con framer-motion, scroll fluido con Lenis.

L'immagine dell'hero è `public/assets/img/hero/hero-1.jpg`, mostrata in bicromia
rossa: per cambiarla sostituisci il file (stesso nome) o cambia `image` in
`src/pages/Home.jsx`.

## Avviare in locale

```bash
npm install      # solo la prima volta
npm run dev      # sviluppo con ricarica automatica → http://localhost:5173
npm run build    # build di produzione in dist/
npm run preview  # prova la build → http://localhost:4173
```

## Link e server

Si cambiano in un solo posto: [`public/assets/js/config.js`](public/assets/js/config.js).

- `links.discord`, `links.tiktok`, `links.youtube`: YouTube compare solo se compilato.
- `server.cfxCode` (dal link `https://cfx.re/join/xxxxxx`) attiva il pulsante
  "Gioca ora" che apre FiveM. Finché è vuoto, "Gioca ora" porta al Discord.

## Testi

Storia di Division (wipe 1, 2, 3) e FAQ: [`src/data/content.js`](src/data/content.js).

## Struttura

```
index.html                  entry di Vite (meta, font, config.js)
src/App.jsx                 intro, scroll fluido, sipario
src/pages/Home.jsx          ordine delle sezioni
src/sections/               Hero, Statement, Story (storia), Year (2077), Join, Faq, Social
src/components/             Nav, Footer, Btn, Scramble, SplitText, Arcs, Dial, GridLines, Icons…
src/data/content.js         testi: storia e FAQ
src/styles/global.css       token (colori/font in :root), griglia, nav, pulsanti, footer
src/styles/sections.css     stile delle sezioni
src/lib/motion.js           easing e interruttore RESPECT_REDUCED_MOTION
public/                     file serviti così come sono (logo, immagine hero, config.js)
assets/img/originali/       sorgenti grandi, non pubblicate (ignorate da git)
assets/img/archivio-fantasy/ immagini della vecchia ambientazione, solo archivio locale
```

## Note

- Font: Orbitron (wordmark), Rajdhani (titoli e interfaccia), Poppins (testo).
- Le colonne del layout (`.cols4`) sono allineate alle linee verticali della griglia.
- `RESPECT_REDUCED_MOTION` in `src/lib/motion.js` è `false`: le animazioni partono
  anche se il sistema operativo ha "riduci animazioni" attivo.
- Su Vercel: `vercel.json` imposta build Vite, cartella `dist/` e rimanda ogni
  indirizzo a `index.html` (le vecchie pagine tornano alla home).
