import { motion } from 'framer-motion';
import { EASE } from '../lib/motion.js';

const C = 500;
const RED = '#e8333f';

const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const seg = (r1, r2, deg) => {
  const [x1, y1] = polar(r1, deg);
  const [x2, y2] = polar(r2, deg);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

// 120 tacche, una ogni 3°, più lunghe ogni 30°.
const TICKS = Array.from({ length: 120 }, (_, i) => seg(i % 10 === 0 ? 432 : 452, 466, i * 3)).join('');
// Quattro segni ai punti cardinali.
const MARKS = [0, 90, 180, 270].map((d) => seg(344, 374, d)).join('');

/**
 * Quadrante HUD: un punto si accende al centro e si apre in un cerchio, poi
 * compaiono le tacche e gli archi che ruotano lenti.
 * tone="light" su fondo nero, tone="dark" su fondo rosso.
 */
export default function Dial({ play = true, tone = 'light', className = '' }) {
  const ink = tone === 'dark' ? '10, 10, 10' : '255, 255, 255';
  const accent = tone === 'dark' ? '#0a0a0a' : RED;
  const fade = (delay, duration = 1.4) => ({
    initial: { opacity: 0 },
    animate: play ? { opacity: 1 } : { opacity: 0 },
    transition: { duration, delay },
  });

  return (
    <svg className={`dial ${className}`.trim()} viewBox="0 0 1000 1000" aria-hidden="true">
      {/* il punto che si accende e sparisce mentre il cerchio si apre */}
      <motion.circle
        cx={C}
        cy={C}
        fill={accent}
        initial={{ r: 0, opacity: 0 }}
        animate={play ? { r: [0, 9, 9, 0], opacity: [0, 1, 1, 0] } : { r: 0, opacity: 0 }}
        transition={{ duration: 1.5, times: [0, 0.2, 0.5, 1], ease: 'easeInOut' }}
      />
      <motion.circle
        cx={C}
        cy={C}
        fill="none"
        stroke={`rgba(${ink}, 0.4)`}
        strokeWidth="1.2"
        initial={{ r: 9, opacity: 0 }}
        animate={play ? { r: 330, opacity: 1 } : { r: 9, opacity: 0 }}
        transition={{ r: { duration: 1.8, ease: EASE, delay: 0.7 }, opacity: { duration: 0.2, delay: 0.7 } }}
      />

      <motion.g {...fade(1.3)}>
        <g className="dial__spin dial__spin--slow">
          <path d={TICKS} fill="none" stroke={`rgba(${ink}, 0.3)`} strokeWidth="1.4" />
        </g>
      </motion.g>

      <motion.g {...fade(1.6)}>
        <g className="dial__spin">
          <circle cx={C} cy={C} r="400" fill="none" stroke={accent} strokeWidth="2.2" strokeDasharray="300 960 40 1213" />
        </g>
        <g className="dial__spin dial__spin--rev">
          <circle cx={C} cy={C} r="300" fill="none" stroke={`rgba(${ink}, 0.22)`} strokeWidth="1" strokeDasharray="2 10" />
        </g>
        <path d={MARKS} fill="none" stroke={accent} strokeWidth="2" />
      </motion.g>
    </svg>
  );
}
