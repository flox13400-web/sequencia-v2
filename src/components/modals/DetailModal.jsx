import { X, ExternalLink } from 'lucide-react';
import Tag from '@/components/ui/Tag';
import QRCodeGenerator from '@/components/ui/QRCodeGenerator';
import '@/styles/components/modals.css';

const NIVEAU_NOMS = {
  1: 'Mémoriser', 2: 'Comprendre', 3: 'Appliquer',
  4: 'Analyser', 5: 'Évaluer', 6: 'Créer',
};

export default function DetailModal({ isOpen, activite, onClose, onEdit }) {
  if (!isOpen || !activite) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel modal-panel-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="modal-header">
          <h2 id="detail-title" className="modal-title">{activite.titre || 'Sans titre'}</h2>
          {onEdit && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(activite)}>
              Modifier
            </button>
          )}
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-modal-meta-grid">
            {activite.niveau_action > 0 && (
              <div className="detail-modal-field">
                <div className="detail-modal-field-label">Niveau d'action</div>
                <div className="detail-modal-field-value">
                  {activite.niveau_action} — {NIVEAU_NOMS[activite.niveau_action]}
                </div>
              </div>
            )}
            {activite.verbe_action && (
              <div className="detail-modal-field">
                <div className="detail-modal-field-label">Verbe d'action</div>
                <div className="detail-modal-field-value">{activite.verbe_action}</div>
              </div>
            )}
            {activite.duree && (
              <div className="detail-modal-field">
                <div className="detail-modal-field-label">Durée</div>
                <div className="detail-modal-field-value">{activite.duree_detail || activite.duree}</div>
              </div>
            )}
            {activite.type_fiche && (
              <div className="detail-modal-field">
                <div className="detail-modal-field-label">Type</div>
                <div className="detail-modal-field-value">
                  {activite.type_fiche === 'Activite_Evaluation' ? 'Évaluation' : 'Apprentissage'}
                  {activite.sous_type_evaluation && ` — ${activite.sous_type_evaluation}`}
                </div>
              </div>
            )}
          </div>

          {activite.description_courte && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-modal-field-label" style={{ marginBottom: 'var(--space-2)' }}>Description courte</div>
              <p>{activite.description_courte}</p>
            </div>
          )}

          {activite.description && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-modal-field-label" style={{ marginBottom: 'var(--space-2)' }}>Description complète</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{activite.description}</p>
            </div>
          )}

          {activite.opo_activite && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-modal-field-label" style={{ marginBottom: 'var(--space-2)' }}>Objectif pédagogique</div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>{activite.opo_activite}</p>
            </div>
          )}

          {activite.themes?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              {activite.themes.map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          )}

          {activite.liens_externes?.length > 0 && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <div className="detail-modal-field-label" style={{ marginBottom: 'var(--space-3)' }}>Ressources externes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {activite.liens_externes.map((lien) => (
                  <div key={lien.id} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    {lien.afficher_qrcode && lien.url && (
                      <QRCodeGenerator url={lien.url} size={80} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{lien.libelle}</div>
                      <a href={lien.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <ExternalLink size="var(--icon-size-xs)" strokeWidth="var(--icon-stroke-default)" />
                        Ouvrir le lien
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
