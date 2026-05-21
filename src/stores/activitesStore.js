import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId, baseEntity, updatedEntity } from '@/utils/ids';

export const useActivitesStore = create(
  persist(
    (set, get) => ({
      activites: [],

      addActivite: (data) => {
        const activite = {
          ...baseEntity(),
          id: generateId.activite(),
          titre: '',
          description_courte: '',
          description: '',
          apprentissage_cle: '',
          age_public: [],
          duree: '',
          duree_detail: '',
          duree_minutes: 0,
          taille_groupe: [],
          themes: [],
          materiels: [],
          contexte: [],
          modalite: [],
          type_fiche: 'Activite_Apprentissage',
          sous_type_evaluation: null,
          verbe_action: '',
          niveau_action: 1,
          opo_activite: '',
          eval_modalite: '',
          eval_conditions: '',
          eval_criteres: '',
          grille_criteree: null,
          problematique: null,
          remediation: null,
          methode_pedagogique: null,
          psh_adaptations: { visuel: { possible: false, commentaire: '' }, auditif: { possible: false, commentaire: '' }, moteur: { possible: false, commentaire: '' }, cognitif: { possible: false, commentaire: '' } },
          statut: 'a_consolider',
          qualiopi_score: 0,
          tags: [],
          notes_perso: '',
          liens_externes: [],
          origine: 'custom',
          ...data,
        };
        set((s) => ({ activites: [...s.activites, activite] }));
        return activite;
      },

      updateActivite: (id, patch) =>
        set((s) => ({
          activites: s.activites.map((a) =>
            a.id === id ? { ...a, ...patch, ...updatedEntity(a) } : a
          ),
        })),

      removeActivite: (id) =>
        set((s) => ({ activites: s.activites.filter((a) => a.id !== id) })),

      getActiviteById: (id) => get().activites.find((a) => a.id === id),

      getActivitesByIds: (ids) =>
        get().activites.filter((a) => ids.includes(a.id)),
    }),
    {
      name: 'sequencia.activites',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
