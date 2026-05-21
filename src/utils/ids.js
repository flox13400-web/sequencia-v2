/**
 * Génération d'identifiants UUID v4 préfixés par type métier.
 * Format : <préfixe>_<uuid-v4>
 */

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const generateId = {
  activite: () => `act_${uuidv4()}`,
  seance: () => `sea_${uuidv4()}`,
  sequence: () => `seq_${uuidv4()}`,
  programme: () => `prog_${uuidv4()}`,
  fiche: () => `fic_${uuidv4()}`,
  journee: () => `day_${uuidv4()}`,
  relance: () => `rel_${uuidv4()}`,
  brouillon: () => `bro_${uuidv4()}`,
  corbeille: () => `trash_${uuidv4()}`,
  favori: () => `fav_${uuidv4()}`,
  lien: () => `lien_${uuidv4()}`,
  colonne: () => `col_${uuidv4()}`,
  ligne: () => `lig_${uuidv4()}`,
};

/**
 * Retourne les champs techniques universels pour une nouvelle entité.
 */
export function baseEntity() {
  const now = new Date().toISOString();
  return {
    created_at: now,
    updated_at: now,
    version: 1,
    schema_version: 'v2.0',
  };
}

/**
 * Retourne les champs techniques mis à jour (incrémente version).
 */
export function updatedEntity(current) {
  return {
    updated_at: new Date().toISOString(),
    version: (current.version || 0) + 1,
  };
}
