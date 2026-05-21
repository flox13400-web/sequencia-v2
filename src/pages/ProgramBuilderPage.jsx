import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Save, ArrowLeft, Plus, AlertTriangle, Download } from 'lucide-react';
import { useProgrammesStore } from '@/stores/programmesStore';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { useActivitesStore } from '@/stores/activitesStore';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import ProgramTree from '@/components/builder/ProgramTree';
import DureeJauge from '@/components/builder/DureeJauge';
import { checkProgrammeAlignment } from '@/utils/alignmentChecker';
import { buildSqaExport, downloadSqa } from '@/utils/exportSqa';
import { printProgrammeFormateur } from '@/components/exports/PrintFormateur';
import verbesAction from '@/data/verbesAction.json';
import '@/styles/components/builder.css';

export default function ProgramBuilderPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'nouveau';

  const getProgrammeById = useProgrammesStore((s) => s.getProgrammeById);
  const addProgramme = useProgrammesStore((s) => s.addProgramme);
  const updateProgramme = useProgrammesStore((s) => s.updateProgramme);
  const removeProgramme = useProgrammesStore((s) => s.removeProgramme);
  const addContenuItem = useProgrammesStore((s) => s.addContenuItem);
  const removeContenuItem = useProgrammesStore((s) => s.removeContenuItem);
  const addSequence = useSequencesStore((s) => s.addSequence);
  const sequences = useSequencesStore((s) => s.sequences);
  const seances = useSeancesStore((s) => s.seances);
  const activites = useActivitesStore((s) => s.activites);
  const moveToCorbeille = useCorbeilleStore((s) => s.moveToCorbeille);

  const programmesCount = useProgrammesStore((s) => s.programmes.length);

  // Initialisation synchrone : évite le flash blanc sur même session
  const [form, setForm] = useState(() => {
    if (isNew) return buildEmpty();
    const existing = getProgrammeById(params.id);
    return existing ? { ...existing } : null;
  });
  const [saved, setSaved] = useState(false);

  // Fallback rehydratation IndexedDB : relance si form toujours null après mise à jour du store
  useEffect(() => {
    if (isNew) return;
    setForm((current) => {
      if (current !== null) return current;
      const existing = getProgrammeById(params.id);
      return existing ? { ...existing } : buildEmpty();
    });
  }, [programmesCount]);

  // Rechargement si l'ID change (navigation vers un autre programme)
  useEffect(() => {
    if (isNew) { setForm(buildEmpty()); return; }
    const existing = getProgrammeById(params.id);
    setForm(existing ? { ...existing } : null);
  }, [params.id]);

  // Re-sync form.contenu_ordonne from store after actions
  useEffect(() => {
    if (!isNew && params.id) {
      const prog = getProgrammeById(params.id);
      if (prog) setForm((f) => ({ ...f, contenu_ordonne: prog.contenu_ordonne }));
    }
  }, [sequences, activites]);

  if (!form) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const verbsForNiveau = verbesAction.find((n) => n.niveau === form.objectif_niveau_action)?.verbes || [];

  const handleSave = () => {
    if (isNew) addProgramme(form);
    else updateProgramme(form.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!isNew) { moveToCorbeille('programme', form); removeProgramme(form.id); }
    navigate('/');
  };

  const handleAddSequence = () => {
    const seq = addSequence({ titre: 'Nouvelle séquence' });
    if (!isNew) {
      addContenuItem(form.id, { type: 'sequence', ref_id: seq.id });
    } else {
      setForm((f) => ({
        ...f,
        contenu_ordonne: [...f.contenu_ordonne, { type: 'sequence', ref_id: seq.id, ordre: f.contenu_ordonne.length }],
      }));
    }
    navigate(`/sequence/${seq.id}`);
  };

  const handleRemoveItem = (refId) => {
    if (!isNew) removeContenuItem(form.id, refId);
    else setForm((f) => ({
      ...f,
      contenu_ordonne: f.contenu_ordonne.filter((i) => i.ref_id !== refId).map((i, idx) => ({ ...i, ordre: idx })),
    }));
  };

  const alignment = checkProgrammeAlignment(form, { activites, seances, sequences });
  const totalMinutes = (form.contenu_ordonne || []).reduce((acc, item) => {
    if (item.type === 'sequence') {
      const seq = sequences.find((s) => s.id === item.ref_id);
      return acc + (seq?.duree_totale_minutes || 0);
    }
    return acc;
  }, 0);

  const handleExportSqa = () => {
    const data = buildSqaExport(form, { activites, seances, sequences });
    downloadSqa(data, form.titre || 'programme-sequencia');
  };

  const handlePrint = () => {
    printProgrammeFormateur(form, { sequences, seances, activites });
  };

  return (
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/')} aria-label="Retour">
            <ArrowLeft size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {isNew ? 'Nouveau programme' : (form.titre || 'Modifier le programme')}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
            {!isNew && (
              <>
                <Button variant="ghost" onClick={handleExportSqa} aria-label="Exporter .sqa">
                  <Download size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
                  Export .sqa
                </Button>
                <Button variant="ghost" onClick={handlePrint}>Imprimer</Button>
                <Button variant="ghost" onClick={handleDelete}>Supprimer</Button>
              </>
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
            <h2 className="builder-form-section-title">Informations générales</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <Input label="Titre du programme" id="titre" value={form.titre}
                onChange={(e) => set('titre', e.target.value)} placeholder="ex: Formation à la médiation pédagogique" />
              <Textarea label="Description" id="desc" value={form.description}
                onChange={(e) => set('description', e.target.value)} optional />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <Input label="Public cible" id="public" value={form.public_cible}
                  onChange={(e) => set('public_cible', e.target.value)} optional />
                <Input label="Durée visée (heures)" id="duree-obj" type="number" min={0}
                  value={form.duree_objectif_heures || ''}
                  onChange={(e) => set('duree_objectif_heures', Number(e.target.value))} optional />
              </div>
              <Textarea label="Prérequis" id="prereq" value={form.prerequis}
                onChange={(e) => set('prerequis', e.target.value)} optional />
            </div>
          </div>

          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Objectif global du programme</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="niveau-prog">Niveau d'action</label>
                  <select id="niveau-prog" className="input-field select-field"
                    value={form.objectif_niveau_action}
                    onChange={(e) => set('objectif_niveau_action', Number(e.target.value))}>
                    {verbesAction.map((n) => (
                      <option key={n.niveau} value={n.niveau}>{n.niveau} — {n.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="verbe-prog">Verbe d'action</label>
                  <select id="verbe-prog" className="input-field select-field"
                    value={form.objectif_verbe_action}
                    onChange={(e) => set('objectif_verbe_action', e.target.value)}>
                    <option value="">— Choisir —</option>
                    {verbsForNiveau.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <Textarea label="Critères d'acquisition de la formation" id="obj-final" value={form.objectif_final}
                onChange={(e) => set('objectif_final', e.target.value)} optional />
            </div>
          </div>

          {/* Arborescence */}
          <div className="builder-form-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 className="builder-form-section-title" style={{ margin: 0 }}>
                Contenu du programme
              </h2>
              <Button variant="secondary" size="sm" onClick={handleAddSequence}>
                <Plus size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                Nouvelle séquence
              </Button>
            </div>

            {alignment.violations.length > 0 && (
              <div className="builder-alert builder-alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                <div>{alignment.violations.map((v, i) => <p key={i}>{v.message}</p>)}</div>
              </div>
            )}
            {alignment.warnings.length > 0 && (
              <div className="builder-alert builder-alert-warning" style={{ marginBottom: 'var(--space-4)' }}>
                <AlertTriangle size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
                <div>{alignment.warnings.map((w, i) => <p key={i}>{w.message}</p>)}</div>
              </div>
            )}

            <ProgramTree programme={form} onRemoveItem={handleRemoveItem} />

            <button type="button" className="builder-add-button" onClick={handleAddSequence} style={{ marginTop: 'var(--space-3)' }}>
              <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Ajouter une séquence
            </button>
          </div>
        </div>

        <aside>
          <div className="builder-form-card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}>
            <h2 className="builder-form-section-title">Avancement</h2>
            <DureeJauge
              current={totalMinutes}
              target={form.duree_objectif_heures || 0}
              label="Durée totale"
            />
            <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              {form.contenu_ordonne?.length || 0} élément{(form.contenu_ordonne?.length || 0) > 1 ? 's' : ''} dans le programme
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function buildEmpty() {
  return {
    titre: '', description: '', duree_objectif_heures: 0, objectif_verbe_action: '',
    objectif_niveau_action: 1, objectif_action: '', objectif_final: '',
    public_cible: '', prerequis: '', prerequis_traces: [], modalite_globale: 'Présentielle',
    contenu_ordonne: [], duree_totale_minutes: 0, progression_objectif: 0,
    is_template: false, statut: 'a_consolider', qualiopi_score: 0,
    contexte_qualiopi_active: false, alertes: [],
    critere2_prerequis_traces: false, critere12_engagement_anchorage: false, critere_psh_adaptable: false,
    calendrier: { journees: [], debut_formation: null, fin_formation: null }, relances_ids: [],
  };
}
