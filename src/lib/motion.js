export const EASE = [0.16, 1, 0.3, 1];
export const EASE_IO = [0.77, 0, 0.18, 1];

// Se true, chi ha "riduci animazioni" attivo nel sistema operativo (su Windows:
// Impostazioni → Accessibilità → Effetti visivi → Effetti di animazione = Off)
// vede il sito senza intro, senza scroll fluido e con animazioni ridotte.
// È false perché il sito è pensato attorno alle animazioni: mettilo a true
// se preferisci dare priorità a quella preferenza di accessibilità.
export const RESPECT_REDUCED_MOTION = false;

export const prefersReduced = () =>
  RESPECT_REDUCED_MOTION &&
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const pad3 = (n) => String(n).padStart(3, '0');
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
