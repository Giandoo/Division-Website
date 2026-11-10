import { createContext, useContext } from 'react';

// introDone: true quando l'intro è finita (o non serve) → partono le animazioni d'ingresso.
export const SiteContext = createContext({ introDone: true });

export const useSite = () => useContext(SiteContext);
