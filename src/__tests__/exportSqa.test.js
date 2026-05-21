import { describe, it, expect } from 'vitest';
import { buildSqaExport } from '../utils/exportSqa.js';

const ACTIVITE_APPRENT = {
  id: 'act_1', titre: 'Débat mouvant', type_fiche: 'Activite_Apprentissage',
  sous_type_evaluation: null, niveau_action: 3, verbe_action: 'Démontrer',
  origine: 'custom', version: 1,
};
const ACTIVITE_EVAL = {
  id: 'act_eval', titre: 'Éval finale', type_fiche: 'Activite_Evaluation',
  sous_type_evaluation: 'sommative', niveau_action: 3, verbe_action: 'Évaluer',
  origine: 'custom', version: 1,
};
const SEANCE = {
  id: 'sea_1', titre: 'Séance intro', opo_niveau_action: 3,
  fiches: [{ id: 'fic_1', activite_id: 'act_1', ordre: 0 }],
  duree_totale_minutes: 30, version: 1,
};
const SEQUENCE = {
  id: 'seq_1', titre: 'Module 1', objectif_niveau_action: 3,
  seances_ids: ['sea_1'], duree_totale_minutes: 30, version: 1,
};
const PROGRAMME = {
  id: 'prog_1', titre: 'Formation test', objectif_niveau_action: 3,
  contenu_ordonne: [
    { type: 'sequence', ref_id: 'seq_1', ordre: 0 },
    { type: 'evaluation_flottante', ref_id: 'act_eval', ordre: 1 },
  ],
  version: 1,
};

describe('buildSqaExport', () => {
  const stores = {
    activites: [ACTIVITE_APPRENT, ACTIVITE_EVAL],
    seances: [SEANCE],
    sequences: [SEQUENCE],
  };

  it('produit un objet avec les champs obligatoires', () => {
    const result = buildSqaExport(PROGRAMME, stores);
    expect(result.version).toBe('2.0');
    expect(result.programme).toBe(PROGRAMME);
    expect(result.exported_at).toBeTruthy();
    expect(result.dictionnaires).toBeDefined();
  });

  it('inclut les activités référencées par les fiches', () => {
    const result = buildSqaExport(PROGRAMME, stores);
    const ids = result.dictionnaires.activites.map((a) => a.id);
    expect(ids).toContain('act_1');
  });

  it('inclut les évaluations flottantes', () => {
    const result = buildSqaExport(PROGRAMME, stores);
    const ids = result.dictionnaires.activites.map((a) => a.id);
    expect(ids).toContain('act_eval');
  });

  it('inclut les séances et séquences', () => {
    const result = buildSqaExport(PROGRAMME, stores);
    expect(result.dictionnaires.seances).toHaveLength(1);
    expect(result.dictionnaires.sequences).toHaveLength(1);
  });

  it('ne duplique pas les activités référencées plusieurs fois', () => {
    const ficheDouble = { id: 'fic_2', activite_id: 'act_1', ordre: 1 };
    const seanceDouble = { ...SEANCE, id: 'sea_2', fiches: [ficheDouble] };
    const seqDouble = { ...SEQUENCE, id: 'seq_2', seances_ids: ['sea_1', 'sea_2'] };
    const progDouble = { ...PROGRAMME, contenu_ordonne: [{ type: 'sequence', ref_id: 'seq_2', ordre: 0 }] };
    const result = buildSqaExport(progDouble, {
      activites: [ACTIVITE_APPRENT],
      seances: [SEANCE, seanceDouble],
      sequences: [seqDouble],
    });
    const ids = result.dictionnaires.activites.map((a) => a.id);
    // act_1 ne doit apparaître qu'une fois
    expect(ids.filter((id) => id === 'act_1')).toHaveLength(1);
  });

  it('gère un programme vide sans erreur', () => {
    const progVide = { ...PROGRAMME, contenu_ordonne: [] };
    const result = buildSqaExport(progVide, stores);
    expect(result.dictionnaires.activites).toHaveLength(0);
    expect(result.dictionnaires.seances).toHaveLength(0);
  });
});
