import { Link } from 'wouter';
import { GripVertical, ChevronRight, Trash2 } from 'lucide-react';
import '@/styles/components/builder.css';

function formatMinutes(m) {
  if (!m) return '';
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? min.toString().padStart(2, '0') : ''}` : `${min} min`;
}

export default function SequenceCard({ sequence, onRemove, showDragHandle = false }) {
  return (
    <div className="builder-sequence-card">
      {showDragHandle && (
        <span className="builder-card-drag-handle" aria-hidden="true">
          <GripVertical size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        </span>
      )}
      <div className="builder-card-content">
        <div className="builder-card-title">{sequence.titre || 'Séquence sans titre'}</div>
        <div className="builder-card-meta">
          {sequence.objectif_verbe_action && <span>{sequence.objectif_verbe_action}</span>}
          {sequence.duree_totale_minutes > 0 && <span> · {formatMinutes(sequence.duree_totale_minutes)}</span>}
          {sequence.seances_ids?.length > 0 && <span> · {sequence.seances_ids.length} séance{sequence.seances_ids.length > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="builder-card-actions">
        <Link href={`/sequence/${sequence.id}`} className="btn btn-ghost btn-sm" aria-label="Ouvrir la séquence">
          <ChevronRight size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        </Link>
        {onRemove && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemove(sequence.id)} aria-label="Retirer la séquence">
            <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
        )}
      </div>
    </div>
  );
}
