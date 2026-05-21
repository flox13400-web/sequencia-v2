import { useRef } from 'react';
import { BookOpen, Download, Upload, ExternalLink, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useActivitesStore } from '@/stores/activitesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useProgrammesStore } from '@/stores/programmesStore';
import { readFileAsText, parseSqaFile } from '@/utils/importSqa';

const FAQ = [
  {
    q: 'SEQUENCIA fonctionne-t-il sans connexion internet ?',
    r: 'Oui, entièrement. Après le premier chargement, l\'application fonctionne 100% hors ligne. Vos données sont stockées dans votre navigateur via IndexedDB.',
  },
  {
    q: 'Comment partager un programme avec un collègue ?',
    r: 'Exportez-le au format .sqa (bouton "Export .sqa" dans le programme). Envoyez le fichier par mail ou messagerie. Votre collègue l\'importe via "Ouvrir > Importer un fichier .sqa".',
  },
  {
    q: 'Qu\'est-ce que le niveau d\'action ?',
    r: 'Le niveau d\'action (1 à 6) décrit la complexité cognitive visée : de 1 (Mémoriser) à 6 (Créer). Il permet de vérifier la cohérence pédagogique en cascade entre activités, séances, séquences et programme.',
  },
  {
    q: 'Comment fonctionne la structure Programme → Séquence → Séance → Activité ?',
    r: 'Un programme contient des séquences (modules thématiques). Chaque séquence contient des séances (demi-journées). Chaque séance contient des fiches d\'activité tirées de la bibliothèque.',
  },
  {
    q: 'Mes données sont-elles sauvegardées automatiquement ?',
    r: 'Oui. Chaque modification est sauvegardée automatiquement dans votre navigateur. Pensez à exporter régulièrement vos programmes en .sqa pour en conserver une copie.',
  },
];

export default function HelpPage() {
  const fileInputRef = useRef(null);
  const addActivite = useActivitesStore((s) => s.addActivite);

  const handleImportTuto = async () => {
    try {
      const resp = await import.meta.env.BASE_URL;
      const url = import.meta.env.BASE_URL + 'tutoriels/tuto-sequencia-lite.sqa';
      const res = await fetch(url);
      if (!res.ok) { alert('Le fichier tutoriel n\'est pas encore disponible. Il sera intégré dans une prochaine version.'); return; }
      const text = await res.text();
      const { data, errors } = parseSqaFile(text);
      if (errors.length > 0) { alert(errors.join('\n')); return; }
      if (data.dictionnaires?.activites) {
        data.dictionnaires.activites.forEach((a) => addActivite({ ...a, origine: 'importee_sqa' }));
      }
      alert('Tutoriel importé avec succès !');
    } catch {
      alert('Le fichier tutoriel n\'est pas encore disponible.');
    }
  };

  const handleImportFile = async (file) => {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const { data, errors } = parseSqaFile(text);
      if (errors.length > 0) { alert(errors.join('\n')); return; }
      if (data.dictionnaires?.activites) {
        data.dictionnaires.activites.forEach((a) => addActivite({ ...a, origine: 'importee_sqa' }));
      }
      alert('Fichier importé avec succès !');
    } catch {
      alert('Impossible de lire le fichier.');
    }
  };

  return (
    <main style={{ maxWidth: 720 }}>
      <div className="page-header">
        <h1 className="page-title">Aide & Ressources</h1>
        <p className="page-subtitle">Documentation, tutoriels et liens utiles</p>
      </div>

      {/* Tuto embarqué */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <BookOpen size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" color="var(--color-accent)" />
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Programme tutoriel</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 'var(--line-height-relaxed)' }}>
          Découvrez SEQUENCIA avec un programme tutoriel complet (~45 min). Il contient des activités, séances et séquences d'exemple pour vous guider dans vos premières créations.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={handleImportTuto}>
            <Download size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            Importer le tutoriel SEQUENCIA
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            Importer un fichier .sqa
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept=".sqa,.json" style={{ display: 'none' }}
          onChange={(e) => handleImportFile(e.target.files?.[0])} />
      </section>

      {/* Exemples étendus */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <FileText size="var(--icon-size-lg)" strokeWidth="var(--icon-stroke-default)" color="var(--color-accent)" />
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Exemples étendus</h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', lineHeight: 'var(--line-height-relaxed)' }}>
          Des programmes d'exemples complets sont disponibles sur le dépôt GitHub <strong>sequencia-exemples</strong>.
          Téléchargez le fichier .sqa souhaité, puis importez-le dans SEQUENCIA via le bouton ci-dessus ou par glisser-déposer.
        </p>
        <div style={{ background: 'var(--color-bg-muted)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            Le lien ci-dessous ouvre le dépôt GitHub dans votre navigateur. SEQUENCIA ne télécharge rien automatiquement.
          </p>
          <a
            href="https://github.com/flox13400-web/sequencia-exemples"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent)', fontWeight: 600, fontSize: 'var(--font-size-base)' }}
          >
            <ExternalLink size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            Ouvrir la bibliothèque d'exemples (GitHub)
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 'var(--space-10)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {FAQ.map(({ q, r }) => (
            <details key={q} style={{ border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <summary style={{ padding: 'var(--space-4) var(--space-5)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-base)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {q}
              </summary>
              <p style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)', borderTop: '1px solid var(--color-border)', margin: 0 }}>
                {r}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Transparence */}
      <section>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Conception</h2>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)' }}>
          SEQUENCIA est un outil de conception pédagogique 100% hors ligne, libre et gratuit. Les choix d'architecture sont documentés dans le fichier <code>DECISIONS.md</code> du dépôt GitHub.
        </p>
        <a href="https://github.com/flox13400-web/sequencia-v2" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent)', marginTop: 'var(--space-3)', fontWeight: 600 }}>
          <ExternalLink size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Voir le code source (GitHub)
        </a>
      </section>
    </main>
  );
}
