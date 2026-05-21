import { printDocument } from '@/utils/exportPdf';
import { getNomNiveau } from '@/utils/alignmentChecker';

/**
 * Génère et déclenche l'impression du programme complet (vue formateur).
 * Aucun rendu JSX — produit du HTML pur injecté dans window.print().
 */
export function printProgrammeFormateur(programme, { sequences, seances, activites }) {
  const seancesMap = new Map(seances.map((s) => [s.id, s]));
  const activitesMap = new Map(activites.map((a) => [a.id, a]));
  const sequencesMap = new Map(sequences.map((s) => [s.id, s]));

  let html = `
    <h1>${programme.titre || 'Programme sans titre'}</h1>
    <p class="meta">
      ${programme.public_cible ? `Public : ${programme.public_cible}` : ''}
      ${programme.objectif_niveau_action ? ` | Niveau : ${getNomNiveau(programme.objectif_niveau_action)}` : ''}
    </p>
    ${programme.objectif_final ? `<p><em>${programme.objectif_final}</em></p>` : ''}
  `;

  for (const item of programme.contenu_ordonne || []) {
    if (item.type === 'sequence') {
      const seq = sequencesMap.get(item.ref_id);
      if (!seq) continue;
      html += `<div class="section"><h2>${seq.titre || 'Séquence'}</h2>`;
      if (seq.objectif_action) html += `<p class="meta">Objectif : ${seq.objectif_action}</p>`;

      for (const seanceId of seq.seances_ids || []) {
        const seance = seancesMap.get(seanceId);
        if (!seance) continue;
        html += `<div class="section" style="margin-left:16pt"><h3>${seance.titre || 'Séance'}</h3>`;
        if (seance.opo_phrase) html += `<p class="meta">${seance.opo_phrase}</p>`;

        for (const fiche of seance.fiches || []) {
          const act = activitesMap.get(fiche.activite_id);
          if (!act) continue;
          html += `
            <div style="margin:6pt 0 6pt 16pt; padding:4pt 8pt; border-left:3px solid #2563eb;">
              <strong>${act.titre}</strong>
              ${act.duree_detail ? ` <span class="meta">(${act.duree_detail})</span>` : ''}
              ${act.verbe_action ? `<br/><span class="meta">Verbe d'action : ${act.verbe_action}</span>` : ''}
              ${fiche.notes_animation ? `<br/><span class="meta">Note : ${fiche.notes_animation}</span>` : ''}
            </div>`;
        }
        html += '</div>';
      }
      html += '</div>';
    }

    if (item.type === 'evaluation_flottante') {
      const act = activitesMap.get(item.ref_id);
      if (!act) continue;
      html += `
        <div class="section" style="border:2px dashed #d97706; padding:8pt; border-radius:4pt;">
          <strong>Évaluation ${act.sous_type_evaluation || ''} : ${act.titre}</strong>
          ${act.eval_criteres ? `<p class="meta">${act.eval_criteres}</p>` : ''}
        </div>`;
    }
  }

  printDocument(html, programme.titre || 'Programme SEQUENCIA');
}

export default function PrintFormateur() {
  return null;
}
