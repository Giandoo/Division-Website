import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Scramble from '../components/Scramble.jsx';
import { EASE } from '../lib/motion.js';

function Word({ children, progress, range, dim }) {
  const color = useTransform(progress, range, ['#34302e', dim ? '#8a8580' : '#f2f0ee']);
  return <motion.span style={{ color }}>{children}</motion.span>;
}

/**
 * Frase grande che si "accende" parola per parola mentre scorri.
 * parts: [{ t, dim }] → le parti dim restano grigie, le altre diventano bianche.
 */
export default function Statement({ caption, parts, children, id }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 55%'] });
  const words = parts.flatMap((p) => p.t.split(' ').map((w) => ({ w, dim: p.dim })));
  const label = parts.map((p) => p.t).join(' ');
  const n = words.length;

  return (
    <section ref={ref} className="statement" id={id}>
      {caption && <Scramble className="t-cap" text={caption.toUpperCase()} />}
      <p className="statement__text">
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">
          {words.map((x, i) => {
            const start = (i / n) * 0.82;
            return (
              <Fragment key={i}>
                <Word progress={scrollYProgress} range={[start, start + 0.18]} dim={x.dim}>
                  {x.w}
                </Word>{' '}
              </Fragment>
            );
          })}
        </span>
      </p>
      {children && (
        <motion.div
          className="statement__actions"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}
