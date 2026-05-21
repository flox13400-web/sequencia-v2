import { BookOpen, PlusCircle, Upload } from 'lucide-react';
import LogoBrand from '@/components/brand/LogoBrand';
import Button from '@/components/ui/Button';
import '@/styles/components/modals.css';

/**
 * Modal affiché au premier lancement (base vide, onboarding_done = false).
 * Propose trois actions : tuto embarqué, import .sqa, démarrage libre.
 */
export default function OnboardingModal({ isOpen, onImportTuto, onImportFile, onDismiss }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ alignItems: 'center' }}>
      <div
        className="modal-panel"
        style={{ maxWidth: 560 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="modal-body" style={{ padding: 'var(--space-8) var(--space-8) var(--space-6)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <LogoBrand height={48} style={{ margin: '0 auto var(--space-5)' }} />
            <h1
              id="onboarding-title"
              style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}
            >
              Bienvenue dans SEQUENCIA
            </h1>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)', maxWidth: 420, margin: '0 auto' }}>
              Votre atelier de conception pédagogique est vide — comme un carnet neuf.
              Pour commencer, choisissez une option ci-dessous.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <OnboardingOption
              icon={BookOpen}
              title="Découvrir avec le tutoriel SEQUENCIA"
              description="Importe un programme d'exemple (~45 min) pour explorer toutes les fonctionnalités. Fonctionne hors ligne."
              variant="primary"
              onClick={onImportTuto}
            />

            <OnboardingOption
              icon={Upload}
              title="Importer un fichier .sqa"
              description="Vous avez déjà un programme ou une bibliothèque ? Importez-le directement."
              variant="secondary"
              onClick={onImportFile}
            />

            <OnboardingOption
              icon={PlusCircle}
              title="Commencer à créer"
              description="L'atelier est vide. Créez votre première activité ou programme librement."
              variant="secondary"
              onClick={onDismiss}
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
            Des exemples plus complets sont disponibles sur la page{' '}
            <button
              type="button"
              onClick={onDismiss}
              style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline' }}
            >
              Aide
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function OnboardingOption({ icon: Icon, title, description, variant, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-5)',
        borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${variant === 'primary' ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}`,
        background: variant === 'primary' ? 'var(--color-accent-soft)' : 'var(--color-bg)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color var(--transition-fast), background var(--transition-fast)',
        minHeight: 'var(--touch-target-min)',
      }}
    >
      <Icon
        size="var(--icon-size-xl)"
        strokeWidth="var(--icon-stroke-default)"
        color={variant === 'primary' ? 'var(--color-accent)' : 'var(--color-text-muted)'}
        style={{ flexShrink: 0 }}
      />
      <div>
        <div style={{
          fontWeight: 700,
          fontSize: 'var(--font-size-base)',
          color: variant === 'primary' ? 'var(--color-accent)' : 'var(--color-text)',
          marginBottom: 'var(--space-1)',
        }}>
          {title}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-normal)' }}>
          {description}
        </div>
      </div>
    </button>
  );
}
