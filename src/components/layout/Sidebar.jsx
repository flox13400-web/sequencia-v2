import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, FileText, Layers, Calendar, HelpCircle, Folder, Plus
} from 'lucide-react';
import '@/styles/components/layout.css';

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
];

const BROWSE_ITEMS = [
  { href: '/programmes', label: 'Programmes', icon: Folder },
  { href: '/sequences', label: 'Séquences', icon: Layers },
  { href: '/seances', label: 'Séances', icon: Calendar },
  { href: '/bibliotheque', label: 'Activités', icon: BookOpen },
];

const CREATE_ITEMS = [
  { href: '/programme/nouveau', label: 'Nouveau programme', icon: Folder },
  { href: '/sequence/nouvelle', label: 'Nouvelle séquence', icon: Layers },
  { href: '/seance/nouvelle', label: 'Nouvelle séance', icon: Calendar },
  { href: '/activite/nouvelle', label: 'Nouvelle activité', icon: FileText },
];

export default function Sidebar({ inDrawer = false }) {
  const [location] = useLocation();

  const isActive = (href) => {
    if (href === '/') return location === '/';
    return location === href || location.startsWith(href.replace(/s$/, '/'));
  };

  return (
    <aside className={`app-sidebar${inDrawer ? '' : ' desktop-only'}`}>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-nav-item ${isActive(href) ? 'active' : ''}`}
          >
            <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            {label}
          </Link>
        ))}

        <div className="sidebar-section-title">Consulter</div>
        {BROWSE_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-nav-item ${isActive(href) ? 'active' : ''}`}
          >
            <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            {label}
          </Link>
        ))}

        <div className="sidebar-section-title">Créer</div>
        {CREATE_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-nav-item ${isActive(href) ? 'active' : ''}`}
          >
            <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
            {label}
          </Link>
        ))}

        <div className="sidebar-section-title">Autres</div>
        <Link
          href="/aide"
          className={`sidebar-nav-item ${location === '/aide' ? 'active' : ''}`}
        >
          <HelpCircle size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Aide
        </Link>
      </nav>
    </aside>
  );
}
