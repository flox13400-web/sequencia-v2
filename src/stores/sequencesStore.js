import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId, baseEntity, updatedEntity } from '@/utils/ids';

export const useSequencesStore = create(
  persist(
    (set, get) => ({
      sequences: [],

      addSequence: (data) => {
        const sequence = {
          ...baseEntity(),
          id: generateId.sequence(),
          titre: '',
          description: '',
          objectif_verbe_action: '',
          objectif_niveau_action: 1,
          objectif_action: '',
          objectif_competence: '',
          seances_ids: [],
          duree_totale_minutes: 0,
          is_template: false,
          template_categorie: null,
          statut: 'a_consolider',
          qualiopi_score: 0,
          alertes: [],
          ...data,
        };
        set((s) => ({ sequences: [...s.sequences, sequence] }));
        return sequence;
      },

      updateSequence: (id, patch) =>
        set((s) => ({
          sequences: s.sequences.map((sq) =>
            sq.id === id ? { ...sq, ...patch, ...updatedEntity(sq) } : sq
          ),
        })),

      removeSequence: (id) =>
        set((s) => ({ sequences: s.sequences.filter((sq) => sq.id !== id) })),

      addSeanceToSequence: (sequenceId, seanceId) =>
        set((s) => ({
          sequences: s.sequences.map((sq) => {
            if (sq.id !== sequenceId) return sq;
            if (sq.seances_ids.includes(seanceId)) return sq;
            return {
              ...sq,
              seances_ids: [...sq.seances_ids, seanceId],
              ...updatedEntity(sq),
            };
          }),
        })),

      removeSeanceFromSequence: (sequenceId, seanceId) =>
        set((s) => ({
          sequences: s.sequences.map((sq) => {
            if (sq.id !== sequenceId) return sq;
            return {
              ...sq,
              seances_ids: sq.seances_ids.filter((id) => id !== seanceId),
              ...updatedEntity(sq),
            };
          }),
        })),

      reorderSeances: (sequenceId, orderedSeanceIds) =>
        set((s) => ({
          sequences: s.sequences.map((sq) => {
            if (sq.id !== sequenceId) return sq;
            return { ...sq, seances_ids: orderedSeanceIds, ...updatedEntity(sq) };
          }),
        })),

      getSequenceById: (id) => get().sequences.find((sq) => sq.id === id),

      getSequencesByIds: (ids) => get().sequences.filter((sq) => ids.includes(sq.id)),
    }),
    {
      name: 'sequencia.sequences',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
