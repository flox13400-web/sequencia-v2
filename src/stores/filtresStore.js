import { create } from 'zustand';
import { emptyFiltres } from '@/utils/filters';

// Store UI non persisté — état local de session uniquement
export const useFiltresStore = create((set) => ({
  filtres: emptyFiltres(),

  setFiltre: (key, value) =>
    set((s) => ({ filtres: { ...s.filtres, [key]: value } })),

  toggleArrayFiltre: (key, value) =>
    set((s) => {
      const current = s.filtres[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { filtres: { ...s.filtres, [key]: next } };
    }),

  resetFiltres: () => set({ filtres: emptyFiltres() }),

  hasActiveFilters: (state) => {
    const f = state.filtres;
    return (
      f.recherche !== '' ||
      f.themes.length > 0 ||
      f.type_fiche.length > 0 ||
      f.niveaux_action.length > 0 ||
      f.modalite.length > 0 ||
      f.contexte.length > 0 ||
      f.taille_groupe.length > 0 ||
      f.favoris_only
    );
  },
}));
