import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE } from '../lib/motion.js';

/**
 * Titolo che sale parola per parola da dietro una maschera.
 * `parts`: [{ t: 'testo', dim: true }] per i titoli bicolore grigio/bianco.
 * "\n" nel testo va a capo.
 */
export default function SplitText({
  text,
  parts,
  as: Tag = 'h2',
  className,
  delay = 0,
  stagger = 0.045,
  trigger = 'inView',
  active = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const go = (trigger === 'inView' ? inView : true) && active;
  const segments = parts || [{ t: text }];
  const label = segments.map((s) => s.t.replace(/\n/g, ' ')).join(' ');

  let index = 0;
  const nodes = [];
  segments.forEach((seg, si) => {
    if (si > 0 && !seg.t.startsWith('\n')) nodes.push(' ');
    seg.t.split(/(\n|[ \t]+)/).forEach((token, ti) => {
      if (!token) return;
      const key = `${si}-${ti}`;
      if (token === '\n') {
        nodes.push(<br key={key} />);
        return;
      }
      if (/^[ \t]+$/.test(token)) {
        nodes.push(' ');
        return;
      }
      const i = index;
      index += 1;
      nodes.push(
        <span key={key} className={`sx${seg.dim ? ' is-dim' : ''}`}>
          <motion.span
            className="sx__i"
            initial={{ y: '115%', rotate: 5 }}
            animate={go ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 5 }}
            transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
          >
            {token}
          </motion.span>
        </span>
      );
    });
  });

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{nodes}</span>
    </Tag>
  );
}
