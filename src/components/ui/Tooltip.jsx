import '@/styles/components/ui.css';

export default function Tooltip({ children, content, className = '' }) {
  if (!content) return children;

  return (
    <span className={`tooltip-wrapper ${className}`}>
      {children}
      <span className="tooltip-content" role="tooltip">{content}</span>
    </span>
  );
}
