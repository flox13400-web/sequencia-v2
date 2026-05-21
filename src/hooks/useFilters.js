import { useMemo } from 'react';
import { useFiltresStore } from '@/stores/filtresStore';
import { useActivitesStore } from '@/stores/activitesStore';
import { useFavorisStore } from '@/stores/favorisStore';
import { filterActivites } from '@/utils/filters';

/**
 * Hook qui combine filtresStore + activitesStore + favorisStore
 * et retourne la liste filtrée d'activités.
 *
 * @returns {{ activitesFiltrees: import('../utils/types').Activite[], filtres: object, count: number }}
 */
export function useFilters() {
  const filtres = useFiltresStore((s) => s.filtres);
  const activites = useActivitesStore((s) => s.activites);
  const favorisIds = useFavorisStore((s) => s.getFavorisIds('activite'));

  const activitesFiltrees = useMemo(
    () => filterActivites(activites, filtres, favorisIds),
    [activites, filtres, favorisIds]
  );

  return { activitesFiltrees, filtres, count: activitesFiltrees.length };
}
