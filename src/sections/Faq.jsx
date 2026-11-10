import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import Reveal from '../components/Reveal.jsx';
import Btn from '../components/Btn.jsx';
import { IconDiscord } from '../components/Icons.jsx';
import { FAQ } from '../data/content.js';
import { links } from '../lib/config.js';
import { EASE, EASE_IO, pad3 } from '../lib/motion.js';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="cols4">
        <div className="faq__head">
          <SplitText as="h2" className="faq__title t-head" parts={[{ t: 'Domande', dim: true }, { t: '\nfrequenti' }]} />
          <Reveal as="p" className="faq__note" delay={0.2}>
            Non trovi la risposta? Apri un ticket nel canale supporto del Discord: lo staff ti risponde lì.
          </Reveal>
          <Reveal delay={0.32}>
            <Btn variant="cell" href={links.discord} icon={<IconDiscord />}>
              Apri un ticket
            </Btn>
          </Reveal>
        </div>

        <div className="faq__list">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                className={`faq__item${isOpen ? ' is-open' : ''}`}
                initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                transition={{ duration: 1.1, ease: EASE_IO, delay: i * 0.07 }}
              >
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="faq__idx">{pad3(i + 1)}</span>
                  <span className="faq__qt">{f.q}</span>
                  <span className="faq__plus" aria-hidden="true">
                    <i />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__a"
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.7, ease: EASE_IO }}
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                      >
                        {f.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
