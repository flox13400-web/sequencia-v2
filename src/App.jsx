import { useState, useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import DashboardPage from '@/pages/DashboardPage';
import LibraryPage from '@/pages/LibraryPage';
import ProgrammesPage from '@/pages/ProgrammesPage';
import SequencesPage from '@/pages/SequencesPage';
import SeancesPage from '@/pages/SeancesPage';
import ActivityBuilderPage from '@/pages/ActivityBuilderPage';
import SeanceBuilderPage from '@/pages/SeanceBuilderPage';
import SequenceBuilderPage from '@/pages/SequenceBuilderPage';
import ProgramBuilderPage from '@/pages/ProgramBuilderPage';
import HelpPage from '@/pages/HelpPage';
import OnboardingModal from '@/components/modals/OnboardingModal';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useActivitesStore } from '@/stores/activitesStore';
import { useSeancesStore } from '@/stores/seancesStore';
import { useSequencesStore } from '@/stores/sequencesStore';
import { useProgrammesStore } from '@/stores/programmesStore';
import { parseSqaFile, readFileAsText, importSqaData } from '@/utils/importSqa';

function NotFoundPage() {
  return (
    <main style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
      <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)' }}>Page introuvable</h1>
      <a href="/" style={{ color: 'var(--color-accent)' }}>Retour à l'accueil</a>
    </main>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  const fileInputRef = useRef(null);
  const { showOnboarding, dismissOnboarding } = useOnboarding();
  const addActivite = useActivitesStore((s) => s.addActivite);
  const addSeance = useSeancesStore((s) => s.addSeance);
  const addSequence = useSequencesStore((s) => s.addSequence);
  const addProgramme = useProgrammesStore((s) => s.addProgramme);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Drag & drop global de fichiers .sqa
  useEffect(() => {
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = async (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (!file || (!file.name.endsWith('.sqa') && !file.name.endsWith('.json'))) return;
      try {
        const text = await readFileAsText(file);
        const { data, errors } = parseSqaFile(text);
        if (errors.length > 0) return;
        const { activites } = useActivitesStore.getState();
        const { seances } = useSeancesStore.getState();
        const { sequences } = useSequencesStore.getState();
        const { programmes } = useProgrammesStore.getState();
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
        else if (result.activites > 0) navigate('/bibliotheque');
      } catch { /* non bloquant */ }
    };
    document.addEventListener('dragover', prevent);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragover', prevent);
      document.removeEventListener('drop', handleDrop);
    };
  }, [addActivite, addSeance, addSequence, addProgramme, navigate]);

  const handleOnboardingImportFile = () => {
    dismissOnboarding();
    fileInputRef.current?.click();
  };

  const handleOnboardingImportTuto = async () => {
    dismissOnboarding();
    try {
      const url = import.meta.env.BASE_URL + 'tutoriels/tuto-sequencia-lite.sqa';
      const res = await fetch(url);
      if (!res.ok) return;
      const text = await res.text();
      const { data } = parseSqaFile(text);
      if (!data) return;
      const { activites } = useActivitesStore.getState();
      const { seances } = useSeancesStore.getState();
      const { sequences } = useSequencesStore.getState();
      const { programmes } = useProgrammesStore.getState();
      importSqaData(
        data,
        { addActivite, addSeance, addSequence, addProgramme },
        {
          activiteIds: activites.map((a) => a.id),
          seanceIds: seances.map((s) => s.id),
          sequenceIds: sequences.map((s) => s.id),
          programmeIds: programmes.map((p) => p.id),
        }
      );
    } catch { /* fichier pas encore disponible */ }
  };

  return (
    <div className="app-shell">
      <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />

      {/* Drawer mobile */}
      <div
        className={`mobile-drawer-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className={`mobile-drawer ${sidebarOpen ? 'open' : ''}`} role="dialog" aria-label="Menu de navigation">
        <Sidebar inDrawer />
      </div>

      <div className="app-body">
        <Sidebar />

        <div className="app-main">
          <Switch>
            <Route path="/" component={DashboardPage} />
            <Route path="/bibliotheque" component={LibraryPage} />
            <Route path="/programmes" component={ProgrammesPage} />
            <Route path="/sequences" component={SequencesPage} />
            <Route path="/seances" component={SeancesPage} />

            <Route path="/activite/nouvelle" component={ActivityBuilderPage} />
            <Route path="/activite/:id" component={ActivityBuilderPage} />

            <Route path="/seance/nouvelle" component={SeanceBuilderPage} />
            <Route path="/seance/:id" component={SeanceBuilderPage} />

            <Route path="/sequence/nouvelle" component={SequenceBuilderPage} />
            <Route path="/sequence/:id" component={SequenceBuilderPage} />

            <Route path="/programme/nouveau" component={ProgramBuilderPage} />
            <Route path="/programme/:id" component={ProgramBuilderPage} />

            <Route path="/aide" component={HelpPage} />

            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>

      <Footer />
      <MobileNav />

      <OnboardingModal
        isOpen={showOnboarding}
        onImportTuto={handleOnboardingImportTuto}
        onImportFile={handleOnboardingImportFile}
        onDismiss={dismissOnboarding}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".sqa,.json"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const text = await readFileAsText(file);
          const { data } = parseSqaFile(text);
          if (data) {
            const { activites } = useActivitesStore.getState();
            const { seances } = useSeancesStore.getState();
            const { sequences } = useSequencesStore.getState();
            const { programmes } = useProgrammesStore.getState();
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
            else if (result.activites > 0) navigate('/bibliotheque');
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}
