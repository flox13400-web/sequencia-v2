import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, FileText, Layers, Calendar, HelpCircle, Folder
} from 'lucide-react';
import '@/styles/components/layout.css';

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/bibliotheque', label: 'Bibliothèque', icon: BookOpen },
];

const CREATE_ITEMS = [
  { href: '/programme/nouveau', label: 'Nouveau programme', icon: Folder },
  { href: '/sequence/nouvelle', label: 'Nouvelle séquence', icon: Layers },
  { href: '/seance/nouvelle', label: 'Nouvelle séance', icon: Calendar },
  { href: '/activite/nouvelle', label: 'Nouvelle activité', icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (href) => location === href;

  return (
    <aside className="app-sidebar desktop-only">
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
          className={`sidebar-nav-item ${isActive('/aide') ? 'active' : ''}`}
        >
          <HelpCircle size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          Aide
        </Link>
      </nav>
    </aside>
  );
}
