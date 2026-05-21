import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId } from '@/utils/ids';

export const useFavorisStore = create(
  persist(
    (set, get) => ({
      favoris: [],

      addFavori: (entity_type, entity_id) => {
        if (get().isFavori(entity_type, entity_id)) return;
        const favori = {
          id: generateId.favori(),
          entity_type,
          entity_id,
          added_at: new Date().toISOString(),
        };
        set((s) => ({ favoris: [...s.favoris, favori] }));
      },

      removeFavori: (entity_type, entity_id) =>
        set((s) => ({
          favoris: s.favoris.filter(
            (f) => !(f.entity_type === entity_type && f.entity_id === entity_id)
          ),
        })),

      toggleFavori: (entity_type, entity_id) => {
        if (get().isFavori(entity_type, entity_id)) {
          get().removeFavori(entity_type, entity_id);
        } else {
          get().addFavori(entity_type, entity_id);
        }
      },

      isFavori: (entity_type, entity_id) =>
        get().favoris.some(
          (f) => f.entity_type === entity_type && f.entity_id === entity_id
        ),

      getFavorisIds: (entity_type) =>
        get().favoris.filter((f) => f.entity_type === entity_type).map((f) => f.entity_id),
    }),
    {
      name: 'sequencia.favoris',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
