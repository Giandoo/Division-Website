import { motion } from 'framer-motion';
import { EASE_IO } from '../lib/motion.js';

// Cerchi concentrici sottili che si disegnano, più due anelli tratteggiati che ruotano lenti.
export default function Arcs({ className = '', play = true, rings = [0.42, 0.62, 0.84, 0.99] }) {
  return (
    <svg className={`arcs ${className}`} viewBox="0 0 1000 1000" aria-hidden="true">
      {rings.map((r, i) => (
        <motion.circle
          key={r}
          cx="500"
          cy="500"
          r={r * 500}
          fill="none"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth="1.2"
          style={{ rotate: -90 + i * 40 }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.8, ease: EASE_IO, delay: 0.25 + i * 0.22 }}
        />
      ))}
      <motion.g
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2, delay: 1.4 }}
      >
        <g className="arcs__spin">
          <circle
            cx="500"
            cy="500"
            r={rings[1] * 500 + 16}
            fill="none"
            stroke="rgba(232,51,63,0.5)"
            strokeWidth="1.2"
            strokeDasharray="2 14"
          />
        </g>
        <g className="arcs__spin arcs__spin--rev">
          <circle
            cx="500"
            cy="500"
            r={rings[2] * 500 - 18}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            strokeDasharray="70 34 4 34"
          />
        </g>
      </motion.g>
    </svg>
  );
}
