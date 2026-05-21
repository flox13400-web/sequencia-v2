import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId, baseEntity, updatedEntity } from '@/utils/ids';

export const useProgrammesStore = create(
  persist(
    (set, get) => ({
      programmes: [],

      addProgramme: (data) => {
        const programme = {
          ...baseEntity(),
          id: generateId.programme(),
          titre: '',
          description: '',
          duree_objectif_heures: 0,
          objectif_verbe_action: '',
          objectif_niveau_action: 1,
          objectif_action: '',
          objectif_final: '',
          public_cible: '',
          prerequis: '',
          prerequis_traces: [],
          modalite_globale: 'Présentielle',
          contenu_ordonne: [],
          duree_totale_minutes: 0,
          progression_objectif: 0,
          is_template: false,
          statut: 'a_consolider',
          qualiopi_score: 0,
          contexte_qualiopi_active: false,
          alertes: [],
          critere2_prerequis_traces: false,
          critere12_engagement_anchorage: false,
          critere_psh_adaptable: false,
          calendrier: { journees: [], debut_formation: null, fin_formation: null },
          relances_ids: [],
          ...data,
        };
        set((s) => ({ programmes: [...s.programmes, programme] }));
        return programme;
      },

      updateProgramme: (id, patch) =>
        set((s) => ({
          programmes: s.programmes.map((p) =>
            p.id === id ? { ...p, ...patch, ...updatedEntity(p) } : p
          ),
        })),

      removeProgramme: (id) =>
        set((s) => ({ programmes: s.programmes.filter((p) => p.id !== id) })),

      addContenuItem: (programmeId, item) =>
        set((s) => ({
          programmes: s.programmes.map((p) => {
            if (p.id !== programmeId) return p;
            const ordre = p.contenu_ordonne.length;
            return {
              ...p,
              contenu_ordonne: [...p.contenu_ordonne, { ...item, ordre }],
              ...updatedEntity(p),
            };
          }),
        })),

      removeContenuItem: (programmeId, refId) =>
        set((s) => ({
          programmes: s.programmes.map((p) => {
            if (p.id !== programmeId) return p;
            const contenu_ordonne = p.contenu_ordonne
              .filter((item) => item.ref_id !== refId)
              .map((item, i) => ({ ...item, ordre: i }));
            return { ...p, contenu_ordonne, ...updatedEntity(p) };
          }),
        })),

      reorderContenu: (programmeId, orderedRefIds) =>
        set((s) => ({
          programmes: s.programmes.map((p) => {
            if (p.id !== programmeId) return p;
            const itemMap = new Map(p.contenu_ordonne.map((item) => [item.ref_id, item]));
            const contenu_ordonne = orderedRefIds
              .filter((id) => itemMap.has(id))
              .map((id, i) => ({ ...itemMap.get(id), ordre: i }));
            return { ...p, contenu_ordonne, ...updatedEntity(p) };
          }),
        })),

      getProgrammeById: (id) => get().programmes.find((p) => p.id === id),
    }),
    {
      name: 'sequencia.programmes',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
