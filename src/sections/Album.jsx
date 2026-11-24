import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import Btn from '../components/Btn.jsx';
import photos from '../data/album.json';
import { useLenis } from '../lib/smooth.jsx';
import { EASE, EASE_IO, pad3 } from '../lib/motion.js';

const STEP = 16; // quante foto in più compaiono a ogni "Mostra altre"
const thumb = (p) => `/assets/img/album/${p.id}-t.jpg`;
const full = (p) => `/assets/img/album/${p.id}.jpg`;

// 4 colonne sul computer, 2 sul telefono (come la griglia del resto del sito).
function useColumns() {
  const [n, setN] = useState(() => (typeof window !== 'undefined' && window.innerWidth <= 900 ? 2 : 4));
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => setN(mq.matches ? 2 : 4);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return n;
}

// Mette ogni foto nella colonna più bassa: le colonne restano pari e, aggiungendo
// altre foto, quelle già visibili non si spostano.
function layout(items, cols) {
  const heights = Array(cols).fill(0);
  const out = Array.from({ length: cols }, () => []);
  items.forEach((p, i) => {
    const c = heights.indexOf(Math.min(...heights));
    out[c].push({ p, i });
    heights[c] += p.h / p.w;
  });
  return out;
}

function Tile({ photo, index, onOpen }) {
  return (
    <motion.button
      type="button"
      className="album__tile"
      style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
      onClick={() => onOpen(index)}
      aria-label={`Apri la foto ${index + 1} di ${photos.length}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.2, ease: EASE_IO }}
    >
      <img src={thumb(photo)} alt="" loading="lazy" decoding="async" width={photo.w} height={photo.h} />
      <span className="album__duo" aria-hidden="true" />
      <span className="album__num" aria-hidden="true">
        {pad3(index + 1)}
      </span>
    </motion.button>
  );
}

function Lightbox({ index, dir, onClose, onGo }) {
  const photo = photos[index];

  // frecce, Esc e foto vicine già pronte
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onGo(1);
      if (e.key === 'ArrowLeft') onGo(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onGo]);

  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const p = photos[(i + photos.length) % photos.length];
      new Image().src = full(p);
    });
  }, [index]);

  return (
    <motion.div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Album foto"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.9, ease: EASE_IO }}
      onClick={onClose}
    >
      <div className="lb__stage" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.figure
            key={photo.id}
            className="lb__fig"
            custom={dir}
            variants={{
              enter: (d) => ({ opacity: 0, x: d * 60 }),
              show: { opacity: 1, x: 0 },
              leave: (d) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
            transition={{ duration: 0.55, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) onGo(1);
              else if (info.offset.x > 70) onGo(-1);
            }}
          >
            <img src={full(photo)} alt="" draggable="false" />
            <span className="lb__duo" aria-hidden="true" />
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="lb__bar" onClick={(e) => e.stopPropagation()}>
        <span className="lb__count">
          {pad3(index + 1)} <i>/</i> {pad3(photos.length)}
        </span>
        <div className="lb__nav">
          <button type="button" className="lb__btn" onClick={() => onGo(-1)} aria-label="Foto precedente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="lb__btn" onClick={() => onGo(1)} aria-label="Foto successiva">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <button type="button" className="lb__close" onClick={onClose} aria-label="Chiudi">
        <span aria-hidden="true" />
      </button>
    </motion.div>
  );
}

/**
 * Album fotografico: griglia a colonne con le foto in bicromia rossa (all'hover il
 * rosso si schiarisce piano), "Mostra altre" per non caricarle tutte insieme e foto
 * grande con frecce, tastiera e swipe. Le foto si gestiscono con `npm run album`.
 */
export default function Album() {
  const lenis = useLenis();
  const cols = useColumns();
  const [shown, setShown] = useState(STEP);
  const [open, setOpen] = useState(null);
  const [dir, setDir] = useState(1);

  const columns = useMemo(() => layout(photos.slice(0, shown), cols), [shown, cols]);

  const openAt = useCallback((i) => {
    setDir(1);
    setOpen(i);
  }, []);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d) => {
    setDir(d);
    setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length));
  }, []);

  // con la foto aperta la pagina dietro non scorre
  useEffect(() => {
    if (open === null) return undefined;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  if (!photos.length) return null;

  return (
    <section className="album" id="galleria">
      <div className="album__head">
        <SplitText as="h2" className="album__title t-head" parts={[{ t: 'Il nostro', dim: true }, { t: 'album.' }]} />
      </div>

      <div className="album__grid">
        {columns.map((col, c) => (
          <div className="album__col" key={c}>
            {col.map(({ p, i }) => (
              <Tile key={p.id} photo={p} index={i} onOpen={openAt} />
            ))}
          </div>
        ))}
      </div>

      {shown < photos.length && (
        <div className="album__more">
          <Btn variant="cell" onClick={() => setShown((n) => n + STEP)}>
            Mostra altre foto
          </Btn>
        </div>
      )}

      <AnimatePresence>{open !== null && <Lightbox key="lb" index={open} dir={dir} onClose={close} onGo={go} />}</AnimatePresence>
    </section>
  );
}
