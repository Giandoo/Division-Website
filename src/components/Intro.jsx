import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE, EASE_IO } from '../lib/motion.js';

// Prima visita della sessione: contatore 000 → 100 legato al caricamento reale,
// poi il sipario si apre in due e parte l'ingresso dell'hero.
export default function Intro({ onDone }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    try {
      sessionStorage.setItem('div-intro', '1');
    } catch {
      /* storage non disponibile: l'intro si ripeterà, va bene */
    }
    window.scrollTo(0, 0);

    let loaded = document.readyState === 'complete';
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    const start = performance.now();
    let shown = 0;
    let frame;
    let timer;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 2000);
      const eased = 1 - Math.pow(1 - p, 3);
      shown = Math.max(shown, Math.min(eased, loaded ? 1 : 0.9));
      setCount(Math.round(shown * 100));
      if (shown >= 1 || now - start > 4800) {
        setCount(100);
        timer = window.setTimeout(() => doneRef.current(), 450);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <motion.div className="intro" aria-hidden="true" exit={{ opacity: 0.999, transition: { duration: 1.25 } }}>
      <motion.div
        className="intro__panel intro__panel--t"
        exit={{ y: '-101%', transition: { duration: 1.15, ease: EASE_IO } }}
      />
      <motion.div
        className="intro__panel intro__panel--b"
        exit={{ y: '101%', transition: { duration: 1.15, ease: EASE_IO } }}
      />
      <motion.div
        className="intro__core"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.45, ease: EASE } }}
      >
        <img className="intro__logo" src="/assets/img/logo.png" alt="" width="72" height="72" />
        <div className="intro__count">{String(count).padStart(3, '0')}</div>
        <div className="intro__bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
