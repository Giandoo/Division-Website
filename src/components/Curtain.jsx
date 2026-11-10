import { motion } from 'framer-motion';
import { EASE_IO } from '../lib/motion.js';

// Sipario delle transizioni tra pagine React: copre all'uscita, si ritira all'ingresso.
export default function Curtain() {
  return (
    <motion.div
      className="curtain"
      aria-hidden="true"
      initial={{ scaleY: 1, originY: 0 }}
      animate={{ scaleY: 0, originY: 0, transition: { duration: 1, ease: EASE_IO, delay: 0.12 } }}
      exit={{
        scaleY: 1,
        originY: 1,
        transition: { scaleY: { duration: 0.7, ease: EASE_IO }, originY: { duration: 0 } },
      }}
    />
  );
}
