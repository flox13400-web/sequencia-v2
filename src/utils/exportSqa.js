/**
 * Export d'un programme complet au format .sqa V2 (JSON autonome).
 * Cf. Doc 2 §12.
 */

/**
 * Construit le dictionnaire complet des entités référencées par un programme.
 *
 * @param {import('./types').Programme} programme
 * @param {{ activites: import('./types').Activite[], seances: import('./types').Seance[], sequences: import('./types').Sequence[] }} stores
 * @returns {object} Objet .sqa V2 prêt à sérialiser
 */
export function buildSqaExport(programme, { activites, seances, sequences }) {
  const activitesDict = new Map(activites.map((a) => [a.id, a]));
  const seancesDict = new Map(seances.map((s) => [s.id, s]));
  const sequencesDict = new Map(sequences.map((s) => [s.id, s]));

  const referencedSequences = [];
  const referencedSeances = [];
  const referencedActivites = [];

  const activiteIds = new Set();
  const seanceIds = new Set();
  const sequenceIds = new Set();

  for (const item of programme.contenu_ordonne || []) {
    if (item.type === 'sequence') {
      const seq = sequencesDict.get(item.ref_id);
      if (!seq || sequenceIds.has(seq.id)) continue;
      sequenceIds.add(seq.id);
      referencedSequences.push(seq);

      for (const seanceId of seq.seances_ids || []) {
        const seance = seancesDict.get(seanceId);
        if (!seance || seanceIds.has(seance.id)) continue;
        seanceIds.add(seance.id);
        referencedSeances.push(seance);

        for (const fiche of seance.fiches || []) {
          const act = activitesDict.get(fiche.activite_id);
          if (!act || activiteIds.has(act.id)) continue;
          activiteIds.add(act.id);
          referencedActivites.push(act);
        }
      }
    } else if (item.type === 'evaluation_flottante') {
      const act = activitesDict.get(item.ref_id);
      if (!act || activiteIds.has(act.id)) continue;
      activiteIds.add(act.id);
      referencedActivites.push(act);
    }
  }

  return {
    version: '2.0',
    exported_at: new Date().toISOString(),
    exported_by_app_version: '2.0.0',
    programme,
    dictionnaires: {
      activites: referencedActivites,
      seances: referencedSeances,
      sequences: referencedSequences,
      journees_planifiees: [],
      relances_pedagogiques: [],
    },
    metadata: {
      settings_snapshot: null,
    },
  };
}

/**
 * Déclenche le téléchargement d'un fichier .sqa dans le navigateur.
 * Aucun appel réseau — utilise l'API Blob native.
 *
 * @param {object} sqaData - Résultat de buildSqaExport
 * @param {string} filename - Nom du fichier sans extension
 */
export function downloadSqa(sqaData, filename) {
  const json = JSON.stringify(sqaData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.sqa`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
