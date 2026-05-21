import { Link } from 'wouter';
import { GripVertical, ChevronRight, Trash2 } from 'lucide-react';
import '@/styles/components/builder.css';

function formatMinutes(m) {
  if (!m) return '';
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? min.toString().padStart(2, '0') : ''}` : `${min} min`;
}

export default function SeanceCard({ seance, onRemove, showDragHandle = false }) {
  return (
    <div className="builder-seance-card">
      {showDragHandle && (
        <span className="builder-card-drag-handle" aria-hidden="true">
          <GripVertical size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        </span>
      )}
      <div className="builder-card-content">
        <div className="builder-card-title">{seance.titre || 'Séance sans titre'}</div>
        <div className="builder-card-meta">
          {seance.opo_verbe_action && <span>{seance.opo_verbe_action}</span>}
          {seance.duree_totale_minutes > 0 && <span> · {formatMinutes(seance.duree_totale_minutes)}</span>}
          {seance.fiches?.length > 0 && <span> · {seance.fiches.length} fiche{seance.fiches.length > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="builder-card-actions">
        <Link href={`/seance/${seance.id}`} className="btn btn-ghost btn-sm" aria-label="Ouvrir la séance">
          <ChevronRight size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        </Link>
        {onRemove && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemove(seance.id)} aria-label="Retirer la séance">
            <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
        )}
      </div>
    </div>
  );
}
