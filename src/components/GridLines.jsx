import { motion } from 'framer-motion';
import { EASE_IO } from '../lib/motion.js';

// Le linee verticali della griglia, fisse sopra tutta la pagina.
// Le colonne del layout (.cols4) sono allineate a queste linee.
export default function GridLines() {
  return (
    <div className="grid-lines" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className={`gl gl--${i}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.8, ease: EASE_IO, delay: 0.15 + i * 0.09 }}
        />
      ))}
    </div>
  );
}
