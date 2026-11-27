import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import Reveal from '../components/Reveal.jsx';
import photos from '../data/album.json';

const MIN = 3;
const MAX = 1500; // stessi limiti di api/anonimo.js

// Sfondo: tre file di foto dell'album, sfocate, che scorrono lente.
const ROWS = [0, 1, 2].map((r) => photos.filter((_, i) => i % 3 === r).slice(0, 8));

function Backdrop() {
  const ref = useRef(null);
  // Le foto si caricano un po' prima di arrivare alla sezione, tutte insieme;
  // lo scorrimento va in pausa quando la sezione è fuori dallo schermo.
  const near = useInView(ref, { once: true, margin: '1200px 0px' });
  const visible = useInView(ref);
  return (
    <div ref={ref} className={`anon__backdrop${visible ? ' is-playing' : ''}`} aria-hidden="true">
      {ROWS.map((row, r) => (
        <div className="anon__row" key={r}>
          {/* la fila è ripetuta due volte per scorrere senza stacchi */}
          {[...row, ...row].map((p, i) => (
            <img key={i} src={near ? `/assets/img/album/${p.id}-b.jpg` : undefined} alt="" width="480" height="270" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Box anonima: il testo va al webhook Discord dello staff, senza nome né altri dati. */
export default function Anonymous() {
  const [message, setMessage] = useState('');
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const sending = status === 'sending';

  async function submit(e) {
    e.preventDefault();
    if (sending || message.trim().length < MIN) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/anonimo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, website: trap }),
        referrerPolicy: 'no-referrer',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Invio non riuscito. Riprova tra poco.');
      setMessage('');
      setStatus('sent');
    } catch (err) {
      setError(err instanceof TypeError ? 'Connessione assente. Riprova.' : err.message);
      setStatus('error');
    }
  }

  return (
    <section className="anon" id="anonimo">
      <Backdrop />
      <div className="cols4">
        <div className="anon__head">
          <SplitText as="h2" className="anon__title t-head" parts={[{ t: 'Canale', dim: true }, { t: '\nanonimo' }]} />
          <Reveal as="p" className="anon__note" delay={0.2}>
            In questo canale chiunque può esporre un problema, una segnalazione o un suggerimento in modo
            completamente anonimo. Scrivi con sincerità.
          </Reveal>
        </div>

        <Reveal
          className="anon__box"
          delay={0.1}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {status === 'sent' ? (
            <div className="anon__done" role="status">
              <p className="anon__done-title t-head">Messaggio inviato</p>
              <p>Grazie per il tuo contributo.</p>
              <button type="button" className="btn btn--cell" onClick={() => setStatus('idle')}>
                Invia un altro messaggio
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label htmlFor="anon-text" className="anon__label t-cap">Il tuo messaggio</label>
              <textarea
                id="anon-text"
                className="anon__text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Descrivi il problema o la tua proposta…"
                maxLength={MAX}
                rows={8}
                data-lenis-prevent
              />
              <input
                className="anon__trap"
                name="website"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <p className="anon__error" role="alert">{status === 'error' ? error : ''}</p>
              <div className="anon__foot">
                <p className="anon__privacy">Non vengono richiesti né allegati nome, account o contatti.</p>
                <span className="anon__count">{message.length} / {MAX}</span>
                <button type="submit" className="btn btn--red" disabled={sending || message.trim().length < MIN}>
                  {sending ? 'Invio in corso…' : 'Invia'}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
