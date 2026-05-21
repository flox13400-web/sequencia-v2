/**
 * Export PDF via impression navigateur (window.print).
 * Aucune dépendance externe — utilise @media print de print.css.
 */

/**
 * Déclenche l'impression du contenu de l'élément cible.
 * Ouvre une fenêtre print avec le template injecté.
 *
 * @param {string} htmlContent - HTML complet du template à imprimer
 * @param {string} titre - Titre du document (onglet navigateur)
 */
export function printDocument(htmlContent, titre = 'SEQUENCIA') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenêtres pop-up pour imprimer.');
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${titre}</title>
  <style>
    body { font-family: 'Inter', sans-serif; font-size: 12pt; color: #000; }
    h1 { font-size: 20pt; margin-bottom: 8pt; }
    h2 { font-size: 16pt; margin-top: 16pt; margin-bottom: 6pt; }
    h3 { font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt; }
    p { margin-bottom: 6pt; line-height: 1.5; }
    .section { page-break-inside: avoid; margin-bottom: 16pt; }
    .meta { color: #555; font-size: 10pt; }
    table { width: 100%; border-collapse: collapse; margin: 8pt 0; }
    th, td { border: 1px solid #ccc; padding: 4pt 8pt; font-size: 10pt; }
    th { background: #f0f0f0; font-weight: bold; }
    .tag { display: inline-block; background: #e5e7eb; padding: 1pt 4pt; border-radius: 3pt; font-size: 9pt; margin: 1pt; }
    .niveau-badge { display: inline-block; background: #2563eb; color: white; padding: 1pt 5pt; border-radius: 10pt; font-size: 9pt; font-weight: bold; }
    .qrcode-block { text-align: center; page-break-inside: avoid; }
    .qrcode-block img { width: 80pt; height: 80pt; }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>window.onload = () => { window.print(); window.close(); }<\/script>
</body>
</html>`);
  printWindow.document.close();
}
