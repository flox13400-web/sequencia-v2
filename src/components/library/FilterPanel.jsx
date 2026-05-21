import { useFiltresStore } from '@/stores/filtresStore';
import { useActivitesStore } from '@/stores/activitesStore';
import { extractThemes } from '@/utils/filters';
import { useMemo } from 'react';
import '@/styles/components/library.css';

const NIVEAUX = [
  { n: 1, label: 'Mémoriser' }, { n: 2, label: 'Comprendre' },
  { n: 3, label: 'Appliquer' }, { n: 4, label: 'Analyser' },
  { n: 5, label: 'Évaluer' }, { n: 6, label: 'Créer' },
];

const MODALITES = ['Présentielle', 'Distancielle', 'Synchrone', 'Asynchrone'];
const TYPES = [
  { value: 'Activite_Apprentissage', label: 'Apprentissage' },
  { value: 'Activite_Evaluation', label: 'Évaluation' },
];

export default function FilterPanel() {
  const filtres = useFiltresStore((s) => s.filtres);
  const toggleArrayFiltre = useFiltresStore((s) => s.toggleArrayFiltre);
  const setFiltre = useFiltresStore((s) => s.setFiltre);
  const resetFiltres = useFiltresStore((s) => s.resetFiltres);
  const activites = useActivitesStore((s) => s.activites);
  const themes = useMemo(() => extractThemes(activites), [activites]);

  return (
    <div className="filter-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Filtres</h2>
        <button type="button" onClick={resetFiltres} className="btn btn-ghost btn-sm">Réinitialiser</button>
      </div>

      <div className="filter-panel-section">
        <div className="filter-panel-title">Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`filter-chip ${filtres.type_fiche.includes(value) ? 'active' : ''}`}
              onClick={() => toggleArrayFiltre('type_fiche', value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel-section">
        <div className="filter-panel-title">Niveau d'action</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {NIVEAUX.map(({ n, label }) => (
            <button
              key={n}
              type="button"
              className={`filter-chip ${filtres.niveaux_action.includes(n) ? 'active' : ''}`}
              onClick={() => toggleArrayFiltre('niveaux_action', n)}
            >
              {n} — {label}
            </button>
          ))}
        </div>
      </div>

      {themes.length > 0 && (
        <div className="filter-panel-section">
          <div className="filter-panel-title">Thèmes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                className={`filter-chip ${filtres.themes.includes(theme) ? 'active' : ''}`}
                onClick={() => toggleArrayFiltre('themes', theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-panel-section">
        <div className="filter-panel-title">Modalité</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {MODALITES.map((m) => (
            <button
              key={m}
              type="button"
              className={`filter-chip ${filtres.modalite.includes(m) ? 'active' : ''}`}
              onClick={() => toggleArrayFiltre('modalite', m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <label className="toggle-switch" style={{ marginTop: 'var(--space-2)' }}>
        <input
          type="checkbox"
          checked={filtres.favoris_only}
          onChange={(e) => setFiltre('favoris_only', e.target.checked)}
        />
        <span className="toggle-track"><span className="toggle-thumb" /></span>
        <span style={{ fontSize: 'var(--font-size-sm)' }}>Favoris uniquement</span>
      </label>
    </div>
  );
}
