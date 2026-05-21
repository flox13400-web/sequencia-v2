import { Star, Edit2, Trash2 } from 'lucide-react';
import { useFavorisStore } from '@/stores/favorisStore';
import Tag from '@/components/ui/Tag';
import '@/styles/components/library.css';

const NIVEAU_NOMS = {
  1: 'Mémoriser', 2: 'Comprendre', 3: 'Appliquer',
  4: 'Analyser', 5: 'Évaluer', 6: 'Créer',
};

export default function ActivityCard({ activite, onClick, onEdit, onDelete }) {
  const toggleFavori = useFavorisStore((s) => s.toggleFavori);
  const isFavori = useFavorisStore((s) => s.isFavori('activite', activite.id));

  const handleFavori = (e) => {
    e.stopPropagation();
    toggleFavori('activite', activite.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(activite);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(activite);
  };

  return (
    <article className="library-card" onClick={() => onClick?.(activite)} tabIndex={0} role="button" aria-label={`Voir l'activité : ${activite.titre}`}>
      <div className="library-card-header">
        <h3 className="library-card-title">{activite.titre || 'Sans titre'}</h3>
        <div className="library-card-actions">
          <button
            type="button"
            onClick={handleFavori}
            aria-label={isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="btn btn-ghost btn-sm"
          >
            <Star
              size="var(--icon-size-md)"
              strokeWidth="var(--icon-stroke-default)"
              fill={isFavori ? 'var(--color-warning)' : 'none'}
              color={isFavori ? 'var(--color-warning)' : 'currentColor'}
            />
          </button>
          {onEdit && (
            <button type="button" onClick={handleEdit} aria-label="Modifier" className="btn btn-ghost btn-sm">
              <Edit2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={handleDelete} aria-label="Supprimer" className="btn btn-ghost btn-sm">
              <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            </button>
          )}
        </div>
      </div>

      {activite.description_courte && (
        <p className="library-card-description">{activite.description_courte}</p>
      )}

      <div className="library-card-meta">
        {activite.niveau_action > 0 && (
          <span className="library-card-niveau">
            <span className={`library-card-niveau-badge niveau-${activite.niveau_action}`}>
              {activite.niveau_action}
            </span>
            {NIVEAU_NOMS[activite.niveau_action]}
          </span>
        )}

        {activite.verbe_action && (
          <Tag>{activite.verbe_action}</Tag>
        )}

        {activite.type_fiche === 'Activite_Evaluation' && (
          <Tag variant="warning">Évaluation</Tag>
        )}

        {activite.duree && (
          <Tag>{activite.duree}</Tag>
        )}
      </div>
    </article>
  );
}
