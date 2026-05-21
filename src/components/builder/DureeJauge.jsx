import '@/styles/components/builder.css';

function formatMinutes(minutes) {
  if (!minutes) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export default function DureeJauge({ current, target, label }) {
  const targetMinutes = (target || 0) * 60;
  const ratio = targetMinutes > 0 ? Math.min(current / targetMinutes, 1) : 0;
  const over = targetMinutes > 0 && current > targetMinutes;
  const pct = Math.round(ratio * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>{label || 'Durée'}</span>
        <span style={{ fontWeight: 600, color: over ? 'var(--color-danger)' : 'var(--color-text)' }}>
          {formatMinutes(current)} {targetMinutes > 0 && `/ ${formatMinutes(targetMinutes)}`} {pct > 0 && `(${pct}%)`}
        </span>
      </div>
      {targetMinutes > 0 && (
        <div className="builder-duree-jauge">
          <div
            className={`builder-duree-jauge-fill ${over ? 'over' : ''}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
