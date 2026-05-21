import { useState } from 'react';

/**
 * Pictogramme carré seul.
 * Fallback placeholder si le fichier image n'est pas encore disponible.
 */
export default function LogoMark({ size = 40, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size}px`,
          height: `${size}px`,
          background: 'var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          color: '#fff',
          fontWeight: 900,
          fontSize: `${Math.round(size * 0.45)}px`,
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
          flexShrink: 0,
        }}
        aria-label="SEQUENCIA"
      >
        S
      </span>
    );
  }

  return (
    <img
      src={import.meta.env.BASE_URL + 'logo-sequencia-mark.png'}
      alt="SEQUENCIA"
      width={size}
      height={size}
      className={className}
      style={{ width: `${size}px`, height: `${size}px`, display: 'block', flexShrink: 0 }}
      onError={() => setFailed(true)}
    />
  );
}
