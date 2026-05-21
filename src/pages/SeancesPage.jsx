import { Link, useLocation } from 'wouter';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { useSeancesStore } from '@/stores/seancesStore';
import Button from '@/components/ui/Button';
import '@/styles/pages/list.css';

function formatMinutes(m) {
  if (!m) return null;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? min.toString().padStart(2, '0') : ''}` : `${min} min`;
}

export default function SeancesPage() {
  const [, navigate] = useLocation();
  const seances = useSeancesStore((s) => s.seances);

  return (
    <main>
      <div className="page-header">
        <div>
          <h1 className="page-title">Séances</h1>
          <p className="page-subtitle">
            {seances.length} séance{seances.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/seance/nouvelle')}>
          <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Nouvelle
        </Button>
      </div>

      {seances.length === 0 ? (
        <div className="list-empty">
          Aucune séance. Créez-en une ou importez un fichier .sqa depuis le tableau de bord.
        </div>
      ) : (
        <div className="list-grid">
          {seances.map((seance) => (
            <Link key={seance.id} href={`/seance/${seance.id}`} className="list-card">
              <Calendar
                className="list-card-icon"
                size="var(--icon-size-lg)"
                strokeWidth="var(--icon-stroke-default)"
              />
              <div className="list-card-body">
                <div className="list-card-title">{seance.titre || 'Séance sans titre'}</div>
                <div className="list-card-meta">
                  {seance.fiches?.length || 0} fiche{(seance.fiches?.length || 0) !== 1 ? 's' : ''}
                  {seance.opo_verbe_action ? ` · ${seance.opo_verbe_action}` : ''}
                  {formatMinutes(seance.duree_totale_minutes) ? ` · ${formatMinutes(seance.duree_totale_minutes)}` : ''}
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
