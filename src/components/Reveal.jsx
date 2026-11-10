import { motion } from 'framer-motion';
import { EASE } from '../lib/motion.js';

// Comparsa morbida (sale e si mette a fuoco) quando entra nello schermo.
export default function Reveal({ as = 'div', delay = 0, y = 26, className, children, ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
