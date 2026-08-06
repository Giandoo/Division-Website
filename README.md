# Division — sito v2

Landing single-screen per il server FiveM **Division** (fantasy roleplay).
HTML + CSS + JS puro: nessuna build, nessuna dipendenza, nessun `npm install`.

## Avviare in locale

Basta aprire `index.html` nel browser. Per far funzionare lo status live
(le richieste `fetch` sono bloccate su `file://`) serve un mini server:

```bash
npx serve .
# oppure
python -m http.server 8080
```

## Collegare il tuo server

Apri [`assets/js/config.js`](assets/js/config.js) e compila:

```js
server: {
  cfxCode: "ab12cd",   // dal link https://cfx.re/join/ab12cd
  maxSlots: 300
},
links: {
  discord: "https://discord.gg/iltuoinvito"
}
```

Il `cfxCode` è il metodo consigliato: funziona in HTTPS e non espone l'IP.
In alternativa puoi valorizzare `host` + `port`, ma se il sito è servito in
HTTPS e il server risponde in HTTP il browser blocca la richiesta
(*mixed content*) e lo status resta su "offline".

Da quel codice vengono generati automaticamente:
- il conteggio giocatori live nella barra in basso (aggiornato ogni 60s);
- il link `fivem://connect/...` su tutti i pulsanti "Gioca ora" / "Inizia il viaggio";
- il link del pulsante **Discord** in navbar, menu mobile e footer (`links.discord`)
  — resta nascosto finché non lo compili con un invito vero.

## Immagini

Vedi [`assets/img/LEGGIMI.md`](assets/img/LEGGIMI.md). Il sito è già
presentabile senza: ogni slot ha un gradient di fallback sotto.

## Struttura

```
index.html              markup e testi delle slide
assets/css/style.css    tutto lo stile (variabili in :root)
assets/js/config.js     ← l'unico file da compilare
assets/js/main.js       slider, status live, modale, menu
assets/img/             immagini (vedi LEGGIMI.md)
```

## Personalizzare

- **Colori**: le variabili sono in cima a `style.css`, blocco `:root`.
- **Testi**: direttamente in `index.html`, dentro le `<section class="slide">`.
- **Slide**: duplica un `.bg` e la sua `<section class="slide">` — lo slider
  conta le slide presenti e si adatta.

## Note

- Slider: frecce, frecce tastiera, swipe touch, autoplay 8s (pausa su
  interazione), loop in entrambe le direzioni.
- Rispetta `prefers-reduced-motion`: animazioni e parallasse disattivate.
- Testato responsive fino a 360px; sotto i 1024px le card scorrono
  orizzontalmente con snap.
