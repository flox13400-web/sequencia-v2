import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Save, ArrowLeft, Plus, AlertTriangle } from 'lucide-react';
import { useSeancesStore } from '@/stores/seancesStore';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import { useActivitesStore } from '@/stores/activitesStore';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import FicheCard from '@/components/builder/FicheCard';
import DureeJauge from '@/components/builder/DureeJauge';
import AssignModal from '@/components/modals/AssignModal';
import { checkSeanceCascade } from '@/utils/alignmentChecker';
import verbesAction from '@/data/verbesAction.json';
import { generateId } from '@/utils/ids';
import '@/styles/components/builder.css';

export default function SeanceBuilderPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'nouvelle';

  const getSeanceById = useSeancesStore((s) => s.getSeanceById);
  const addSeance = useSeancesStore((s) => s.addSeance);
  const updateSeance = useSeancesStore((s) => s.updateSeance);
  const activites = useActivitesStore((s) => s.activites);
  const moveToCorbeille = useCorbeilleStore((s) => s.moveToCorbeille);
  const removeSeance = useSeancesStore((s) => s.removeSeance);
  const seancesCount = useSeancesStore((s) => s.seances.length);

  const [form, setForm] = useState(() => {
    if (isNew) return buildEmpty();
    const existing = getSeanceById(params.id);
    return existing ? { ...existing, fiches: [...(existing.fiches || [])] } : null;
  });
  const [showAssign, setShowAssign] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    setForm((current) => {
      if (current !== null) return current;
      const existing = getSeanceById(params.id);
      return existing ? { ...existing, fiches: [...(existing.fiches || [])] } : buildEmpty();
    });
  }, [seancesCount]);

  useEffect(() => {
    if (isNew) { setForm(buildEmpty()); return; }
    const existing = getSeanceById(params.id);
    setForm(existing ? { ...existing, fiches: [...(existing.fiches || [])] } : null);
  }, [params.id]);

  if (!form) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const verbsForNiveau = verbesAction.find((n) => n.niveau === form.opo_niveau_action)?.verbes || [];

  const addFiche = (activite) => {
    const fiche = {
      id: generateId.fiche(),
      activite_id: activite.id,
      ordre: form.fiches.length,
      override_duree_minutes: activite.duree_minutes || null,
      notes_animation: '',
      type_fiche: activite.type_fiche,
      verbe_action: activite.verbe_action,
    };
    const fiches = [...form.fiches, fiche];
    const duree = fiches.reduce((s, f) => s + (f.override_duree_minutes || 0), 0);
    setForm((f) => ({ ...f, fiches, duree_totale_minutes: duree }));
  };

  const removeFiche = (ficheId) => {
    const fiches = form.fiches.filter((f) => f.id !== ficheId).map((f, i) => ({ ...f, ordre: i }));
    const duree = fiches.reduce((s, f) => s + (f.override_duree_minutes || 0), 0);
    setForm((f) => ({ ...f, fiches, duree_totale_minutes: duree }));
  };

  const alignment = checkSeanceCascade(form, activites);

  const handleSave = () => {
    if (isNew) addSeance(form);
    else updateSeance(form.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!isNew) { moveToCorbeille('seance', form); removeSeance(form.id); }
    navigate('/seances');
  };

  return (
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-ghost" onClick={() => window.history.back()} aria-label="Retour">
            <ArrowLeft size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {isNew ? 'Nouvelle séance' : (form.titre || 'Modifier la séance')}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
            {!isNew && (
              <Button variant="ghost" onClick={handleDelete} aria-label="Supprimer">Supprimer</Button>
            )}
            <Button variant="primary" onClick={handleSave}>
              <Save size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              {saved ? 'Enregistré !' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-6)', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Informations</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <Input label="Titre de la séance" id="titre" value={form.titre}
                onChange={(e) => set('titre', e.target.value)} placeholder="ex: Introduction au design thinking" />
              <Textarea label="Description" id="desc" value={form.description}
                onChange={(e) => set('description', e.target.value)} optional />
            </div>
          </div>

          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Objectif pédagogique opérationnel</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="niveau-seance">Niveau d'action</label>
                  <select id="niveau-seance" className="input-field select-field"
                    value={form.opo_niveau_action}
                    onChange={(e) => set('opo_niveau_action', Number(e.target.value))}>
                    {verbesAction.map((n) => (
                      <option key={n.niveau} value={n.niveau}>{n.niveau} — {n.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="verbe-seance">Verbe d'action</label>
                  <select id="verbe-seance" className="input-field select-field"
                    value={form.opo_verbe_action}
                    onChange={(e) => set('opo_verbe_action', e.target.value)}>
                    <option value="">— Choisir —</option>
                    {verbsForNiveau.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="opo-type">Type d'objectif</label>
                <select id="opo-type" className="input-field select-field"
                  value={form.opo_type} onChange={(e) => set('opo_type', e.target.value)}>
                  <option value="Savoir">Savoir</option>
                  <option value="Savoir-faire">Savoir-faire</option>
                  <option value="Savoir-être">Savoir-être</option>
                </select>
              </div>
              <Textarea label="Formulation de l'objectif" id="opo-phrase" value={form.opo_phrase}
                onChange={(e) => set('opo_phrase', e.target.value)}
                placeholder="À l'issue de cette séance, l'apprenant sera capable de…" optional />
            </div>
          </div>

          <div className="builder-form-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 className="builder-form-section-title" style={{ margin: 0 }}>
                Fiches ({form.fiches.length})
              </h2>
              <Button variant="secondary" size="sm" onClick={() => setShowAssign(true)}>
                <Plus size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                Ajouter une activité
              </Button>
            </div>

            {alignment.violations.length > 0 && (
              <div className="builder-alert builder-alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                <div>
                  {alignment.violations.map((v, i) => <p key={i}>{v.message}</p>)}
                </div>
              </div>
            )}

            {form.fiches.length === 0 ? (
              <button type="button" className="builder-add-button" onClick={() => setShowAssign(true)}>
                <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
                Ajouter une première activité
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {form.fiches.map((fiche) => (
                  <FicheCard key={fiche.id} fiche={fiche} onRemove={removeFiche} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panneau latéral */}
        <aside>
          <div className="builder-form-card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}>
            <h2 className="builder-form-section-title">Durée</h2>
            <DureeJauge current={form.duree_totale_minutes} label="Durée totale" />
          </div>
        </aside>
      </div>

      <AssignModal isOpen={showAssign} onClose={() => setShowAssign(false)} onSelect={addFiche} />
    </main>
  );
}

function buildEmpty() {
  return {
    titre: '', description: '', opo_verbe_action: '', opo_niveau_action: 1,
    opo_type: 'Savoir', opo_phrase: '', fiches: [], duree_totale_minutes: 0,
    is_template: false, template_categorie: null, statut: 'a_consolider',
    qualiopi_score: 0, alertes: [], position_journee: null,
    methodes_repartition: {}, alerte_3070: null,
  };
}
