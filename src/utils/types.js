/**
 * JSDoc typings pour les entités SEQUENCIA V2.
 * Ces types documentent la structure attendue des objets métier.
 */

/**
 * @typedef {Object} LienExterne
 * @property {string} id
 * @property {string} url
 * @property {string} libelle
 * @property {'video'|'image'|'document'|'site'|'autre'} type
 * @property {boolean} afficher_qrcode
 */

/**
 * @typedef {Object} Activite
 * @property {string} id - Préfixé act_
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} version
 * @property {string} schema_version
 * @property {string} titre
 * @property {string} description_courte
 * @property {string} description
 * @property {string} apprentissage_cle
 * @property {string[]} age_public
 * @property {string} duree
 * @property {string} duree_detail
 * @property {number} duree_minutes
 * @property {string[]} taille_groupe
 * @property {string[]} themes
 * @property {string[]} materiels
 * @property {string[]} contexte
 * @property {string[]} modalite
 * @property {'Activite_Apprentissage'|'Activite_Evaluation'} type_fiche
 * @property {'diagnostique'|'formative'|'sommative'|null} sous_type_evaluation
 * @property {string} verbe_action
 * @property {number} niveau_action - 1 à 6
 * @property {string} opo_activite
 * @property {string} eval_modalite
 * @property {string} eval_conditions
 * @property {string} eval_criteres
 * @property {object|null} grille_criteree - V2.1
 * @property {string|null} problematique
 * @property {string|null} remediation
 * @property {string|null} methode_pedagogique - V2.1
 * @property {object} psh_adaptations - V2.1
 * @property {string} statut - V2.1
 * @property {number} qualiopi_score - V2.1
 * @property {string[]} tags - V2.4
 * @property {string} notes_perso - V2.4
 * @property {LienExterne[]} liens_externes
 * @property {'custom'|'importee_sqa'} origine
 */

/**
 * @typedef {Object} Fiche
 * @property {string} id - Préfixé fic_
 * @property {string} activite_id
 * @property {number} ordre
 * @property {number|null} override_duree_minutes
 * @property {string} notes_animation
 * @property {'Activite_Apprentissage'|'Activite_Evaluation'} type_fiche
 * @property {string} verbe_action
 */

/**
 * @typedef {Object} Seance
 * @property {string} id - Préfixé sea_
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} version
 * @property {string} schema_version
 * @property {string} titre
 * @property {string} description
 * @property {string} opo_verbe_action
 * @property {number} opo_niveau_action
 * @property {'Savoir'|'Savoir-faire'|'Savoir-être'} opo_type
 * @property {string} opo_phrase
 * @property {Fiche[]} fiches
 * @property {number} duree_totale_minutes
 * @property {boolean} is_template - V2.4
 * @property {string|null} template_categorie - V2.4
 * @property {string} statut - V2.1
 * @property {number} qualiopi_score - V2.1
 * @property {object[]} alertes - V2.1
 * @property {string|null} position_journee - V2.2
 * @property {object} methodes_repartition - V2.2
 * @property {object|null} alerte_3070 - V2.2
 */

/**
 * @typedef {Object} Sequence
 * @property {string} id - Préfixé seq_
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} version
 * @property {string} schema_version
 * @property {string} titre
 * @property {string} description
 * @property {string} objectif_verbe_action
 * @property {number} objectif_niveau_action
 * @property {string} objectif_action
 * @property {string} objectif_competence
 * @property {string[]} seances_ids
 * @property {number} duree_totale_minutes
 * @property {boolean} is_template - V2.4
 * @property {string|null} template_categorie - V2.4
 * @property {string} statut - V2.1
 * @property {number} qualiopi_score - V2.1
 * @property {object[]} alertes - V2.1
 */

/**
 * @typedef {{ type: 'sequence', ref_id: string, ordre: number } | { type: 'evaluation_flottante', ref_id: string, ordre: number }} ContenuOrdonne
 */

/**
 * @typedef {Object} Programme
 * @property {string} id - Préfixé prog_
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} version
 * @property {string} schema_version
 * @property {string} titre
 * @property {string} description
 * @property {number} duree_objectif_heures
 * @property {string} objectif_verbe_action
 * @property {number} objectif_niveau_action
 * @property {string} objectif_action
 * @property {string} objectif_final
 * @property {string} public_cible
 * @property {string} prerequis
 * @property {object[]} prerequis_traces - V2.1
 * @property {string} modalite_globale
 * @property {ContenuOrdonne[]} contenu_ordonne
 * @property {number} duree_totale_minutes
 * @property {number} progression_objectif
 * @property {boolean} is_template - V2.4
 * @property {string} statut - V2.1
 * @property {number} qualiopi_score - V2.1
 * @property {boolean} contexte_qualiopi_active - V2.1
 * @property {object[]} alertes - V2.1
 */

export {};
