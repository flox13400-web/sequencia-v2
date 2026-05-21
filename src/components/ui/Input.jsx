import '@/styles/components/ui.css';

export function Input({ label, optional = false, id, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {optional && <span className="form-label-optional">(optionnel)</span>}
        </label>
      )}
      <input id={id} className={`input-field ${className}`} {...props} />
    </div>
  );
}

export function Textarea({ label, optional = false, id, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {optional && <span className="form-label-optional">(optionnel)</span>}
        </label>
      )}
      <textarea id={id} className={`input-field textarea-field ${className}`} {...props} />
    </div>
  );
}

export function Select({ label, optional = false, id, children, className = '', ...props }) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {optional && <span className="form-label-optional">(optionnel)</span>}
        </label>
      )}
      <select id={id} className={`input-field select-field ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
