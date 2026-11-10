import { useState } from 'react';
import { motion } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import { TRAILER } from '../data/content.js';
import { EASE, EASE_IO } from '../lib/motion.js';

/**
 * Trailer: all'inizio una copertina in bicromia rossa si apre da un cerchio; il
 * video di YouTube viene caricato solo quando premi play (pagina più leggera,
 * niente cookie di terze parti prima del click).
 */
export default function Trailer() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="trailer" id="trailer">
      <div className="trailer__head">
        <SplitText as="h2" className="trailer__title t-head" parts={[{ t: 'Guarda il', dim: true }, { t: 'trailer.' }]} />
      </div>

      <div className="cols4">
        <motion.div
          className="trailer__frame"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          whileInView={{ clipPath: 'circle(80% at 50% 50%)' }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.8, ease: EASE_IO }}
        >
          {playing ? (
            <iframe
              className="trailer__video"
              src={`https://www.youtube-nocookie.com/embed/${TRAILER.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={TRAILER.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className="trailer__poster" onClick={() => setPlaying(true)} aria-label={`Riproduci: ${TRAILER.title}`}>
              <img
                src={`https://i.ytimg.com/vi/${TRAILER.id}/sddefault.jpg`}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="trailer__duo" aria-hidden="true" />
              <span className="trailer__shade" aria-hidden="true" />
              <span className="trailer__play" aria-hidden="true">
                <i />
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              <span className="trailer__label">{TRAILER.title}</span>
            </button>
          )}
          <span className="trailer__corner trailer__corner--tl" aria-hidden="true" />
          <span className="trailer__corner trailer__corner--br" aria-hidden="true" />
        </motion.div>
      </div>

      <motion.div
        className="trailer__hatch hatch"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: EASE }}
      />
    </section>
  );
}
