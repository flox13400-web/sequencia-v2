import { describe, it, expect } from 'vitest';
import {
  checkSeanceCascade,
  checkSequenceCascade,
  checkProgrammeAlignment,
  getNomNiveau,
} from '../utils/alignmentChecker.js';

describe('getNomNiveau', () => {
  it('retourne le bon nom pour chaque niveau', () => {
    expect(getNomNiveau(1)).toBe('Mémoriser');
    expect(getNomNiveau(3)).toBe('Appliquer');
    expect(getNomNiveau(6)).toBe('Créer');
  });
  it('retourne "Niveau N" pour un niveau inconnu', () => {
    expect(getNomNiveau(9)).toBe('Niveau 9');
  });
});

describe('checkSeanceCascade', () => {
  const activites = [
    { id: 'act_1', titre: 'Activité A', niveau_action: 2 },
    { id: 'act_2', titre: 'Activité B', niveau_action: 5 },
  ];

  it('valide quand les fiches sont au niveau ou en dessous de la séance', () => {
    const seance = {
      opo_niveau_action: 3,
      fiches: [{ id: 'fic_1', activite_id: 'act_1' }],
    };
    const result = checkSeanceCascade(seance, activites);
    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('détecte une violation quand une fiche dépasse le niveau séance', () => {
    const seance = {
      opo_niveau_action: 2,
      fiches: [{ id: 'fic_2', activite_id: 'act_2' }],
    };
    const result = checkSeanceCascade(seance, activites);
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].type).toBe('cascade_seance');
  });
});

describe('checkSequenceCascade', () => {
  const seances = [
    { id: 'sea_1', titre: 'Séance 1', opo_niveau_action: 3 },
    { id: 'sea_2', titre: 'Séance 2', opo_niveau_action: 5 },
  ];

  it('valide quand toutes les séances sont au niveau ou en dessous', () => {
    const sequence = { objectif_niveau_action: 5, seances_ids: ['sea_1', 'sea_2'] };
    const result = checkSequenceCascade(sequence, seances);
    expect(result.valid).toBe(true);
  });

  it('détecte une violation de cascade séance → séquence', () => {
    const sequence = { objectif_niveau_action: 2, seances_ids: ['sea_2'] };
    const result = checkSequenceCascade(sequence, seances);
    expect(result.valid).toBe(false);
    expect(result.violations[0].type).toBe('cascade_sequence');
  });
});

describe('checkProgrammeAlignment', () => {
  it('émet un warning quand il n\'y a pas d\'évaluation sommative', () => {
    const programme = { objectif_niveau_action: 3, contenu_ordonne: [] };
    const result = checkProgrammeAlignment(programme, { activites: [], seances: [], sequences: [] });
    expect(result.warnings.some((w) => w.type === 'no_sommative')).toBe(true);
  });

  it('détecte un mauvais niveau d\'évaluation sommative', () => {
    const activites = [{
      id: 'act_eval',
      titre: 'Eval finale',
      niveau_action: 2,
      sous_type_evaluation: 'sommative',
    }];
    const programme = {
      objectif_niveau_action: 4,
      contenu_ordonne: [{ type: 'evaluation_flottante', ref_id: 'act_eval' }],
    };
    const result = checkProgrammeAlignment(programme, { activites, seances: [], sequences: [] });
    expect(result.violations.some((v) => v.type === 'eval_sommative_niveau')).toBe(true);
  });
});
