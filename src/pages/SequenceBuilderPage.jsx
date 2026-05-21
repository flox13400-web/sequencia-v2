import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Save, ArrowLeft, Plus, AlertTriangle } from 'lucide-react';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import SeanceCard from '@/components/builder/SeanceCard';
import DureeJauge from '@/components/builder/DureeJauge';
import { checkSequenceCascade } from '@/utils/alignmentChecker';
import verbesAction from '@/data/verbesAction.json';
import '@/styles/components/builder.css';

export default function SequenceBuilderPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'nouvelle';

  const getSequenceById = useSequencesStore((s) => s.getSequenceById);
  const addSequence = useSequencesStore((s) => s.addSequence);
  const updateSequence = useSequencesStore((s) => s.updateSequence);
  const removeSequence = useSequencesStore((s) => s.removeSequence);
  const getSeancesByIds = useSeancesStore((s) => s.getSeancesByIds);
  const addSeance = useSeancesStore((s) => s.addSeance);
  const allSeances = useSeancesStore((s) => s.seances);
  const moveToCorbeille = useCorbeilleStore((s) => s.moveToCorbeille);
  const sequencesCount = useSequencesStore((s) => s.sequences.length);

  const [form, setForm] = useState(() => {
    if (isNew) return buildEmpty();
    const existing = getSequenceById(params.id);
    return existing ? { ...existing } : null;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    setForm((current) => {
      if (current !== null) return current;
      const existing = getSequenceById(params.id);
      return existing ? { ...existing } : buildEmpty();
    });
  }, [sequencesCount]);

  useEffect(() => {
    if (isNew) { setForm(buildEmpty()); return; }
    const existing = getSequenceById(params.id);
    setForm(existing ? { ...existing } : null);
  }, [params.id]);

  if (!form) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const verbsForNiveau = verbesAction.find((n) => n.niveau === form.objectif_niveau_action)?.verbes || [];
  const seances = getSeancesByIds(form.seances_ids || []);
  const alignment = checkSequenceCascade(form, allSeances);

  const addNewSeance = () => {
    const seance = addSeance({ titre: 'Nouvelle séance' });
    setForm((f) => ({ ...f, seances_ids: [...f.seances_ids, seance.id] }));
  };

  const removeSeanceFromSeq = (seanceId) => {
    setForm((f) => ({ ...f, seances_ids: f.seances_ids.filter((id) => id !== seanceId) }));
  };

  const handleSave = () => {
    const duree = seances.reduce((s, sea) => s + (sea.duree_totale_minutes || 0), 0);
    const payload = { ...form, duree_totale_minutes: duree };
    if (isNew) addSequence(payload);
    else updateSequence(form.id, payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!isNew) { moveToCorbeille('sequence', form); removeSequence(form.id); }
    navigate(-1);
  };

  return (
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} aria-label="Retour">
            <ArrowLeft size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {isNew ? 'Nouvelle séquence' : (form.titre || 'Modifier la séquence')}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
            {!isNew && <Button variant="ghost" onClick={handleDelete}>Supprimer</Button>}
            <Button variant="primary" onClick={handleSave}>
              <Save size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              {saved ? 'Enregistré !' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Informations</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <Input label="Titre de la séquence" id="titre" value={form.titre}
                onChange={(e) => set('titre', e.target.value)} placeholder="ex: Module 1 — Bases de la communication" />
              <Textarea label="Description" id="desc" value={form.description}
                onChange={(e) => set('description', e.target.value)} optional />
            </div>
          </div>

          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Objectif de la séquence</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="niveau-seq">Niveau d'action</label>
                  <select id="niveau-seq" className="input-field select-field"
                    value={form.objectif_niveau_action}
                    onChange={(e) => set('objectif_niveau_action', Number(e.target.value))}>
                    {verbesAction.map((n) => (
                      <option key={n.niveau} value={n.niveau}>{n.niveau} — {n.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="verbe-seq">Verbe d'action</label>
                  <select id="verbe-seq" className="input-field select-field"
                    value={form.objectif_verbe_action}
                    onChange={(e) => set('objectif_verbe_action', e.target.value)}>
                    <option value="">— Choisir —</option>
                    {verbsForNiveau.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <Textarea label="Complément de l'objectif" id="obj-action" value={form.objectif_action}
                onChange={(e) => set('objectif_action', e.target.value)} optional />
              <Textarea label="Critères de compétence visée" id="obj-competence" value={form.objectif_competence}
                onChange={(e) => set('objectif_competence', e.target.value)} optional />
            </div>
          </div>

          <div className="builder-form-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 className="builder-form-section-title" style={{ margin: 0 }}>
                Séances ({seances.length})
              </h2>
              <Button variant="secondary" size="sm" onClick={addNewSeance}>
                <Plus size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                Nouvelle séance
              </Button>
            </div>

            {alignment.violations.length > 0 && (
              <div className="builder-alert builder-alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                <div>{alignment.violations.map((v, i) => <p key={i}>{v.message}</p>)}</div>
              </div>
            )}

            {seances.length === 0 ? (
              <button type="button" className="builder-add-button" onClick={addNewSeance}>
                <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
                Ajouter une première séance
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {seances.map((seance) => (
                  <SeanceCard key={seance.id} seance={seance} onRemove={removeSeanceFromSeq} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside>
          <div className="builder-form-card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}>
            <h2 className="builder-form-section-title">Durée totale</h2>
            <DureeJauge current={seances.reduce((s, sea) => s + (sea.duree_totale_minutes || 0), 0)} label="Durée" />
          </div>
        </aside>
      </div>
    </main>
  );
}

function buildEmpty() {
  return {
    titre: '', description: '', objectif_verbe_action: '', objectif_niveau_action: 1,
    objectif_action: '', objectif_competence: '', seances_ids: [], duree_totale_minutes: 0,
    is_template: false, template_categorie: null, statut: 'a_consolider', qualiopi_score: 0, alertes: [],
  };
}
