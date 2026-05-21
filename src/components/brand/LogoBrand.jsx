import { useState } from 'react';

/**
 * Logo horizontal complet.
 * Affiche le fichier image depuis public/ si disponible,
 * sinon une zone placeholder typographique (intégration logo à venir).
 */
export default function LogoBrand({ height = 36, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: `${height}px`,
          padding: '0 10px',
          background: 'var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          color: '#fff',
          fontWeight: 800,
          fontSize: `${Math.round(height * 0.55)}px`,
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
        }}
        aria-label="SEQUENCIA"
      >
        SEQUENCIA
      </span>
    );
  }

  return (
    <img
      src={import.meta.env.BASE_URL + 'logo-sequencia.png'}
      alt="SEQUENCIA"
      height={height}
      className={className}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}
