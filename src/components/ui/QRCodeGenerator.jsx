import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

/**
 * Génère un QR code SVG depuis une URL.
 * Utilise l'API canvas/SVG de la lib qrcode — aucune requête réseau.
 */
export default function QRCodeGenerator({ url, size = 128, className = '' }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    setError(null);

    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).catch(() => {
      setError('URL invalide pour le QR code.');
    });
  }, [url, size]);

  if (!url) return null;

  return (
    <div className={className}>
      {error ? (
        <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>{error}</p>
      ) : (
        <canvas ref={canvasRef} width={size} height={size} />
      )}
    </div>
  );
}
