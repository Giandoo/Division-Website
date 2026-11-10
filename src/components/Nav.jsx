import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Scramble from './Scramble.jsx';
import Btn from './Btn.jsx';
import AnchorLink from './AnchorLink.jsx';
import { IconDiscord, IconTikTok } from './Icons.jsx';
import { connectUrl, externalProps, links } from '../lib/config.js';
import { useSite } from '../lib/site.js';
import { useLenis } from '../lib/smooth.jsx';
import { EASE, EASE_IO, pad3 } from '../lib/motion.js';

function NavCell({ to, hash, href, idx, label, icon, accent, order }) {
  const [replay, setReplay] = useState(0);
  const { introDone } = useSite();
  const cls = `nav__cell${icon ? ' nav__cell--icon' : ''}${accent ? ' nav__cell--accent' : ''}`;
  const inner = (
    <>
      <span className="nav__idx">{idx}</span>
      {icon ? (
        <>
          <span className="nav__icon">{icon}</span>
          <span className="sr-only">{label}</span>
        </>
      ) : (
        <Scramble
          text={label.toUpperCase()}
          trigger="manual"
          active={introDone}
          delay={1 + order * 0.12}
          replay={replay}
        />
      )}
    </>
  );
  const common = { className: cls, onMouseEnter: () => setReplay((r) => r + 1) };
  if (hash) {
    return (
      <AnchorLink hash={hash} {...common}>
        {inner}
      </AnchorLink>
    );
  }
  if (to) {
    return (
      <Link to={to} {...common}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} {...common} {...externalProps(href)}>
      {inner}
    </a>
  );
}

function MobileMenu({ onClose }) {
  const items = [
    { to: '/', label: 'Home' },
    { hash: '#storia', label: 'Storia' },
    { hash: '#trailer', label: 'Trailer' },
    { hash: '#entra', label: 'Come entrare' },
    { hash: '#faq', label: 'FAQ' },
  ];
  return (
    <motion.div
      className="menu"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.8, ease: EASE_IO }}
    >
      <nav className="menu__list" aria-label="Menu">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.07 }}
          >
            {it.to ? (
              <Link to={it.to} className="menu__link" onClick={onClose}>
                <span className="t-idx">{pad3(i + 1)}</span>
                {it.label}
              </Link>
            ) : (
              <AnchorLink hash={it.hash} className="menu__link" onClick={onClose}>
                <span className="t-idx">{pad3(i + 1)}</span>
                {it.label}
              </AnchorLink>
            )}
          </motion.div>
        ))}
      </nav>
      <motion.div
        className="menu__actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        <Btn variant="red" href={connectUrl()}>
          Gioca ora
        </Btn>
        <Btn variant="cell" href={links.discord} icon={<IconDiscord />}>
          Discord
        </Btn>
      </motion.div>
    </motion.div>
  );
}

export default function Nav() {
  const { introDone } = useSite();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else if (introDone) lenis.start();
  }, [open, lenis, introDone]);

  const cells = [
    { hash: '#storia', idx: '001', label: 'Storia' },
    { href: links.discord, idx: '002', label: 'Discord', icon: <IconDiscord /> },
    { href: links.tiktok, idx: '003', label: 'TikTok', icon: <IconTikTok /> },
    { href: connectUrl(), idx: '004', label: 'Gioca ora', accent: true },
  ].filter((c) => c.to || c.hash || c.href);

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' is-scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.55 }}
      >
        <Link to="/" className="nav__logo" aria-label="Division RP, torna alla home">
          <img src="/assets/img/logo.png" alt="" width="30" height="30" />
        </Link>
        <Link to="/" className="nav__brand" tabIndex={-1} aria-hidden="true">
          <Scramble text="DIVISION" trigger="manual" active={introDone} delay={0.9} duration={1200} />
        </Link>
        <nav className="nav__cells" aria-label="Navigazione principale">
          {cells.map((c, i) => (
            <NavCell key={c.idx} {...c} order={i} />
          ))}
        </nav>
        <button
          type="button"
          className="nav__menu"
          aria-expanded={open}
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__idx">001</span>
          {open ? 'Chiudi' : 'Menu'}
        </button>
      </motion.header>
      <AnimatePresence>{open && <MobileMenu key="menu" onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
