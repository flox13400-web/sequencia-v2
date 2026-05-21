import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId, baseEntity, updatedEntity } from '@/utils/ids';

export const useSeancesStore = create(
  persist(
    (set, get) => ({
      seances: [],

      addSeance: (data) => {
        const seance = {
          ...baseEntity(),
          id: generateId.seance(),
          titre: '',
          description: '',
          opo_verbe_action: '',
          opo_niveau_action: 1,
          opo_type: 'Savoir',
          opo_phrase: '',
          fiches: [],
          duree_totale_minutes: 0,
          is_template: false,
          template_categorie: null,
          statut: 'a_consolider',
          qualiopi_score: 0,
          alertes: [],
          position_journee: null,
          methodes_repartition: {},
          alerte_3070: null,
          ...data,
        };
        set((s) => ({ seances: [...s.seances, seance] }));
        return seance;
      },

      updateSeance: (id, patch) =>
        set((s) => ({
          seances: s.seances.map((s2) =>
            s2.id === id ? { ...s2, ...patch, ...updatedEntity(s2) } : s2
          ),
        })),

      removeSeance: (id) =>
        set((s) => ({ seances: s.seances.filter((s2) => s2.id !== id) })),

      addFicheToSeance: (seanceId, fiche) =>
        set((s) => ({
          seances: s.seances.map((seance) => {
            if (seance.id !== seanceId) return seance;
            const newFiche = { id: generateId.fiche(), ordre: seance.fiches.length, ...fiche };
            const fiches = [...seance.fiches, newFiche];
            const duree_totale_minutes = fiches.reduce(
              (sum, f) => sum + (f.override_duree_minutes ?? 0),
              0
            );
            return { ...seance, fiches, duree_totale_minutes, ...updatedEntity(seance) };
          }),
        })),

      removeFicheFromSeance: (seanceId, ficheId) =>
        set((s) => ({
          seances: s.seances.map((seance) => {
            if (seance.id !== seanceId) return seance;
            const fiches = seance.fiches
              .filter((f) => f.id !== ficheId)
              .map((f, i) => ({ ...f, ordre: i }));
            return { ...seance, fiches, ...updatedEntity(seance) };
          }),
        })),

      reorderFiches: (seanceId, orderedFicheIds) =>
        set((s) => ({
          seances: s.seances.map((seance) => {
            if (seance.id !== seanceId) return seance;
            const ficheMap = new Map(seance.fiches.map((f) => [f.id, f]));
            const fiches = orderedFicheIds
              .filter((id) => ficheMap.has(id))
              .map((id, i) => ({ ...ficheMap.get(id), ordre: i }));
            return { ...seance, fiches, ...updatedEntity(seance) };
          }),
        })),

      getSeanceById: (id) => get().seances.find((s) => s.id === id),

      getSeancesByIds: (ids) => get().seances.filter((s) => ids.includes(s.id)),
    }),
    {
      name: 'sequencia.seances',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
