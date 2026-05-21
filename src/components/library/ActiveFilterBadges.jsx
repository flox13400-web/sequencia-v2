import { useFiltresStore } from '@/stores/filtresStore';
import Tag from '@/components/ui/Tag';
import '@/styles/components/library.css';

const NIVEAU_NOMS = {
  1: 'Mémoriser', 2: 'Comprendre', 3: 'Appliquer',
  4: 'Analyser', 5: 'Évaluer', 6: 'Créer',
};

export default function ActiveFilterBadges() {
  const filtres = useFiltresStore((s) => s.filtres);
  const toggleArrayFiltre = useFiltresStore((s) => s.toggleArrayFiltre);
  const setFiltre = useFiltresStore((s) => s.setFiltre);

  const badges = [];

  filtres.themes.forEach((t) => badges.push({ key: `theme-${t}`, label: t, remove: () => toggleArrayFiltre('themes', t) }));
  filtres.niveaux_action.forEach((n) => badges.push({ key: `niveau-${n}`, label: `Niveau ${n} — ${NIVEAU_NOMS[n]}`, remove: () => toggleArrayFiltre('niveaux_action', n) }));
  filtres.type_fiche.forEach((t) => badges.push({ key: `type-${t}`, label: t === 'Activite_Evaluation' ? 'Évaluation' : 'Apprentissage', remove: () => toggleArrayFiltre('type_fiche', t) }));
  filtres.modalite.forEach((m) => badges.push({ key: `modalite-${m}`, label: m, remove: () => toggleArrayFiltre('modalite', m) }));
  if (filtres.favoris_only) badges.push({ key: 'favoris', label: 'Favoris', remove: () => setFiltre('favoris_only', false) });

  if (badges.length === 0) return null;

  return (
    <div className="active-filter-badges">
      {badges.map(({ key, label, remove }) => (
        <Tag key={key} variant="accent" onRemove={remove}>{label}</Tag>
      ))}
    </div>
  );
}
