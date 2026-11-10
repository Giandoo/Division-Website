import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import Arcs from '../components/Arcs.jsx';
import Dial from '../components/Dial.jsx';
import SplitText from '../components/SplitText.jsx';
import { clamp } from '../lib/motion.js';

const TARGET = 2077;
// Le foto che scorrono dentro il cerchio mentre l'anno corre.
const SHOTS = ['vicolo', 'incendio', 'auto'];
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Sezione "fissata": mentre scorri l'anno corre da oggi al 2077 e, dietro al
 * numero, si apre un cerchio con le foto del gioco in bicromia rossa che si
 * susseguono. Poi il cerchio si allarga fino a riempire lo schermo.
 */
export default function Year() {
  const ref = useRef(null);
  const win = useRef(null);
  const scene = useRef(null);
  const ring = useRef(null);
  const head = useRef(null);
  const digits = useRef([]);
  const shots = useRef([]);
  const from = useRef(Math.min(new Date().getFullYear(), TARGET));
  const [phase, setPhase] = useState(0); // 0 spento · 1 in corsa · 2 arrivato
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const update = useCallback((p) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const R = vw < 900 ? Math.min(vw * 0.42, vh * 0.3) : Math.min(vw * 0.26, vh * 0.34);
    const full = Math.hypot(vw, vh) / 2 + 8;
    const open = easeOut(clamp((p - 0.05) / 0.4, 0, 1));
    const grow = easeInOut(clamp((p - 0.6) / 0.32, 0, 1));
    const r = R * open + (full - R) * grow;

    if (win.current) {
      win.current.style.clipPath = `circle(${r.toFixed(1)}px at 50% 50%)`;
      win.current.style.visibility = r < 0.5 ? 'hidden' : 'visible';
    }
    if (scene.current) scene.current.style.transform = `scale(${(1.32 - 0.2 * open - 0.12 * grow).toFixed(3)})`;
    if (ring.current) {
      const size = (R + 22) * 2;
      ring.current.style.width = `${size}px`;
      ring.current.style.height = `${size}px`;
      ring.current.style.opacity = String(1 - grow);
    }
    if (head.current) head.current.style.opacity = String(1 - grow);

    // dissolvenza tra le foto: una dopo l'altra lungo lo scroll
    const pos = clamp((p - 0.05) / 0.85, 0, 1) * (SHOTS.length - 1);
    shots.current.forEach((el, i) => {
      if (el) el.style.opacity = String(clamp(1 - Math.abs(pos - i), 0, 1));
    });

    const k = easeInOut(clamp((p - 0.05) / 0.45, 0, 1));
    const year = String(Math.round(from.current + (TARGET - from.current) * k));
    digits.current.forEach((el, i) => {
      if (el && el.textContent !== year[i]) el.textContent = year[i];
    });

    const next = Number(year) >= TARGET ? 2 : open > 0.02 ? 1 : 0;
    setPhase((cur) => (cur === next ? cur : next));
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', update);

  useEffect(() => {
    update(scrollYProgress.get());
    const onResize = () => update(scrollYProgress.get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [update, scrollYProgress]);

  return (
    <section ref={ref} className="year" id="anno">
      <div className="year__stage">
        <div className="year__arcs">
          <Arcs rings={[0.36, 0.55, 0.78, 0.99]} />
        </div>

        <div className="year__head" ref={head}>
          <SplitText as="h2" className="year__title t-head" parts={[{ t: 'Avanti', dim: true }, { t: 'veloce.' }]} />
        </div>

        <div className="year__win" ref={win}>
          <div className="year__scene" ref={scene}>
            {SHOTS.map((name, i) => (
              <img
                key={name}
                ref={(el) => {
                  shots.current[i] = el;
                }}
                className="year__shot"
                src={`/assets/img/media/${name}.jpg`}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ))}
            <div className="year__field" />
            <div className="year__dial">
              <Dial tone="dark" />
            </div>
          </div>
          <div className="year__shade" aria-hidden="true" />
        </div>

        <span className="year__ring" ref={ring} aria-hidden="true" />

        <p className={`year__num${phase > 0 ? ' is-on' : ''}${phase > 1 ? ' is-final' : ''}`}>
          <span className="sr-only">Anno {TARGET}</span>
          <span aria-hidden="true">
            {String(from.current)
              .split('')
              .map((c, i) => (
                <span
                  key={i}
                  className="year__digit"
                  ref={(el) => {
                    digits.current[i] = el;
                  }}
                >
                  {c}
                </span>
              ))}
          </span>
        </p>

        <span className="year__caret" aria-hidden="true" />
      </div>
    </section>
  );
}
