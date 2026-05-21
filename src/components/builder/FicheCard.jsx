import { GripVertical, Trash2 } from 'lucide-react';
import { useActivitesStore } from '@/stores/activitesStore';
import Tag from '@/components/ui/Tag';
import '@/styles/components/builder.css';

export default function FicheCard({ fiche, onRemove }) {
  const activite = useActivitesStore((s) => s.activites.find((a) => a.id === fiche.activite_id) ?? null);

  if (!activite) return null;

  return (
    <div className="builder-fiche-card">
      <span className="builder-card-drag-handle" aria-hidden="true">
        <GripVertical size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
      </span>
      <div className="builder-card-content">
        <div className="builder-card-title">{activite.titre || 'Sans titre'}</div>
        <div className="builder-card-meta" style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
          {activite.verbe_action && <Tag>{activite.verbe_action}</Tag>}
          {activite.type_fiche === 'Activite_Evaluation' && <Tag variant="warning">Évaluation</Tag>}
          {activite.duree_minutes > 0 && <span>{activite.duree_minutes} min</span>}
        </div>
        {fiche.notes_animation && (
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{fiche.notes_animation}</p>
        )}
      </div>
      {onRemove && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemove(fiche.id)} aria-label="Retirer la fiche">
          <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        </button>
      )}
    </div>
  );
}
