import '@/styles/components/ui.css';

export default function Tag({ children, variant = 'default', onRemove, className = '' }) {
  const variantClass = variant !== 'default' ? `tag-${variant}` : '';

  return (
    <span className={`tag ${variantClass} ${className}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'inherit' }}
        >
          ×
        </button>
      )}
    </span>
  );
}
