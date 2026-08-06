/* ═══════════════════════════════════════════════════════
   DIVISION — CONFIGURAZIONE
   Questo è l'unico file che devi modificare per collegare
   il tuo server. Non serve rebuildare niente: salva e ricarica.
   ═══════════════════════════════════════════════════════ */

window.DIVISION_CONFIG = {

  /* ─────────── SERVER FIVEM ─────────── */
  server: {

    /* Codice cfx.re — lo trovi nel link di join del tuo server.
       Es: se il link è  https://cfx.re/join/ab12cd  →  metti "ab12cd"
       È il metodo CONSIGLIATO: funziona anche in HTTPS e non espone l'IP. */
    cfxCode: "",

    /* Fallback diretto (opzionale). Usato solo se cfxCode è vuoto
       oppure se la richiesta a cfx.re fallisce.
       ATTENZIONE: se il sito è su HTTPS e il server è su HTTP,
       il browser blocca la richiesta (mixed content). In quel caso
       usa il cfxCode. */
    host: "",
    port: 30120,

    /* Slot totali mostrati finché l'API non risponde. */
    maxSlots: 300,

    /* Ogni quanto riaggiornare il conteggio giocatori (millisecondi). */
    refreshMs: 60000,

    /* Timeout singola richiesta (millisecondi). */
    timeoutMs: 8000
  },


  /* ─────────── LINK ─────────── */
  links: {
    discord: "https://discord.gg/XmrfFVNve",
    youtube: "",
    tiktok:  "https://www.tiktok.com/@divisionrpofficial"
  },


  /* ─────────── SLIDER ─────────── */
  slider: {
    autoplay: true,
    intervalMs: 5000
  }
};
