import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  BookOpen, FolderOpen, Plus, HelpCircle, Folder, Layers, Calendar, FileText, Upload, ChevronRight
} from 'lucide-react';
import { useActivitesStore } from '@/stores/activitesStore';
import { useProgrammesStore } from '@/stores/programmesStore';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { readFileAsText, parseSqaFile, importSqaData } from '@/utils/importSqa';
import Button from '@/components/ui/Button';
import '@/styles/pages/dashboard.css';

const HEX_CELLS = [
  {
    id: 'bibliotheque',
    label: 'Bibliothèque',
    icon: BookOpen,
    href: '/bibliotheque',
    primary: false,
  },
  {
    id: 'creer',
    label: 'Créer',
    icon: Plus,
    primary: true,
    popup: [
      { label: 'Nouveau programme', icon: Folder, href: '/programme/nouveau' },
      { label: 'Nouvelle séquence', icon: Layers, href: '/sequence/nouvelle' },
      { label: 'Nouvelle séance', icon: Calendar, href: '/seance/nouvelle' },
      { label: 'Nouvelle activité', icon: FileText, href: '/activite/nouvelle' },
    ],
  },
  {
    id: 'ouvrir',
    label: 'Ouvrir',
    icon: FolderOpen,
    primary: false,
    popup: [
      { label: 'Importer un fichier .sqa', icon: Upload, action: 'import' },
    ],
  },
  {
    id: 'aide',
    label: 'Aide',
    icon: HelpCircle,
    href: '/aide',
    primary: false,
  },
];

