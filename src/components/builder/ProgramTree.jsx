import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { useActivitesStore } from '@/stores/activitesStore';
import SequenceCard from '@/components/builder/SequenceCard';
import SeanceCard from '@/components/builder/SeanceCard';
import FicheCard from '@/components/builder/FicheCard';
import '@/styles/components/builder.css';

function FloatingEvalNode({ activite, onRemove }) {
  return (
    <div className="builder-floating-node">
      <AlertTriangle size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" color="var(--color-warning)" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
          {activite?.titre || 'Évaluation sans titre'}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          Évaluation {activite?.sous_type_evaluation || 'flottante'}
        </div>
      </div>
      {onRemove && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRemove} aria-label="Retirer">
          ×
        </button>
      )}
    </div>
  );
}

function SequenceNode({ sequenceId, onRemoveFromProgramme }) {
  const [expanded, setExpanded] = useState(true);
  const sequence = useSequencesStore((s) => s.sequences.find((sq) => sq.id === sequenceId) ?? null);
  const allSeances = useSeancesStore((s) => s.seances);
  const seances = useMemo(
    () => (sequence?.seances_ids || []).map((id) => allSeances.find((s) => s.id === id)).filter(Boolean),
    [sequence, allSeances]
  );

  if (!sequence) return null;

  return (
    <div className="builder-tree-node">
      <div className="builder-tree-node-header" onClick={() => setExpanded((v) => !v)}>
        {expanded
          ? <ChevronDown size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          : <ChevronRight size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
        }
        <span className="builder-tree-node-title">{sequence.titre || 'Séquence sans titre'}</span>
        <span className="builder-tree-node-meta">{seances.length} séance{seances.length > 1 ? 's' : ''}</span>
        <SequenceCard sequence={sequence} onRemove={onRemoveFromProgramme} showDragHandle={false} />
      </div>
      {expanded && seances.length > 0 && (
        <div className="builder-tree-node-children">
          {seances.map((seance) => (
            <SeanceCard key={seance.id} seance={seance} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgramTree({ programme, onRemoveItem }) {
  const activites = useActivitesStore((s) => s.activites);

  if (!programme?.contenu_ordonne?.length) {
    return (
      <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)', fontSize: 'var(--font-size-base)' }}>
        Ce programme est vide. Ajoutez des séquences ou des évaluations.
      </div>
    );
  }

  return (
    <div className="builder-tree">
      {programme.contenu_ordonne.map((item) => {
        if (item.type === 'sequence') {
          return (
            <SequenceNode
              key={item.ref_id}
              sequenceId={item.ref_id}
              onRemoveFromProgramme={() => onRemoveItem?.(item.ref_id)}
            />
          );
        }
        if (item.type === 'evaluation_flottante') {
          const activite = activites.find((a) => a.id === item.ref_id);
          return (
            <FloatingEvalNode
              key={item.ref_id}
              activite={activite}
              onRemove={() => onRemoveItem?.(item.ref_id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
