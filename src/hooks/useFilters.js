import { useMemo } from 'react';
import { useFiltresStore } from '@/stores/filtresStore';
import { useActivitesStore } from '@/stores/activitesStore';
import { useFavorisStore } from '@/stores/favorisStore';
import { filterActivites } from '@/utils/filters';

export function useFilters() {
  const filtres = useFiltresStore((s) => s.filtres);
  const activites = useActivitesStore((s) => s.activites);
  const favoris = useFavorisStore((s) => s.favoris);

  const activitesFiltrees = useMemo(() => {
    const favorisIds = favoris
      .filter((f) => f.entity_type === 'activite')
      .map((f) => f.entity_id);
    return filterActivites(activites, filtres, favorisIds);
  }, [activites, filtres, favoris]);

  return { activitesFiltrees, filtres, count: activitesFiltrees.length };
}
