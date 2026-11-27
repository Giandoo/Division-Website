import { createHash, randomBytes } from 'node:crypto';

// Box anonima: riceve il messaggio dal sito e lo inoltra al webhook Discord.
// Il webhook sta nella variabile d'ambiente DISCORD_WEBHOOK_URL: non arriva mai al browser.
// A Discord va SOLO il testo: niente IP, niente browser, niente altri dati di chi scrive.

const MIN = 3;
const MAX = 1500;
const LIMIT = 3; // messaggi consentiti...
const WINDOW = 10 * 60 * 1000; // ...ogni 10 minuti

// Anti-spam solo in memoria: l'IP è trasformato con una chiave casuale, non viene salvato né inviato.
// Su Vercel la memoria non è condivisa tra le istanze, quindi il limite è indicativo.
const salt = randomBytes(16).toString('hex');
const hits = new Map();

function tooMany(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  const key = createHash('sha256').update(salt + ip).digest('hex');
  const now = Date.now();
  for (const [k, times] of hits) if (now - times[times.length - 1] > WINDOW) hits.delete(k);
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return true;
  hits.set(key, [...recent, now]);
  return false;
}

async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10000) throw new Error('troppo grande');
  }
  return JSON.parse(raw);
}

function reply(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { error: 'Metodo non consentito.' });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return reply(res, 400, { error: 'Messaggio non valido.' });
  }

  // Campo trappola invisibile: lo compilano solo i bot. Rispondiamo ok senza inviare nulla.
  if (body?.website) return reply(res, 200, { ok: true });

  const text = typeof body?.message === 'string' ? body.message.trim() : '';
  if (text.length < MIN) return reply(res, 400, { error: 'Il messaggio è troppo corto.' });
  if (text.length > MAX) return reply(res, 400, { error: `Massimo ${MAX} caratteri.` });

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return reply(res, 503, { error: 'La box non è ancora collegata. Riprova più tardi.' });

  if (tooMany(req)) return reply(res, 429, { error: 'Hai inviato troppi messaggi. Riprova tra qualche minuto.' });

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Division // Box anonima',
        allowed_mentions: { parse: [] }, // nessun @everyone o ping scritto da chi invia
        embeds: [
          {
            title: 'TRASMISSIONE ANONIMA',
            description: text,
            color: 0xe8333f,
            footer: { text: 'Mittente sconosciuto' },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`Discord ${r.status}`);
  } catch {
    return reply(res, 502, { error: 'Invio non riuscito. Riprova tra poco.' });
  }

  return reply(res, 200, { ok: true });
}
