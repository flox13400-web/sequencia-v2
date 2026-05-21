import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import DashboardPage from '@/pages/DashboardPage';
import LibraryPage from '@/pages/LibraryPage';
import ActivityBuilderPage from '@/pages/ActivityBuilderPage';
import SeanceBuilderPage from '@/pages/SeanceBuilderPage';
import SequenceBuilderPage from '@/pages/SequenceBuilderPage';
import ProgramBuilderPage from '@/pages/ProgramBuilderPage';
import HelpPage from '@/pages/HelpPage';

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
  const [location] = useLocation();

  // Ferme le drawer mobile à chaque changement de route
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Drag & drop global de fichiers .sqa
  useEffect(() => {
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    document.addEventListener('dragover', prevent);
    document.addEventListener('drop', prevent);
    return () => {
      document.removeEventListener('dragover', prevent);
      document.removeEventListener('drop', prevent);
    };
  }, []);

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
        <Sidebar />
      </div>

      <div className="app-body">
        <Sidebar />

        <div className="app-main">
          <Switch>
            <Route path="/" component={DashboardPage} />
            <Route path="/bibliotheque" component={LibraryPage} />

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
    </div>
  );
}
