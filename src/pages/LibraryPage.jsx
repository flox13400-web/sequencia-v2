import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Plus, Search, Upload, Trash2 } from 'lucide-react';
import { useActivitesStore } from '@/stores/activitesStore';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import { useFiltresStore } from '@/stores/filtresStore';
import { useFilters } from '@/hooks/useFilters';
import ActivityCard from '@/components/library/ActivityCard';
import FilterPanel from '@/components/library/FilterPanel';
import ActiveFilterBadges from '@/components/library/ActiveFilterBadges';
import DetailModal from '@/components/modals/DetailModal';
import ConfirmModal from '@/components/modals/ConfirmModal';
import CorbeillModal from '@/components/modals/CorbeillModal';
import Button from '@/components/ui/Button';
import { readFileAsText, parseSqaFile } from '@/utils/importSqa';
import '@/styles/pages/library.css';

export default function LibraryPage() {
  const [, navigate] = useLocation();
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [showCorbeille, setShowCorbeille] = useState(false);
  const fileInputRef = useRef(null);

  const removeActivite = useActivitesStore((s) => s.removeActivite);
  const addActivite = useActivitesStore((s) => s.addActivite);
  const moveToCorbeille = useCorbeilleStore((s) => s.moveToCorbeille);
  const restoreFromCorbeille = useCorbeilleStore((s) => s.restoreFromCorbeille);
  const setFiltre = useFiltresStore((s) => s.setFiltre);
  const filtres = useFiltresStore((s) => s.filtres);

  const { activitesFiltrees, count } = useFilters();
  const totalActivites = useActivitesStore((s) => s.activites.length);

  const handleDelete = (activite) => {
    moveToCorbeille('activite', activite);
    removeActivite(activite.id);
    setToDelete(null);
    if (selectedActivite?.id === activite.id) setSelectedActivite(null);
  };

  const handleRestore = (type, entity) => {
    if (type === 'activite' && entity) addActivite(entity);
  };

  const handleImportJson = async (file) => {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const { data, errors } = parseSqaFile(text);
      if (errors.length > 0) { alert(errors.join('\n')); return; }
      if (data.activite) {
        addActivite({ ...data.activite, origine: 'importee_sqa' });
      }
    } catch {
      alert('Impossible de lire le fichier.');
    }
  };

  if (totalActivites === 0) {
    return (
      <main>
        <div className="empty-state">
          <BookOpenEmpty />
          <h1 className="empty-state-title">Votre bibliothèque est vide</h1>
          <p className="empty-state-description">
            Créez votre première activité ou importez un fichier .sqa pour commencer.
          </p>
          <div className="empty-state-actions">
            <Button variant="primary" onClick={() => navigate('/activite/nouvelle')}>
              <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Créer une activité
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Importer un fichier
            </Button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept=".sqa,.json" style={{ display: 'none' }}
          onChange={(e) => handleImportJson(e.target.files?.[0])} />
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 className="page-title">Bibliothèque</h1>
            <p className="page-subtitle">{totalActivites} activité{totalActivites > 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => setShowCorbeille(true)} aria-label="Corbeille">
              <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Importer
            </Button>
            <Button variant="primary" onClick={() => navigate('/activite/nouvelle')}>
              <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Nouvelle activité
            </Button>
          </div>
        </div>
      </div>

      <div className="library-layout">
        <aside className="library-sidebar">
          <FilterPanel />
        </aside>

        <div className="library-main">
          <div className="library-toolbar">
            <div className="library-search" style={{ flex: 1 }}>
              <Search className="library-search-icon" size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              <input
                className="input-field"
                placeholder="Rechercher dans la bibliothèque..."
                value={filtres.recherche}
                onChange={(e) => setFiltre('recherche', e.target.value)}
                style={{ paddingLeft: 'calc(var(--icon-size-md) + var(--space-6))' }}
              />
            </div>
            <span className="library-count">{count} résultat{count > 1 ? 's' : ''}</span>
          </div>

          <ActiveFilterBadges />

          {activitesFiltrees.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-12) var(--space-4)' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>Aucune activité ne correspond à vos filtres.</p>
              <Button variant="secondary" onClick={() => useFiltresStore.getState().resetFiltres()}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="library-grid">
              {activitesFiltrees.map((activite) => (
                <ActivityCard
                  key={activite.id}
                  activite={activite}
                  onClick={setSelectedActivite}
                  onEdit={(a) => navigate(`/activite/${a.id}`)}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedActivite}
        activite={selectedActivite}
        onClose={() => setSelectedActivite(null)}
        onEdit={(a) => { navigate(`/activite/${a.id}`); setSelectedActivite(null); }}
      />

      <ConfirmModal
        isOpen={!!toDelete}
        title="Supprimer l'activité"
        message={`Supprimer "${toDelete?.titre}" ? Elle sera déplacée dans la corbeille.`}
        confirmLabel="Supprimer"
        onConfirm={() => handleDelete(toDelete)}
        onCancel={() => setToDelete(null)}
      />

      <CorbeillModal
        isOpen={showCorbeille}
        onClose={() => setShowCorbeille(false)}
        onRestore={handleRestore}
      />

      <input ref={fileInputRef} type="file" accept=".sqa,.json" style={{ display: 'none' }}
        onChange={(e) => handleImportJson(e.target.files?.[0])} />
    </main>
  );
}

function BookOpenEmpty() {
  return (
    <div style={{ color: 'var(--color-text-subtle)' }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    </div>
  );
}