function HexPopup({ items, onClose, onNavigate, onAction }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="hex-popup" ref={ref} role="menu">
      {items.map((item, i) => {
        const Icon = item.icon;
        if (item.divider) return <div key={i} className="hex-popup-divider" />;
        if (item.href) {
          return (
            <button
              key={item.label}
              type="button"
              className="hex-popup-item"
              role="menuitem"
              onClick={() => { onNavigate(item.href); onClose(); }}
            >
              <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              {item.label}
            </button>
          );
        }
        return (
          <button
            key={item.label}
            type="button"
            className="hex-popup-item"
            role="menuitem"
            onClick={() => { onAction(item.action); onClose(); }}
          >
            <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [openPopup, setOpenPopup] = useState(null);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  const activites = useActivitesStore((s) => s.activites);
  const addActivite = useActivitesStore((s) => s.addActivite);
  const programmes = useProgrammesStore((s) => s.programmes);
  const addProgramme = useProgrammesStore((s) => s.addProgramme);
  const sequences = useSequencesStore((s) => s.sequences);
  const addSequence = useSequencesStore((s) => s.addSequence);
  const seances = useSeancesStore((s) => s.seances);
  const addSeance = useSeancesStore((s) => s.addSeance);

  const stats = [
    { label: 'Activités', count: activites.length },
    { label: 'Séances', count: seances.length },
    { label: 'Séquences', count: sequences.length },
    { label: 'Programmes', count: programmes.length },
  ];

  const handleCellClick = (cell) => {
    if (cell.href) { navigate(cell.href); return; }
    if (cell.popup) {
      setOpenPopup(openPopup === cell.id ? null : cell.id);
    }
  };

  const handleImportFile = async (file) => {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const { data, errors } = parseSqaFile(text);
      if (errors.length > 0) { setImportError(errors.join(' ')); return; }
      const result = importSqaData(
        data,
        { addActivite, addSeance, addSequence, addProgramme },
        {
          activiteIds: activites.map((a) => a.id),
          seanceIds: seances.map((s) => s.id),
          sequenceIds: sequences.map((s) => s.id),
          programmeIds: programmes.map((p) => p.id),
        }
      );
      if (result.programmeId) navigate(`/programme/${result.programmeId}`);
      else navigate('/bibliotheque');
    } catch {
      setImportError('Impossible de lire le fichier.');
    }
  };

  const handleAction = (action) => {
    if (action === 'import') fileInputRef.current?.click();
  };

  return (
    <main>
      <div className="dashboard-hero">
        <h1 className="dashboard-hero-title">Bienvenue dans SEQUENCIA</h1>
        <p className="dashboard-hero-subtitle">
          Votre atelier de conception pédagogique — 100% hors ligne, entièrement le vôtre.
        </p>

        {importError && (
          <div className="builder-alert builder-alert-danger" style={{ maxWidth: 480, margin: '0 auto var(--space-4)' }}>
            {importError}
            <button type="button" onClick={() => setImportError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
          </div>
        )}

        <div className="hex-grid" role="navigation" aria-label="Actions principales">
          {HEX_CELLS.map((cell) => {
            const Icon = cell.icon;
            return (
              <div key={cell.id} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`hex-cell ${cell.primary ? 'hex-primary' : ''}`}
                  onClick={() => handleCellClick(cell)}
                  aria-label={cell.label}
                  aria-haspopup={cell.popup ? 'true' : undefined}
                  aria-expanded={cell.popup ? openPopup === cell.id : undefined}
                >
                  <div className="hex-cell-inner">
                    <Icon
                      className="hex-cell-icon"
                      size="var(--icon-size-xl)"
                      strokeWidth="var(--icon-stroke-default)"
                    />
                    <span className="hex-cell-label">{cell.label}</span>
                  </div>
                </button>

                {cell.popup && openPopup === cell.id && (
                  <HexPopup
                    items={cell.popup}
                    onClose={() => setOpenPopup(null)}
                    onNavigate={navigate}
                    onAction={handleAction}
                  />
                )}
              </div>
            );
          })}
        </div>

        {stats.some((s) => s.count > 0) && (
          <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'center', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
            {stats.map(({ label, count }) =>
              count > 0 ? (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-accent)' }}>{count}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <section className="dashboard-formations">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Mes formations</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/programme/nouveau')}>
            <Plus size="var(--icon-size-sm)" strokeWidth="var(--icon-stroke-default)" />
            Nouvelle
          </Button>
        </div>

        {programmes.length === 0 ? (
          <div className="dashboard-formations-empty">
            <Folder size="var(--icon-size-xl)" strokeWidth="var(--icon-stroke-default)" className="dashboard-formations-empty-icon" />
            <p>Aucune formation pour l'instant.</p>
            <p className="dashboard-formations-empty-hint">Créez votre premier programme pédagogique ou importez un fichier&nbsp;.sqa.</p>
            <Button variant="primary" onClick={() => navigate('/programme/nouveau')}>
              <Plus size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              Créer une formation
            </Button>
          </div>
        ) : (
          <div className="dashboard-formations-grid">
            {programmes.map((prog) => (
              <button
                key={prog.id}
                type="button"
                className="dashboard-formation-card"
                onClick={() => navigate(`/programme/${prog.id}`)}
              >
                <Folder
                  size="var(--icon-size-lg)"
                  strokeWidth="var(--icon-stroke-default)"
                  className="dashboard-formation-card-icon"
                />
                <div className="dashboard-formation-card-body">
                  <div className="dashboard-formation-card-title">{prog.titre || 'Formation sans titre'}</div>
                  <div className="dashboard-formation-card-meta">
                    {prog.contenu_ordonne?.length || 0} séquence{(prog.contenu_ordonne?.length || 0) !== 1 ? 's' : ''}
                    {prog.objectif_verbe_action ? ` · ${prog.objectif_verbe_action}` : ''}
                  </div>
                </div>
                <ChevronRight size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
              </button>
            ))}
          </div>
        )}
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept=".sqa,.json"
        style={{ display: 'none' }}
        onChange={(e) => handleImportFile(e.target.files?.[0])}
        aria-label="Importer un fichier .sqa"
      />
    </main>
  );
}
