import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnchorLink from './AnchorLink.jsx';
import Btn from './Btn.jsx';
import { connectUrl, externalProps, links } from '../lib/config.js';
import { EASE } from '../lib/motion.js';

const WORD = 'DIVISION';

export default function Footer() {
  const year = new Date().getFullYear();
  const channels = [
    { label: 'Discord', href: links.discord },
    { label: 'TikTok', href: links.tiktok },
    { label: 'YouTube', href: links.youtube },
  ].filter((c) => c.href);

  return (
    <footer className="footer">
      <div className="cols4 footer__top">
        <div className="footer__col">
          <Link to="/" className="footer__brand" aria-label="Division RP">
            <img src="/assets/img/logo.png" alt="" width="40" height="40" />
          </Link>
          <p className="footer__claim">Roleplay su FiveM, ambientato nel 2077.</p>
        </div>
        <nav className="footer__col" aria-label="Sito">
          <span className="t-idx">001</span>
          <Link to="/">Home</Link>
          <AnchorLink hash="#storia">Storia</AnchorLink>
          <AnchorLink hash="#entra">Come entrare</AnchorLink>
          <AnchorLink hash="#faq">FAQ</AnchorLink>
        </nav>
        <nav className="footer__col" aria-label="Canali">
          <span className="t-idx">002</span>
          {channels.map((c) => (
            <a key={c.label} href={c.href} {...externalProps(c.href)}>
              {c.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <span className="t-idx">003</span>
          <Btn variant="red" href={connectUrl()}>
            Gioca ora
          </Btn>
        </div>
      </div>

      <div className="footer__word" aria-hidden="true">
        {WORD.split('').map((c, i) => (
          <span key={i} className="footer__letter">
            <motion.span
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: EASE, delay: i * 0.07 }}
            >
              {c}
            </motion.span>
          </span>
        ))}
      </div>

      <div className="footer__bottom">
        <p>Division Roleplay è un progetto indipendente e non è affiliato a Rockstar Games o Take-Two Interactive.</p>
        <div className="footer__legal">
          <a href="#">Legal</a>
          <a href="#">Privacy Policy</a>
          <span>© {year} Division Roleplay</span>
        </div>
      </div>

      <a
        className="footer__studio"
        href="https://www.kromostudio.it/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kromo Studio, lo studio di sviluppo (si apre il sito kromostudio.it)"
      >
        <span className="footer__studio-text">Sviluppato da</span>
        <img src="/assets/img/kromo-logo.png" alt="" width="34" height="36" />
        <span className="footer__studio-name">Kromo Studio</span>
      </a>
    </footer>
  );
}
