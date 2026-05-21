import { describe, it, expect } from 'vitest';
import { parseSqaFile, mergeEntities, detectSqaType } from '../utils/importSqa.js';

const VALID_SQA = JSON.stringify({
  version: '2.0',
  exported_at: '2026-05-21T10:00:00Z',
  programme: { id: 'prog_1', titre: 'Test', contenu_ordonne: [] },
  dictionnaires: { activites: [], seances: [], sequences: [] },
});

describe('parseSqaFile', () => {
  it('parse un JSON valide', () => {
    const { data, errors } = parseSqaFile(VALID_SQA);
    expect(errors).toHaveLength(0);
    expect(data.version).toBe('2.0');
    expect(data.programme.id).toBe('prog_1');
  });

  it('retourne une erreur sur JSON malformé', () => {
    const { data, errors } = parseSqaFile('{ invalid json }');
    expect(data).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('JSON');
  });

  it('retourne une erreur si "programme" est absent', () => {
    const { errors } = parseSqaFile(JSON.stringify({ version: '2.0' }));
    expect(errors.some((e) => e.includes('programme'))).toBe(true);
  });

  it('retourne une erreur si "version" est absent', () => {
    const { errors } = parseSqaFile(JSON.stringify({ programme: {} }));
    expect(errors.some((e) => e.includes('version'))).toBe(true);
  });
});

describe('mergeEntities', () => {
  const local = new Map([
    ['a1', { id: 'a1', version: 2, updated_at: '2026-01-01' }],
    ['a2', { id: 'a2', version: 1, updated_at: '2026-01-01' }],
  ]);

  it('ajoute les entités absentes localement', () => {
    const imported = [{ id: 'a3', version: 1, updated_at: '2026-01-01' }];
    const { toAdd, toReplace, conflicts } = mergeEntities(imported, local);
    expect(toAdd).toHaveLength(1);
    expect(toAdd[0].id).toBe('a3');
    expect(toReplace).toHaveLength(0);
    expect(conflicts).toHaveLength(0);
  });

  it('remplace si version distante > locale', () => {
    const imported = [{ id: 'a2', version: 3, updated_at: '2026-02-01' }];
    const { toAdd, toReplace } = mergeEntities(imported, local);
    expect(toAdd).toHaveLength(0);
    expect(toReplace).toHaveLength(1);
  });

  it('ignore si version distante < locale', () => {
    const imported = [{ id: 'a1', version: 1, updated_at: '2026-01-01' }];
    const { toAdd, toReplace, conflicts } = mergeEntities(imported, local);
    expect(toAdd).toHaveLength(0);
    expect(toReplace).toHaveLength(0);
    expect(conflicts).toHaveLength(0);
  });

  it('signale un conflit si même version mais updated_at différent', () => {
    const imported = [{ id: 'a2', version: 1, updated_at: '2026-06-01' }];
    const { conflicts } = mergeEntities(imported, local);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].imported.id).toBe('a2');
  });
});

describe('detectSqaType', () => {
  it('détecte un programme', () => {
    expect(detectSqaType({ programme: {} })).toBe('programme');
  });
  it('détecte une séquence', () => {
    expect(detectSqaType({ sequence: {} })).toBe('sequence');
  });
  it('détecte une séance', () => {
    expect(detectSqaType({ seance: {} })).toBe('seance');
  });
  it('détecte une activité', () => {
    expect(detectSqaType({ activite: {} })).toBe('activite');
  });
  it('retourne unknown pour un contenu non reconnu', () => {
    expect(detectSqaType({ foo: 'bar' })).toBe('unknown');
  });
});
