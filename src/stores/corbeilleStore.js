import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/db/indexedDB';
import { generateId } from '@/utils/ids';

export const useCorbeilleStore = create(
  persist(
    (set, get) => ({
      items: [],

      moveToCorbeille: (type, entity) => {
        const deletedAt = new Date().toISOString();
        const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const item = {
          id: generateId.corbeille(),
          type,
          entity_id: entity.id,
          snapshot: entity,
          deleted_at: deletedAt,
          raison: 'Suppression utilisateur',
          expire_at: expireDate,
        };
        set((s) => ({ items: [...s.items, item] }));
        return item;
      },

      restoreFromCorbeille: (corbeilleId) => {
        const item = get().items.find((i) => i.id === corbeilleId);
        set((s) => ({ items: s.items.filter((i) => i.id !== corbeilleId) }));
        return item ? item.snapshot : null;
      },

      deleteFromCorbeille: (corbeilleId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== corbeilleId) })),

      emptyCorbeille: () => set({ items: [] }),

      getByType: (type) => get().items.filter((i) => i.type === type),
    }),
    {
      name: 'sequencia.corbeille',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
