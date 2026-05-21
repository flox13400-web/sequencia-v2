import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Save, ArrowLeft, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useActivitesStore } from '@/stores/activitesStore';
import { useCorbeilleStore } from '@/stores/corbeilleStore';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import verbesAction from '@/data/verbesAction.json';
import { generateId } from '@/utils/ids';
import '@/styles/components/builder.css';

const DUREES = ['< 10 min', '10-15 min', '15-30 min', '30-45 min', '45-60 min', '60-90 min', '> 90 min'];
const MODALITES = ['Présentielle', 'Distancielle', 'Synchrone', 'Asynchrone'];
const CONTEXTES = ['Scolaire', 'Entreprise', 'Montée en compétence', 'Diplomant'];
const TAILLES = ['1', '2-3', '4-6', '7-12', '>12'];
const TYPES_LIEN = ['video', 'image', 'document', 'site', 'autre'];

function TagInput({ label, values = [], onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) { onChange([...values, v]); }
    setInput('');
  };
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <input className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder} style={{ flex: 1 }} />
        <Button type="button" variant="secondary" size="sm" onClick={add}>Ajouter</Button>
      </div>
      {values.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          {values.map((v) => (
            <Tag key={v} onRemove={() => onChange(values.filter((x) => x !== v))}>{v}</Tag>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckboxGroup({ label, options, values = [], onChange }) {
  const toggle = (v) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {options.map((o) => (
          <button key={o} type="button"
            className={`filter-chip ${values.includes(o) ? 'active' : ''}`}
            onClick={() => toggle(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export default function ActivityBuilderPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'nouvelle';

  const getActiviteById = useActivitesStore((s) => s.getActiviteById);
  const addActivite = useActivitesStore((s) => s.addActivite);
  const updateActivite = useActivitesStore((s) => s.updateActivite);
  const removeActivite = useActivitesStore((s) => s.removeActivite);
  const moveToCorbeille = useCorbeilleStore((s) => s.moveToCorbeille);

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) {
      setForm(buildEmpty());
    } else {
      const existing = getActiviteById(params.id);
      setForm(existing ? { ...existing } : buildEmpty());
    }
  }, [params.id]);

  if (!form) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const verbsForNiveau = verbesAction.find((n) => n.niveau === form.niveau_action)?.verbes || [];

  const handleSave = () => {
    if (isNew) {
      addActivite(form);
    } else {
      updateActivite(form.id, form);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!isNew) {
      moveToCorbeille('activite', form);
      removeActivite(form.id);
    }
    navigate('/bibliotheque');
  };

  const addLien = () => {
    const lien = { id: generateId.lien(), url: '', libelle: '', type: 'video', afficher_qrcode: true };
    set('liens_externes', [...(form.liens_externes || []), lien]);
  };

  const updateLien = (id, patch) =>
    set('liens_externes', form.liens_externes.map((l) => l.id === id ? { ...l, ...patch } : l));

  const removeLien = (id) =>
    set('liens_externes', form.liens_externes.filter((l) => l.id !== id));

  return (
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/bibliotheque')} aria-label="Retour">
            <ArrowLeft size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {isNew ? 'Nouvelle activité' : (form.titre || 'Modifier l\'activité')}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
            {!isNew && (
              <Button variant="ghost" onClick={handleDelete} aria-label="Supprimer">
                <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              </Button>
            )}
            <Button variant="primary" onClick={handleSave}>
              <Save size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              {saved ? 'Enregistré !' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 800 }}>

        {/* Infos de base */}
        <div className="builder-form-card">
          <h2 className="builder-form-section-title">Informations de base</h2>
          <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
            <Input label="Titre" id="titre" value={form.titre} onChange={(e) => set('titre', e.target.value)} placeholder="Nom de l'activité" required />
            <Textarea label="Description courte" id="desc-courte" value={form.description_courte} onChange={(e) => set('description_courte', e.target.value)} placeholder="En une phrase…" style={{ minHeight: 60 }} optional />
            <Textarea label="Description complète" id="desc" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Déroulé détaillé, consignes, variantes…" optional />
            <Input label="Apprentissage clé" id="apprent" value={form.apprentissage_cle} onChange={(e) => set('apprentissage_cle', e.target.value)} placeholder="Ce que l'apprenant retient en priorité" optional />
          </div>
        </div>

        {/* Pédagogie */}
        <div className="builder-form-card">
          <h2 className="builder-form-section-title">Objectif pédagogique</h2>
          <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="type-fiche">Type d'activité</label>
              <select id="type-fiche" className="input-field select-field"
                value={form.type_fiche}
                onChange={(e) => set('type_fiche', e.target.value)}>
                <option value="Activite_Apprentissage">Apprentissage</option>
                <option value="Activite_Evaluation">Évaluation</option>
              </select>
            </div>

            {form.type_fiche === 'Activite_Evaluation' && (
              <div className="form-group">
                <label className="form-label" htmlFor="sous-type">Type d'évaluation</label>
                <select id="sous-type" className="input-field select-field"
                  value={form.sous_type_evaluation || ''}
                  onChange={(e) => set('sous_type_evaluation', e.target.value || null)}>
                  <option value="">— Choisir —</option>
                  <option value="diagnostique">Diagnostique</option>
                  <option value="formative">Formative</option>
                  <option value="sommative">Sommative</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="niveau-action">
                Niveau d'action
                <span className="form-label-optional">1 = Mémoriser … 6 = Créer</span>
              </label>
              <select id="niveau-action" className="input-field select-field"
                value={form.niveau_action}
                onChange={(e) => { set('niveau_action', Number(e.target.value)); set('verbe_action', ''); }}>
                {verbesAction.map((n) => (
                  <option key={n.niveau} value={n.niveau}>{n.niveau} — {n.nom}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="verbe-action">Verbe d'action</label>
              <select id="verbe-action" className="input-field select-field"
                value={form.verbe_action}
                onChange={(e) => set('verbe_action', e.target.value)}>
                <option value="">— Choisir un verbe —</option>
                {verbsForNiveau.map((v) => <option key={v} value={v}>{v}</option>)}
                <option value="__libre__">Autre (saisie libre)</option>
              </select>
              {form.verbe_action === '__libre__' && (
                <input className="input-field" style={{ marginTop: 'var(--space-2)' }}
                  placeholder="Saisir un verbe d'action personnalisé"
                  onChange={(e) => set('verbe_action', e.target.value)} />
              )}
            </div>

            <Textarea label="Objectif pédagogique opérationnel" id="opo" value={form.opo_activite}
              onChange={(e) => set('opo_activite', e.target.value)}
              placeholder="À l'issue de cette activité, l'apprenant sera capable de…" optional />
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="builder-form-card">
          <h2 className="builder-form-section-title">Caractéristiques</h2>
          <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="duree">Durée</label>
                <select id="duree" className="input-field select-field" value={form.duree} onChange={(e) => set('duree', e.target.value)}>
                  <option value="">— Choisir —</option>
                  {DUREES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Input label="Durée précise (min)" id="duree-min" type="number" min={0}
                value={form.duree_minutes || ''} onChange={(e) => set('duree_minutes', Number(e.target.value))}
                placeholder="ex: 25" optional />
            </div>
            <CheckboxGroup label="Modalité" options={MODALITES} values={form.modalite} onChange={(v) => set('modalite', v)} />
            <CheckboxGroup label="Contexte" options={CONTEXTES} values={form.contexte} onChange={(v) => set('contexte', v)} />
            <CheckboxGroup label="Taille de groupe" options={TAILLES} values={form.taille_groupe} onChange={(v) => set('taille_groupe', v)} />
            <TagInput label="Thèmes" values={form.themes} onChange={(v) => set('themes', v)} placeholder="ex: Communication" />
            <TagInput label="Matériels" values={form.materiels} onChange={(v) => set('materiels', v)} placeholder="ex: Post-its" />
          </div>
        </div>

        {/* Évaluation (si applicable) */}
        {form.type_fiche === 'Activite_Evaluation' && (
          <div className="builder-form-card">
            <h2 className="builder-form-section-title">Critères d'évaluation</h2>
            <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
              <Input label="Modalité de passation" id="eval-modalite" value={form.eval_modalite}
                onChange={(e) => set('eval_modalite', e.target.value)}
                placeholder="ex: individuelle, en groupe…" optional />
              <Textarea label="Conditions de passation" id="eval-cond" value={form.eval_conditions}
                onChange={(e) => set('eval_conditions', e.target.value)}
                placeholder="Durée, supports autorisés, contexte…" optional />
              <Textarea label="Critères d'évaluation" id="eval-crit" value={form.eval_criteres}
                onChange={(e) => set('eval_criteres', e.target.value)}
                placeholder="Description des critères de réussite…" optional />
            </div>
          </div>
        )}

        {/* Problématiques */}
        <div className="builder-form-card">
          <h2 className="builder-form-section-title">Notes pédagogiques</h2>
          <div className="builder-form" style={{ gap: 'var(--space-4)' }}>
            <Textarea label="Problématiques fréquentes" id="problematique" value={form.problematique || ''}
              onChange={(e) => set('problematique', e.target.value || null)}
              placeholder="Difficultés que rencontrent souvent les apprenants…" optional />
            <Textarea label="Remédiations" id="remediation" value={form.remediation || ''}
              onChange={(e) => set('remediation', e.target.value || null)}
              placeholder="Pistes pour accompagner les apprenants en difficulté…" optional />
          </div>
        </div>

        {/* Liens externes */}
        <div className="builder-form-card">
          <h2 className="builder-form-section-title">Ressources externes</h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Ajoutez des liens vers des vidéos, documents ou sites web. Un QR code sera généré pour chaque lien activé.
          </p>
          {(form.liens_externes || []).map((lien) => (
            <div key={lien.id} style={{ border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)' }}>
                <Input id={`lien-libelle-${lien.id}`} label="Libellé" value={lien.libelle}
                  onChange={(e) => updateLien(lien.id, { libelle: e.target.value })} placeholder="Titre du lien" />
                <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }} onClick={() => removeLien(lien.id)} aria-label="Supprimer ce lien">
                  <Trash2 size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <input className="input-field" placeholder="https://…" value={lien.url}
                  onChange={(e) => updateLien(lien.id, { url: e.target.value })} type="url" />
                <select className="input-field select-field" value={lien.type}
                  onChange={(e) => updateLien(lien.id, { type: e.target.value })} style={{ width: 120 }}>
                  {TYPES_LIEN.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
                <input type="checkbox" checked={lien.afficher_qrcode}
                  onChange={(e) => updateLien(lien.id, { afficher_qrcode: e.target.checked })} />
                Générer un QR code pour ce lien
              </label>
              {lien.url && (
                <a href={lien.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-2)' }}>
                  <ExternalLink size="var(--icon-size-xs)" strokeWidth="var(--icon-stroke-default)" />
                  Tester le lien
                </a>
              )}
            </div>
          ))}
          <button type="button" className="builder-add-button" onClick={addLien}>
            <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            Ajouter un lien externe
          </button>
        </div>

      </div>
    </main>
  );
}

function buildEmpty() {
  return {
    titre: '', description_courte: '', description: '', apprentissage_cle: '',
    age_public: [], duree: '', duree_detail: '', duree_minutes: 0,
    taille_groupe: [], themes: [], materiels: [], contexte: [], modalite: [],
    type_fiche: 'Activite_Apprentissage', sous_type_evaluation: null,
    verbe_action: '', niveau_action: 1, opo_activite: '',
    eval_modalite: '', eval_conditions: '', eval_criteres: '', grille_criteree: null,
    problematique: null, remediation: null, methode_pedagogique: null,
    psh_adaptations: { visuel: { possible: false, commentaire: '' }, auditif: { possible: false, commentaire: '' }, moteur: { possible: false, commentaire: '' }, cognitif: { possible: false, commentaire: '' } },
    statut: 'a_consolider', qualiopi_score: 0, tags: [], notes_perso: '',
    liens_externes: [], origine: 'custom',
  };
}
