import { describe, it, expect } from 'vitest';
import { filterActivites, extractThemes, countByNiveau, emptyFiltres } from '../utils/filters.js';

const SAMPLE_ACTIVITES = [
  { id: 'a1', titre: 'Débat mouvant', description_courte: 'Débat oral', themes: ['Communication', 'Oral'], type_fiche: 'Activite_Apprentissage', niveau_action: 3, modalite: ['Présentielle'], contexte: ['Scolaire'], taille_groupe: ['7-12'] },
  { id: 'a2', titre: 'Quiz Kahoot', description_courte: 'Quiz interactif', themes: ['Numérique'], type_fiche: 'Activite_Evaluation', niveau_action: 1, modalite: ['Distancielle'], contexte: ['Entreprise'], taille_groupe: ['>12'] },
  { id: 'a3', titre: 'Carte mentale', description_courte: 'Synthèse visuelle', themes: ['Communication'], type_fiche: 'Activite_Apprentissage', niveau_action: 4, modalite: ['Présentielle'], contexte: ['Scolaire'], taille_groupe: ['4-6'] },
];

describe('filterActivites', () => {
  it('retourne toutes les activités sans filtre', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, emptyFiltres());
    expect(result).toHaveLength(3);
  });

  it('filtre par recherche textuelle', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), recherche: 'débat' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('filtre par type_fiche', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), type_fiche: ['Activite_Evaluation'] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a2');
  });

  it('filtre par niveau d\'action', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), niveaux_action: [3, 4] });
    expect(result).toHaveLength(2);
  });

  it('filtre par thème', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), themes: ['Communication'] });
    expect(result).toHaveLength(2);
  });

  it('filtre favoris_only', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), favoris_only: true }, ['a1']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('retourne vide si aucun favoris et favoris_only=true', () => {
    const result = filterActivites(SAMPLE_ACTIVITES, { ...emptyFiltres(), favoris_only: true }, []);
    expect(result).toHaveLength(0);
  });
});

describe('extractThemes', () => {
  it('extrait les thèmes uniques triés', () => {
    const themes = extractThemes(SAMPLE_ACTIVITES);
    expect(themes).toEqual(['Communication', 'Numérique', 'Oral']);
  });
});

describe('countByNiveau', () => {
  it('compte correctement les activités par niveau', () => {
    const counts = countByNiveau(SAMPLE_ACTIVITES);
    expect(counts[1]).toBe(1);
    expect(counts[3]).toBe(1);
    expect(counts[4]).toBe(1);
    expect(counts[2]).toBeUndefined();
  });
});
