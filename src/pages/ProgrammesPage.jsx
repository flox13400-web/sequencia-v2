import { Link, useLocation } from 'wouter';
import { Plus, Folder, ChevronRight } from 'lucide-react';
import { useProgrammesStore } from '@/stores/programmesStore';
import Button from '@/components/ui/Button';
import '@/styles/pages/list.css';

function formatMinutes(m) {
  if (!m) return null;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? min.toString().padStart(2, '0') : ''}` : `${min} min`;
}

export default function ProgrammesPage() {
  const [, navigate] = useLocation();
  const programmes = useProgrammesStore((s) => s.programmes);

  return (
    <main>
      <div className="page-header">
        <div>
          <h1 className="page-title">Programmes</h1>
          <p className="page-subtitle">
            {programmes.length} programme{programmes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/programme/nouveau')}>
          <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Nouveau
        </Button>
      </div>

      {programmes.length === 0 ? (
        <div className="list-empty">
          Aucun programme. Créez-en un ou importez un fichier .sqa depuis le tableau de bord.
        </div>
      ) : (
        <div className="list-grid">
          {programmes.map((prog) => (
            <Link key={prog.id} href={`/programme/${prog.id}`} className="list-card">
              <Folder
                className="list-card-icon"
                size="var(--icon-size-lg)"
                strokeWidth="var(--icon-stroke-default)"
              />
              <div className="list-card-body">
                <div className="list-card-title">{prog.titre || 'Programme sans titre'}</div>
                <div className="list-card-meta">
                  {prog.contenu_ordonne?.length || 0} séquence{(prog.contenu_ordonne?.length || 0) !== 1 ? 's' : ''}
                  {prog.objectif_verbe_action ? ` · ${prog.objectif_verbe_action}` : ''}
                  {formatMinutes(prog.duree_totale_minutes) ? ` · ${formatMinutes(prog.duree_totale_minutes)}` : ''}
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
