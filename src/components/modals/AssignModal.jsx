import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useActivitesStore } from '@/stores/activitesStore';
import Button from '@/components/ui/Button';
import '@/styles/components/modals.css';

export default function AssignModal({ isOpen, title = 'Choisir une activité', onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const activites = useActivitesStore((s) => s.activites);

  if (!isOpen) return null;

  const filtered = activites.filter((a) =>
    !search || a.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="assign-title">
        <div className="modal-header">
          <h2 id="assign-title" className="modal-title">{title}</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
            <Search size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              className="input-field"
              placeholder="Rechercher une activité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 'calc(var(--icon-size-md) + var(--space-6))' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '400px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
                Aucune activité trouvée.
              </p>
            ) : filtered.map((activite) => (
              <button
                key={activite.id}
                type="button"
                onClick={() => { onSelect(activite); onClose(); }}
                style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'var(--color-bg)', cursor: 'pointer', transition: 'border-color var(--transition-fast)' }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{activite.titre}</div>
                {activite.description_courte && (
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{activite.description_courte}</div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}
