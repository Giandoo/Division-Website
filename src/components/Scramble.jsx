import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { prefersReduced } from '../lib/motion.js';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/+=<>*';

/**
 * Testo che si "decodifica" da caratteri casuali al testo vero.
 * trigger="inView": parte quando entra nello schermo.
 * trigger="manual": parte quando `active` diventa true.
 * Cambiare `text` o incrementare `replay` la fa ripartire.
 */
export default function Scramble({
  text,
  as: Tag = 'span',
  className,
  trigger = 'inView',
  active = true,
  delay = 0,
  duration,
  replay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -6% 0px' });
  const go = (trigger === 'inView' ? inView : true) && active;
  const [out, setOut] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!go) return undefined;
    if (prefersReduced()) {
      setOut(text);
      setStarted(true);
      return undefined;
    }
    let frame;
    let start;
    const len = text.length;
    const total = duration ?? Math.min(1400, 420 + len * 38);
    const timer = window.setTimeout(() => {
      setStarted(true);
      const step = (now) => {
        if (start === undefined) start = now;
        const p = Math.min(1, (now - start) / total);
        const revealed = Math.floor(p * len);
        let s = '';
        for (let i = 0; i < len; i += 1) {
          const c = text[i];
          s += i < revealed || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
        if (p < 1) frame = requestAnimationFrame(step);
        else setOut(text);
      };
      frame = requestAnimationFrame(step);
    }, delay * 1000);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [go, text, replay, delay, duration]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ opacity: started ? 1 : 0 }}>
        {out}
      </span>
    </Tag>
  );
}
