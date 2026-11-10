import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { prefersReduced } from './motion.js';

const LenisContext = createContext(null);

export function SmoothScroll({ paused = false, children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      frame = requestAnimationFrame(loop);
    });
    setLenis(instance);
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (paused) {
      lenis?.stop();
      root.classList.add('is-locked');
    } else {
      lenis?.start();
      root.classList.remove('is-locked');
    }
  }, [paused, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target, options = {}) => {
      if (target === 0) {
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true, ...options });
        else window.scrollTo(0, 0);
        return;
      }
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.6, ...options });
      else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
    },
    [lenis]
  );
}
