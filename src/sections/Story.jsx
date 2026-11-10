import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import Scramble from '../components/Scramble.jsx';
import Reveal from '../components/Reveal.jsx';
import { STORY } from '../data/content.js';
import { EASE_IO } from '../lib/motion.js';

// Foto del capitolo: si apre dal basso e scorre lenta in parallasse mentre passi.
function Shot({ src, rowRef }) {
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  return (
    <motion.figure
      className="story__shot"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.5, ease: EASE_IO }}
    >
      <motion.img src={src} alt="" loading="lazy" decoding="async" style={{ y }} />
      <span className="story__shot-duo" aria-hidden="true" />
    </motion.figure>
  );
}

function Row({ item }) {
  const ref = useRef(null);
  // "Attiva" la riga che attraversa il centro dello schermo.
  const active = useInView(ref, { margin: '-44% 0px -44% 0px' });
  const cls = [
    'cols4',
    'story__row',
    item.pause ? 'story__row--pause' : '',
    item.live ? 'story__row--live' : '',
    active ? 'is-active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={cls}>
      <motion.span
        className="story__line"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 1.5, ease: EASE_IO }}
      />

      {item.pause ? (
        <motion.div
          className="story__hatch hatch"
          aria-hidden="true"
          initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.4, ease: EASE_IO }}
        />
      ) : (
        <div className="story__mark">
          <span className="t-cap">Wipe</span>
          <Scramble className="story__num" text={`0${item.wipe}`} duration={900} />
        </div>
      )}

      <div className="story__body">
        <SplitText as="h3" className="story__name t-head" text={item.title} />
        <Reveal as="p" className="story__text" delay={0.15}>
          {item.text}
        </Reveal>
      </div>

      <div className="story__side">
        {item.image && <Shot src={item.image} rowRef={ref} />}
        {item.live && (
          <Reveal className="story__live" delay={0.25}>
            <i aria-hidden="true" />
            Capitolo attuale
          </Reveal>
        )}
      </div>
    </div>
  );
}

/**
 * La storia di Division, wipe per wipe. Una linea rossa scende lungo la griglia
 * mentre scorri e la riga al centro dello schermo si accende.
 */
export default function Story() {
  const list = useRef(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 55%', 'end 55%'] });
  const rail = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <section className="story" id="storia">
      <div className="story__head">
        <SplitText
          as="h2"
          className="story__title t-head"
          parts={[{ t: 'Dove siamo', dim: true }, { t: '\npartiti.' }]}
        />
      </div>

      <div className="story__list" ref={list}>
        <motion.span className="story__rail" aria-hidden="true" style={{ scaleY: rail }} />
        {STORY.map((item) => (
          <Row key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
