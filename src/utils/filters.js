/**
 * Logique de filtrage de la bibliothèque d'activités.
 * Fonctions pures, testables unitairement.
 */

/**
 * Filtre une liste d'activités selon les critères actifs.
 *
 * @param {import('./types').Activite[]} activites
 * @param {object} filtres
 * @param {string} filtres.recherche - Texte libre (titre, description)
 * @param {string[]} filtres.themes - Thèmes sélectionnés
 * @param {string[]} filtres.type_fiche - Types (Activite_Apprentissage, Activite_Evaluation)
 * @param {number[]} filtres.niveaux_action - Niveaux 1-6
 * @param {string[]} filtres.modalite - Modalités
 * @param {string[]} filtres.contexte - Contextes
 * @param {string[]} filtres.taille_groupe - Tailles de groupe
 * @param {boolean} filtres.favoris_only - Uniquement les favoris
 * @param {string[]} favoris_ids - IDs des activités favorites
 * @returns {import('./types').Activite[]}
 */
export function filterActivites(activites, filtres, favoris_ids = []) {
  return activites.filter((activite) => {
    if (filtres.favoris_only && !favoris_ids.includes(activite.id)) return false;

    if (filtres.recherche) {
      const q = filtres.recherche.toLowerCase();
      const searchable = [
        activite.titre,
        activite.description_courte,
        activite.description,
        activite.apprentissage_cle,
        activite.verbe_action,
        ...(activite.themes || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    if (filtres.themes?.length) {
      const hasTheme = filtres.themes.some((t) =>
        (activite.themes || []).includes(t)
      );
      if (!hasTheme) return false;
    }

    if (filtres.type_fiche?.length) {
      if (!filtres.type_fiche.includes(activite.type_fiche)) return false;
    }

    if (filtres.niveaux_action?.length) {
      if (!filtres.niveaux_action.includes(activite.niveau_action)) return false;
    }

    if (filtres.modalite?.length) {
      const hasModalite = filtres.modalite.some((m) =>
        (activite.modalite || []).includes(m)
      );
      if (!hasModalite) return false;
    }

    if (filtres.contexte?.length) {
      const hasContexte = filtres.contexte.some((c) =>
        (activite.contexte || []).includes(c)
      );
      if (!hasContexte) return false;
    }

    if (filtres.taille_groupe?.length) {
      const hasTaille = filtres.taille_groupe.some((t) =>
        (activite.taille_groupe || []).includes(t)
      );
      if (!hasTaille) return false;
    }

    return true;
  });
}

/**
 * Extrait tous les thèmes uniques d'une liste d'activités.
 *
 * @param {import('./types').Activite[]} activites
 * @returns {string[]} Thèmes triés alphabétiquement
 */
export function extractThemes(activites) {
  const themes = new Set();
  activites.forEach((a) => (a.themes || []).forEach((t) => themes.add(t)));
  return [...themes].sort();
}

/**
 * Compte les activités par niveau d'action.
 *
 * @param {import('./types').Activite[]} activites
 * @returns {Record<number, number>}
 */
export function countByNiveau(activites) {
  return activites.reduce((acc, a) => {
    const n = a.niveau_action || 0;
    acc[n] = (acc[n] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Retourne les filtres vides par défaut.
 */
export function emptyFiltres() {
  return {
    recherche: '',
    themes: [],
    type_fiche: [],
    niveaux_action: [],
    modalite: [],
    contexte: [],
    taille_groupe: [],
    favoris_only: false,
  };
}
