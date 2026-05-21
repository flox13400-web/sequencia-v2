/**
 * Vérification de l'alignement pédagogique en cascade.
 * Règles définies dans Doc 2 §13.1.
 * Fonctions pures, testables unitairement.
 */

/**
 * Vérifie la cascade des niveaux d'action au sein d'une séance.
 * Règle : fiche.niveau_action ≤ seance.opo_niveau_action
 *
 * @param {import('./types').Seance} seance
 * @param {import('./types').Activite[]} activites - Dictionnaire d'activités
 * @returns {{ valid: boolean, violations: object[] }}
 */
export function checkSeanceCascade(seance, activites) {
  const violations = [];
  const seanceNiveau = seance.opo_niveau_action || 6;

  for (const fiche of seance.fiches || []) {
    const activite = activites.find((a) => a.id === fiche.activite_id);
    if (!activite) continue;

    const ficheNiveau = activite.niveau_action || fiche.niveau_action || 0;
    if (ficheNiveau > seanceNiveau) {
      violations.push({
        type: 'cascade_seance',
        fiche_id: fiche.id,
        activite_titre: activite.titre,
        fiche_niveau: ficheNiveau,
        seance_niveau: seanceNiveau,
        message: `Le niveau "${getNomNiveau(ficheNiveau)}" de l'activité "${activite.titre}" dépasse l'objectif de la séance "${getNomNiveau(seanceNiveau)}". Diminuez le niveau d'action de cette activité ou élevez l'objectif de la séance.`,
      });
    }
  }

  return { valid: violations.length === 0, violations };
}

/**
 * Vérifie la cascade séance → séquence.
 * Règle : seance.opo_niveau_action ≤ sequence.objectif_niveau_action
 *
 * @param {import('./types').Sequence} sequence
 * @param {import('./types').Seance[]} seances
 * @returns {{ valid: boolean, violations: object[] }}
 */
export function checkSequenceCascade(sequence, seances) {
  const violations = [];
  const sequenceNiveau = sequence.objectif_niveau_action || 6;

  for (const seanceId of sequence.seances_ids || []) {
    const seance = seances.find((s) => s.id === seanceId);
    if (!seance) continue;

    const seanceNiveau = seance.opo_niveau_action || 0;
    if (seanceNiveau > sequenceNiveau) {
      violations.push({
        type: 'cascade_sequence',
        seance_id: seanceId,
        seance_titre: seance.titre,
        seance_niveau: seanceNiveau,
        sequence_niveau: sequenceNiveau,
        message: `Le niveau "${getNomNiveau(seanceNiveau)}" de la séance "${seance.titre}" dépasse l'objectif de la séquence "${getNomNiveau(sequenceNiveau)}".`,
      });
    }
  }

  return { valid: violations.length === 0, violations };
}

/**
 * Vérifie la cascade séquence → programme.
 * Règle : sequence.objectif_niveau_action ≤ programme.objectif_niveau_action
 *
 * @param {import('./types').Programme} programme
 * @param {import('./types').Sequence[]} sequences
 * @returns {{ valid: boolean, violations: object[] }}
 */
export function checkProgrammeCascade(programme, sequences) {
  const violations = [];
  const programmeNiveau = programme.objectif_niveau_action || 6;

  for (const item of programme.contenu_ordonne || []) {
    if (item.type !== 'sequence') continue;
    const sequence = sequences.find((s) => s.id === item.ref_id);
    if (!sequence) continue;

    const sequenceNiveau = sequence.objectif_niveau_action || 0;
    if (sequenceNiveau > programmeNiveau) {
      violations.push({
        type: 'cascade_programme',
        sequence_id: sequence.id,
        sequence_titre: sequence.titre,
        sequence_niveau: sequenceNiveau,
        programme_niveau: programmeNiveau,
        message: `Le niveau "${getNomNiveau(sequenceNiveau)}" de la séquence "${sequence.titre}" dépasse l'objectif du programme "${getNomNiveau(programmeNiveau)}".`,
      });
    }
  }

  return { valid: violations.length === 0, violations };
}

/**
 * Vérifie l'alignement des évaluations sommatives avec l'objectif du programme.
 * Règle : eval_sommative.niveau_action === programme.objectif_niveau_action
 *
 * @param {import('./types').Programme} programme
 * @param {import('./types').Activite[]} activites
 * @returns {{ valid: boolean, violations: object[], hasSommative: boolean }}
 */
export function checkEvalSommative(programme, activites) {
  const violations = [];
  const programmeNiveau = programme.objectif_niveau_action || 0;
  let hasSommative = false;

  for (const item of programme.contenu_ordonne || []) {
    if (item.type !== 'evaluation_flottante') continue;
    const activite = activites.find((a) => a.id === item.ref_id);
    if (!activite || activite.sous_type_evaluation !== 'sommative') continue;

    hasSommative = true;
    if (activite.niveau_action !== programmeNiveau) {
      violations.push({
        type: 'eval_sommative_niveau',
        activite_id: activite.id,
        activite_titre: activite.titre,
        eval_niveau: activite.niveau_action,
        programme_niveau: programmeNiveau,
        message: `L'évaluation sommative "${activite.titre}" (niveau "${getNomNiveau(activite.niveau_action)}") doit être au même niveau que l'objectif du programme "${getNomNiveau(programmeNiveau)}".`,
      });
    }
  }

  return { valid: violations.length === 0, violations, hasSommative };
}

/**
 * Vérification globale d'un programme.
 *
 * @param {import('./types').Programme} programme
 * @param {{ activites: import('./types').Activite[], seances: import('./types').Seance[], sequences: import('./types').Sequence[] }} dictionnaire
 * @returns {{ violations: object[], warnings: object[] }}
 */
export function checkProgrammeAlignment(programme, { activites, seances, sequences }) {
  const violations = [];
  const warnings = [];

  const sommative = checkEvalSommative(programme, activites);
  violations.push(...sommative.violations);
  if (!sommative.hasSommative) {
    warnings.push({
      type: 'no_sommative',
      message: 'Ce programme ne contient pas d\'évaluation sommative. Recommandé pour valider l\'atteinte des objectifs.',
    });
  }

  const programmeCascade = checkProgrammeCascade(programme, sequences);
  violations.push(...programmeCascade.violations);

  for (const item of programme.contenu_ordonne || []) {
    if (item.type !== 'sequence') continue;
    const sequence = sequences.find((s) => s.id === item.ref_id);
    if (!sequence) continue;

    const seqCascade = checkSequenceCascade(sequence, seances);
    violations.push(...seqCascade.violations);

    for (const seanceId of sequence.seances_ids || []) {
      const seance = seances.find((s) => s.id === seanceId);
      if (!seance) continue;
      const seanceCascade = checkSeanceCascade(seance, activites);
      violations.push(...seanceCascade.violations);
    }
  }

  return { violations, warnings };
}

/**
 * Retourne le nom de l'objectif cognitif pour un niveau 1-6.
 *
 * @param {number} niveau
 * @returns {string}
 */
export function getNomNiveau(niveau) {
  const noms = {
    1: 'Mémoriser',
    2: 'Comprendre',
    3: 'Appliquer',
    4: 'Analyser',
    5: 'Évaluer',
    6: 'Créer',
  };
  return noms[niveau] || `Niveau ${niveau}`;
}
