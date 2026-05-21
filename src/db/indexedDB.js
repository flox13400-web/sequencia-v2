import { openDB } from 'idb';

const DB_NAME = 'sequencia_v2';
const DB_VERSION = 1;

/** @type {import('idb').IDBPDatabase | null} */
let dbInstance = null;

/**
 * Ouvre (ou réutilise) la connexion IndexedDB.
 * Crée tous les object stores du schéma V2 complet.
 */
export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // activites
      if (!db.objectStoreNames.contains('activites')) {
        const activites = db.createObjectStore('activites', { keyPath: 'id' });
        activites.createIndex('themes', 'themes', { multiEntry: true });
        activites.createIndex('verbe_action', 'verbe_action');
        activites.createIndex('methode_pedagogique', 'methode_pedagogique');
        activites.createIndex('sous_type_evaluation', 'sous_type_evaluation');
        activites.createIndex('origine', 'origine');
      }

      // seances
      if (!db.objectStoreNames.contains('seances')) {
        const seances = db.createObjectStore('seances', { keyPath: 'id' });
        seances.createIndex('is_template', 'is_template');
        seances.createIndex('statut', 'statut');
      }

      // sequences
      if (!db.objectStoreNames.contains('sequences')) {
        const sequences = db.createObjectStore('sequences', { keyPath: 'id' });
        sequences.createIndex('is_template', 'is_template');
        sequences.createIndex('statut', 'statut');
      }

      // programmes
      if (!db.objectStoreNames.contains('programmes')) {
        const programmes = db.createObjectStore('programmes', { keyPath: 'id' });
        programmes.createIndex('is_template', 'is_template');
        programmes.createIndex('statut', 'statut');
      }

      // journees_planifiees (V2.3 — store créé dès V2.0)
      if (!db.objectStoreNames.contains('journees_planifiees')) {
        const journees = db.createObjectStore('journees_planifiees', { keyPath: 'id' });
        journees.createIndex('programme_id', 'programme_id');
        journees.createIndex('date', 'date');
      }

      // relances_pedagogiques (V2.3)
      if (!db.objectStoreNames.contains('relances_pedagogiques')) {
        const relances = db.createObjectStore('relances_pedagogiques', { keyPath: 'id' });
        relances.createIndex('programme_id', 'programme_id');
        relances.createIndex('date_planifiee', 'date_planifiee');
      }

      // brouillons (V2.4)
      if (!db.objectStoreNames.contains('brouillons')) {
        const brouillons = db.createObjectStore('brouillons', { keyPath: 'id' });
        brouillons.createIndex('updated_at', 'updated_at');
      }

      // settings (singleton)
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }

      // corbeille
      if (!db.objectStoreNames.contains('corbeille')) {
        const corbeille = db.createObjectStore('corbeille', { keyPath: 'id' });
        corbeille.createIndex('type', 'type');
        corbeille.createIndex('deleted_at', 'deleted_at');
      }

      // favoris
      if (!db.objectStoreNames.contains('favoris')) {
        const favoris = db.createObjectStore('favoris', { keyPath: 'id' });
        favoris.createIndex('entity_type', 'entity_type');
        favoris.createIndex('entity_id', 'entity_id');
      }
    },
    blocked() {
      console.warn('IndexedDB bloquée par un autre onglet. Recharger la page.');
    },
    blocking() {
      dbInstance?.close();
      dbInstance = null;
    },
  });

  return dbInstance;
}

/**
 * Storage adapter compatible avec Zustand persist middleware.
 * Persiste chaque store Zustand comme un enregistrement unique dans le store 'settings'.
 */
export const indexedDBStorage = {
  getItem: async (name) => {
    const db = await getDB();
    const record = await db.get('settings', `zustand:${name}`);
    return record ? record.value : null;
  },
  setItem: async (name, value) => {
    const db = await getDB();
    await db.put('settings', { id: `zustand:${name}`, value });
  },
  removeItem: async (name) => {
    const db = await getDB();
    await db.delete('settings', `zustand:${name}`);
  },
};

/**
 * Initialise la DB et s'assure que l'enregistrement settings_global existe.
 */
export async function initDB() {
  const db = await getDB();
  const existing = await db.get('settings', 'settings_global');
  if (!existing) {
    await db.put('settings', {
      id: 'settings_global',
      updated_at: new Date().toISOString(),
      mode_audit_active: false,
      preset_andragogique: 'formation_initiale',
      courbe_attention_personnalisee: null,
      amplifier_creux_post_repas: true,
      amplifier_creux_avant_repas: true,
      reset_attention_apres_pause: true,
      duree_pause_defaut_minutes: 15,
      duree_dejeuner_defaut_minutes: 60,
      public_cible_defaut: '',
      modalite_defaut: 'Présentielle',
      contexte_defaut: 'Entreprise',
      vue_par_defaut: 'arborescence',
      langue: 'fr',
      theme: 'clair',
      schema_version: 'v2.0',
      onboarding_done: false,
    });
  }
  return db;
}
