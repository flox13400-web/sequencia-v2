import '@/styles/components/ui.css';

export default function Toggle({ checked, onChange, label, id }) {
  return (
    <label className="toggle-switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      {label && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{label}</span>}
    </label>
  );
}
