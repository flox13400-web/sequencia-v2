import { Link, useLocation } from 'wouter';
import { Menu, HelpCircle } from 'lucide-react';
import LogoBrand from '@/components/brand/LogoBrand';
import '@/styles/components/layout.css';

export default function Header({ onMenuToggle }) {
  const [location] = useLocation();

  return (
    <header className="app-header">
      <button
        className="btn btn-ghost mobile-only"
        onClick={onMenuToggle}
        aria-label="Ouvrir le menu"
      >
        <Menu size="var(--icon-size-md)" strokeWidth="var(--icon-stroke-default)" />
      </button>

      <Link href="/" className="header-logo-link">
        <LogoBrand height={36} />
      </Link>

      <nav className="header-nav">
        <Link
          href="/aide"
          className={`btn btn-ghost ${location === '/aide' ? 'active' : ''}`}
          aria-label="Aide"
        >
          <HelpCircle
            size="var(--icon-size-md)"
            strokeWidth="var(--icon-stroke-default)"
          />
          <span className="desktop-only">Aide</span>
        </Link>
      </nav>
    </header>
  );
}
