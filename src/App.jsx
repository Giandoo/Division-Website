import { useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SmoothScroll, useLenis } from './lib/smooth.jsx';
import { SiteContext } from './lib/site.js';
import { RESPECT_REDUCED_MOTION, prefersReduced } from './lib/motion.js';
import Intro from './components/Intro.jsx';
import Nav from './components/Nav.jsx';
import GridLines from './components/GridLines.jsx';
import Curtain from './components/Curtain.jsx';
import Home from './pages/Home.jsx';

const isHomePath = (p) => p === '/' || p === '/index.html';

function needsIntro(pathname) {
  if (!isHomePath(pathname) || prefersReduced()) return false;
  try {
    return !sessionStorage.getItem('div-intro');
  } catch {
    return true;
  }
}

function Pages() {
  const location = useLocation();
  const lenis = useLenis();

  const resetScroll = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  };

  // Il sito ha una sola pagina: qualsiasi altro indirizzo (anche le vecchie pagine) torna alla home.
  if (!isHomePath(location.pathname)) return <Navigate to="/" replace />;

  // Per aggiungere una pagina: una <Route> in più e una `key` diversa per pagina,
  // così il sipario fa la transizione tra l'una e l'altra.
  return (
    <AnimatePresence mode="wait" onExitComplete={resetScroll}>
      <motion.div
        key="home"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.999, transition: { duration: 0.75 } }}
      >
        <Routes location={location}>
          <Route path="*" element={<Home />} />
        </Routes>
        <Curtain />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();
  const [introDone, setIntroDone] = useState(() => !needsIntro(location.pathname));
  const site = useMemo(() => ({ introDone }), [introDone]);

  return (
    <MotionConfig reducedMotion={RESPECT_REDUCED_MOTION ? 'user' : 'never'}>
      <SmoothScroll paused={!introDone}>
        <SiteContext.Provider value={site}>
          <GridLines />
          <Nav />
          <Pages />
          <AnimatePresence>
            {!introDone && <Intro key="intro" onDone={() => setIntroDone(true)} />}
          </AnimatePresence>
        </SiteContext.Provider>
      </SmoothScroll>
    </MotionConfig>
  );
}
