import { useEffect, useState } from 'react';

/**
 * Attend que l'hydratation Zustand soit terminée avant de rendre.
 * Évite le flash de contenu incorrect au premier rendu.
 *
 * @param {import('zustand').StoreApi} store - Store Zustand avec persist
 * @returns {boolean} true quand le store est hydraté
 */
export function useStoreHydrated(store) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = store.persist?.onFinishHydration(() => {
      setHydrated(true);
    });

    // Si déjà hydraté
    if (store.persist?.hasHydrated()) {
      setHydrated(true);
    }

    return () => unsubscribe?.();
  }, [store]);

  return hydrated;
}
