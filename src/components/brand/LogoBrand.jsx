export default function LogoBrand({ height = 36, className = '' }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'logo-sequencia.png'}
      alt="SEQUENCIA"
      height={height}
      className={className}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
    />
  );
}
