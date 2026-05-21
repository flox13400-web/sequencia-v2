import { useState, useEffect } from 'react';
import { useActivitesStore } from '@/stores/activitesStore';
import { useProgrammesStore } from '@/stores/programmesStore';
import { getDB } from '@/db/indexedDB';

/**
 * Détecte le premier lancement (base vide + flag onboarding_done = false).
 * Retourne un booléen `showOnboarding` et une fonction pour marquer comme fait.
 */
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);

  const activitesCount = useActivitesStore((s) => s.activites.length);
  const programmesCount = useProgrammesStore((s) => s.programmes.length);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const db = await getDB();
        const settings = await db.get('settings', 'settings_global');
        if (cancelled) return;

        const alreadyDone = settings?.onboarding_done === true;
        const isEmpty = activitesCount === 0 && programmesCount === 0;

        setShowOnboarding(!alreadyDone && isEmpty);
      } catch {
        // DB pas encore prête — on ne montre pas l'onboarding
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    // On attend que les stores Zustand soient hydratés (~50 ms)
    const timer = setTimeout(check, 80);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activitesCount, programmesCount]);

  const dismissOnboarding = async () => {
    setShowOnboarding(false);
    try {
      const db = await getDB();
      const settings = await db.get('settings', 'settings_global');
      await db.put('settings', { ...settings, onboarding_done: true });
    } catch {
      // Non bloquant
    }
  };

  return { showOnboarding, dismissOnboarding, ready };
}
