import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Folder, BookOpen, Plus, HelpCircle } from 'lucide-react';
import '@/styles/responsive.css';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: LayoutDashboard },
  { href: '/programmes', label: 'Programmes', icon: Folder },
  { href: '/bibliotheque', label: 'Activités', icon: BookOpen },
  { href: '/activite/nouvelle', label: 'Créer', icon: Plus },
  { href: '/aide', label: 'Aide', icon: HelpCircle },
];

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (href) => {
    if (href === '/') return location === '/';
    return location === href || location.startsWith(href.replace(/s$/, '/'));
  };

  return (
    <nav className="mobile-nav mobile-only" aria-label="Navigation principale">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`mobile-nav-item ${isActive(href) ? 'active' : ''}`}
          aria-label={label}
        >
          <Icon size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
