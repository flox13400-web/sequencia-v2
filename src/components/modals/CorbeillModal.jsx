import { X, RotateCcw, Trash2 } from 'lucide-react';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import Button from '@/components/ui/Button';
import '@/styles/components/modals.css';

export default function CorbeillModal({ isOpen, onClose, onRestore }) {
  const items = useCorbeilleStore((s) => s.items);
  const deleteFromCorbeille = useCorbeilleStore((s) => s.deleteFromCorbeille);
  const emptyCorbeille = useCorbeilleStore((s) => s.emptyCorbeille);
  const restoreFromCorbeille = useCorbeilleStore((s) => s.restoreFromCorbeille);

  if (!isOpen) return null;

  const handleRestore = (item) => {
    const restored = restoreFromCorbeille(item.id);
    onRestore?.(item.type, restored);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="corbeill-title">
        <div className="modal-header">
          <h2 id="corbeill-title" className="modal-title">Corbeille</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" />
          </button>
        </div>
        <div className="modal-body">
          {items.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>La corbeille est vide.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.snapshot?.titre || item.entity_id}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>{item.type} — supprimé le {new Date(item.deleted_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleRestore(item)} aria-label="Restaurer">
                    <RotateCcw size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteFromCorbeille(item.id)} aria-label="Supprimer définitivement">
                    <Trash2 size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          {items.length > 0 && (
            <Button variant="danger" onClick={emptyCorbeille}>Vider la corbeille</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
        </div>
      </div>
    </div>
  );
}
