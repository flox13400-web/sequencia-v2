export default function LogoMark({ size = 40, className = '' }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'logo-sequencia-mark.png'}
      alt="SEQUENCIA"
      width={size}
      height={size}
      className={className}
      style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
    />
  );
}
