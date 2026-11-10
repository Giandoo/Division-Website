import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Arcs from '../components/Arcs.jsx';
import { useSite } from '../lib/site.js';
import { EASE, EASE_IO } from '../lib/motion.js';

/**
 * Hero a tutto schermo: foto in bicromia rossa che si alternano lentamente con
 * una dissolvenza, cerchi che si disegnano, wordmark che si accende lettera per
 * lettera e si allarga. Allo scroll lo sfondo va in parallasse e il wordmark si allontana.
 * slides: [{ src, position }]
 */
const SLIDE_MS = 6500;

export default function Hero({ word, slides }) {
  const { introDone } = useSite();
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!introDone) return undefined;
    const t = window.setTimeout(() => setGo(true), 320);
    return () => window.clearTimeout(t);
  }, [introDone]);

  // Cambia foto ogni pochi secondi, solo se la scheda è visibile.
  useEffect(() => {
    if (!go || slides.length < 2) return undefined;
    const id = window.setInterval(() => {
      if (!document.hidden) setCurrent((c) => (c + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [go, slides.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const centerY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-35%']);
  const centerScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const arcsRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const letters = Array.from(word.toUpperCase());

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero__bg" style={{ y: bgY, scale: bgScale }}>
        <motion.div
          className="hero__slides"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={go ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 3, ease: EASE }}
        >
          {slides.map((s, i) => (
            <img
              key={s.src}
              className={`hero__slide${i === current ? ' is-on' : ''}`}
              src={s.src}
              alt=""
              decoding="async"
              style={{ objectPosition: s.position, animationDelay: `${-i * 4}s` }}
            />
          ))}
        </motion.div>
      </motion.div>
      <div className="hero__duo" aria-hidden="true" />
      <motion.div
        className="hero__glow"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : {}}
        transition={{ duration: 2.4, delay: 0.6 }}
      />
      <div className="hero__shade" aria-hidden="true" />

      <motion.div className="hero__arcs" style={{ rotate: arcsRotate, x: '-50%', y: '-50%' }}>
        <Arcs play={go} />
      </motion.div>

      <motion.div className="hero__center" style={{ opacity: centerOpacity, y: centerY, scale: centerScale }}>
        <h1 className="hero__word">
          <span className="sr-only">{word}</span>
          <motion.span
            className="hero__letters"
            aria-hidden="true"
            initial={{ letterSpacing: '0.22em' }}
            animate={go ? { letterSpacing: '0.62em' } : {}}
            transition={{ duration: 2.6, ease: EASE, delay: 0.3 }}
          >
            {letters.map((c, i) => {
              const d = 0.45 + i * 0.09;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 34, filter: 'blur(16px)' }}
                  animate={go ? { opacity: [0, 1, 0.15, 1], y: 0, filter: 'blur(0px)' } : {}}
                  transition={{
                    y: { duration: 1.5, ease: EASE, delay: d },
                    filter: { duration: 1.3, ease: EASE, delay: d },
                    opacity: { duration: 1.1, times: [0, 0.35, 0.55, 1], delay: d },
                  }}
                >
                  {c === ' ' ? ' ' : c}
                </motion.span>
              );
            })}
          </motion.span>
        </h1>
        <motion.span
          className="hero__line"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={go ? { scaleX: 1 } : {}}
          transition={{ duration: 1.9, ease: EASE_IO, delay: 1.3 }}
        />
        <motion.span
          className="hero__caret-wrap"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={go ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 2.4 }}
        >
          <span className="hero__caret" />
        </motion.span>
      </motion.div>

      <motion.div
        className="hero__hatch hatch"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={go ? { scaleY: 1 } : {}}
        transition={{ duration: 1.3, ease: EASE_IO, delay: 1.8 }}
      />
    </section>
  );
}
