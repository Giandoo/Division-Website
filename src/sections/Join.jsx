import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Btn from '../components/Btn.jsx';
import SplitText from '../components/SplitText.jsx';
import { IconArrowUpRight, IconDiscord } from '../components/Icons.jsx';
import { connectUrl, externalProps, links } from '../lib/config.js';
import { EASE, pad3 } from '../lib/motion.js';

const STEPS = [
  { title: 'Installa GTA V e FiveM', text: 'Ti serve una copia originale di GTA V. FiveM è gratuito.', href: 'https://fivem.net' },
  { title: 'Entra nel Discord', text: 'Leggi le regole e la procedura di accesso.', href: links.discord },
  { title: 'Premi Gioca ora', text: 'Si apre FiveM già puntato sul nostro server.', href: connectUrl() },
];

/** Tre passaggi per entrare, sopra una foto del gioco in bicromia rossa con parallasse. */
export default function Join({ image = '/assets/img/media/falo.jpg' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  return (
    <section ref={ref} className="join" id="entra">
      <motion.img className="join__bg" src={image} alt="" loading="lazy" decoding="async" style={{ y }} />
      <div className="join__duo" aria-hidden="true" />
      <div className="join__shade" aria-hidden="true" />

      <div className="join__inner">
        <SplitText
          as="h2"
          className="join__title t-head"
          parts={[{ t: 'Tre passaggi', dim: true }, { t: '\ne sei dentro.' }]}
        />

        <div className="cols4 join__steps">
          {STEPS.map((s, i) => (
            <motion.a
              key={s.title}
              href={s.href}
              {...externalProps(s.href)}
              className="join__step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.1, ease: EASE, delay: i * 0.12 }}
            >
              <span className="t-idx">{pad3(i + 1)}</span>
              <span className="join__step-title">{s.title}</span>
              <span className="join__step-text">{s.text}</span>
              <span className="join__step-arrow" aria-hidden="true">
                <IconArrowUpRight />
              </span>
            </motion.a>
          ))}
          <motion.div
            className="join__cta"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.36 }}
          >
            <Btn variant="red" href={connectUrl()}>
              Gioca ora
            </Btn>
            <Btn variant="cell" href={links.discord} icon={<IconDiscord />}>
              Discord
            </Btn>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
