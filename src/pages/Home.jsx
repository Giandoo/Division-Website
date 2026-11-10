import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../sections/Hero.jsx';
import Statement from '../sections/Statement.jsx';
import Story from '../sections/Story.jsx';
import Year from '../sections/Year.jsx';
import Trailer from '../sections/Trailer.jsx';
import Join from '../sections/Join.jsx';
import Faq from '../sections/Faq.jsx';
import Social from '../sections/Social.jsx';
import Footer from '../components/Footer.jsx';
import Btn from '../components/Btn.jsx';
import { IconDiscord } from '../components/Icons.jsx';
import { links } from '../lib/config.js';
import { useSite } from '../lib/site.js';
import { useScrollTo } from '../lib/smooth.jsx';

// Foto dell'hero, nell'ordine in cui si alternano. `position` sceglie quale parte della foto resta inquadrata.
const HERO_SLIDES = [
  { src: '/assets/img/hero/hero-1.jpg', position: '62% 40%' },
  { src: '/assets/img/media/vicolo.jpg', position: '42% 50%' },
  { src: '/assets/img/media/incendio.jpg', position: '50% 55%' },
  { src: '/assets/img/media/falo.jpg', position: '62% 55%' },
  { src: '/assets/img/media/auto.jpg', position: '40% 55%' },
];

export default function Home() {
  const { hash } = useLocation();
  const { introDone } = useSite();
  const scrollTo = useScrollTo();

  useEffect(() => {
    document.title = 'Division RP';
  }, []);

  // Apertura con un link tipo /#faq o /#storia: aspetta l'ingresso e poi scorre lì.
  useEffect(() => {
    if (!hash || !introDone) return undefined;
    const t = window.setTimeout(() => scrollTo(hash), 1200);
    return () => window.clearTimeout(t);
  }, [hash, introDone, scrollTo]);

  return (
    <>
      <main>
        <Hero word="Division" slides={HERO_SLIDES} />
        <Statement
          caption="Anno 2077"
          parts={[
            { t: 'Division è un server FiveM roleplay ambientato nel 2077.', dim: true },
            { t: 'Crea il tuo personaggio, fai le tue scelte e vivine le conseguenze.' },
          ]}
        >
          <Btn variant="cell" href={links.discord} icon={<IconDiscord />}>
            Unisciti al Discord
          </Btn>
        </Statement>
        <Story />
        <Year />
        <Trailer />
        <Join />
        <Faq />
        <Social />
      </main>
      <Footer />
    </>
  );
}
