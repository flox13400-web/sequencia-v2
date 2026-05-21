import { Link, useLocation } from 'wouter';
import { Plus, Layers, ChevronRight } from 'lucide-react';
import { useSequencesStore } from '@/stores/sequencesStore';
import Button from '@/components/ui/Button';
import '@/styles/pages/list.css';

function formatMinutes(m) {
  if (!m) return null;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? min.toString().padStart(2, '0') : ''}` : `${min} min`;
}

export default function SequencesPage() {
  const [, navigate] = useLocation();
  const sequences = useSequencesStore((s) => s.sequences);

  return (
    <main>
      <div className="page-header">
        <div>
          <h1 className="page-title">Séquences</h1>
          <p className="page-subtitle">
            {sequences.length} séquence{sequences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/sequence/nouvelle')}>
          <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Nouvelle
        </Button>
      </div>

      {sequences.length === 0 ? (
        <div className="list-empty">
          Aucune séquence. Créez-en une ou importez un fichier .sqa depuis le tableau de bord.
        </div>
      ) : (
        <div className="list-grid">
          {sequences.map((seq) => (
            <Link key={seq.id} href={`/sequence/${seq.id}`} className="list-card">
              <Layers
                className="list-card-icon"
                size="var(--icon-size-lg)"
                strokeWidth="var(--icon-stroke-default)"
              />
              <div className="list-card-body">
                <div className="list-card-title">{seq.titre || 'Séquence sans titre'}</div>
                <div className="list-card-meta">
                  {seq.seances_ids?.length || 0} séance{(seq.seances_ids?.length || 0) !== 1 ? 's' : ''}
                  {seq.objectif_verbe_action ? ` · ${seq.objectif_verbe_action}` : ''}
                  {formatMinutes(seq.duree_totale_minutes) ? ` · ${formatMinutes(seq.duree_totale_minutes)}` : ''}
                </div>
              </div>
              <ChevronRight
                className="list-card-arrow"
                size="var(--icon-size-md)"
                strokeWidth="var(--icon-stroke-default)"
              />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
