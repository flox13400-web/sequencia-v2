/**
 * Import de fichiers .sqa V2 (et migration depuis V1).
 * Cf. Doc 2 §12 — règles de fusion.
 */

/**
 * Parse et valide un fichier .sqa.
 *
 * @param {string} jsonString - Contenu brut du fichier
 * @returns {{ data: object, version: string, errors: string[] }}
 */
export function parseSqaFile(jsonString) {
  const errors = [];
  let data;

  try {
    data = JSON.parse(jsonString);
  } catch {
    return { data: null, version: null, errors: ['Fichier invalide : JSON malformé.'] };
  }

  if (!data.version) {
    errors.push('Champ "version" manquant dans le fichier.');
  }

  if (!data.programme) {
    errors.push('Champ "programme" manquant dans le fichier.');
  }

  return { data, version: data.version || 'unknown', errors };
}

/**
 * Fusionne les entités importées avec les stores locaux.
 * Retourne les listes d'entités à ajouter, remplacer ou en conflit.
 *
 * @param {object[]} importedEntities
 * @param {Map<string, object>} localEntitiesMap - Map id → entité locale
 * @returns {{ toAdd: object[], toReplace: object[], conflicts: object[] }}
 */
export function mergeEntities(importedEntities, localEntitiesMap) {
  const toAdd = [];
  const toReplace = [];
  const conflicts = [];

  for (const entity of importedEntities) {
    const local = localEntitiesMap.get(entity.id);

    if (!local) {
      toAdd.push(entity);
    } else if (entity.version > local.version) {
      toReplace.push(entity);
    } else if (entity.version < local.version) {
      // Entité distante plus ancienne — on ignore
    } else if (entity.updated_at !== local.updated_at) {
      conflicts.push({ imported: entity, local });
    }
    // Même version, même updated_at → ignoré silencieusement
  }

  return { toAdd, toReplace, conflicts };
}

/**
 * Lit un fichier File via FileReader et retourne son contenu texte.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Détecte le type de contenu d'un fichier .sqa.
 *
 * @param {object} sqaData
 * @returns {'programme'|'sequence'|'seance'|'activite'|'tuto'|'unknown'}
 */
export function detectSqaType(sqaData) {
  if (sqaData.programme) return 'programme';
  if (sqaData.sequence) return 'sequence';
  if (sqaData.seance) return 'seance';
  if (sqaData.activite) return 'activite';
  if (sqaData.tuto) return 'tuto';
  return 'unknown';
}
