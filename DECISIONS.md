# DECISIONS.md — Choix d'architecture SEQUENCIA V2

Ce fichier documente les décisions techniques et produit prises au fil du développement.
Chaque entrée est datée et justifiée pour permettre de reprendre le contexte facilement.

---

## 2026-05-21 — Choix de stack V2.0

**Décision :** React 19 + Vite 6 + Wouter + Zustand + IndexedDB (idb) + lucide-react + qrcode

**Justification :**
- React 19 : continuité V1, écosystème mature, Claude Code le connaît bien.
- Vite : bundler rapide, continuité V1.
- Wouter (~2 Ko) : remplace React Router (60+ Ko). Suffisant pour le nombre de routes SEQUENCIA. Économise du bundle pour l'usage PWA hors ligne.
- Zustand : stores simples, immutables, bien maîtrisés par Claude Code. Middleware `persist` + IndexedDB = persistance sans code boilerplate.
- IndexedDB via `idb` : supprime la limite 5-10 Mo du localStorage. Requêtes indexées utiles pour la bibliothèque (filtres thèmes, verbes, etc.).
- lucide-react : bibliothèque d'icônes cohérente, tree-shaking, licence ISC, ~1500 icônes. Une source unique pour toutes les icônes UI.
- qrcode : génération de QR codes côté client, aucun appel réseau.

---

## 2026-05-21 — Schéma IndexedDB complet dès V2.0

**Décision :** Les 10 object stores (activites, seances, sequences, programmes, journees_planifiees, relances_pedagogiques, brouillons, settings, corbeille, favoris) sont créés en V2.0 même si certains ne sont alimentés qu'à partir de V2.1+.

**Justification :** Évite les migrations douloureuses entre jalons. Un schema_version dans settings contrôle les migrations légères (recalculs, activation de champs). Les jalons futurs ne font qu'activer des champs déjà présents dans IndexedDB.

---

## 2026-05-21 — Logo uniquement via fichier image

**Décision :** Les composants `LogoBrand` et `LogoMark` sont de simples wrappers `<img>` pointant vers les fichiers PNG/SVG de `public/`.

**Justification :** En V1, un bug avait causé l'affichage d'un curseur à la place du logo car Claude Code avait généré du SVG inline. Cette règle est inscrite dans l'architecture pour éviter toute régression.

---

## 2026-05-21 — Application 100% offline-only

**Décision :** Aucun `fetch()` sortant depuis le code applicatif SEQUENCIA. Exception unique : les polices Google Fonts chargées via `<link>` dans index.html et cachées par le Service Worker.

**Justification :** SEQUENCIA est un outil professionnel utilisé potentiellement en environnement sans réseau (salles de formation, trains, avions). La philosophie offline-first garantit une expérience fiable dans tous les contextes.

Les partages de contenu passent par :
1. Export .sqa → envoi par mail/messagerie (navigateur fait le travail)
2. Liens `<a href download>` vers GitHub (navigateur télécharge)
3. Drag & drop de fichiers depuis l'OS

---

## 2026-05-21 — Terminologie UI : jamais "Bloom"

**Décision :** Le mot "Bloom" ne doit jamais apparaître dans les chaînes affichées à l'utilisateur (labels, tooltips, messages, exports).

**Justification :** La taxonomie de Bloom est le cadre théorique sous-jacent, mais le jargon académique peut intimider les formateurs non spécialistes. SEQUENCIA utilise "verbe d'action", "niveau d'action" (1-6) et "objectif pédagogique" comme vocabulaire UI.

Le terme "Bloom" est autorisé dans : les commentaires de code, les noms de fichiers internes, les documents d'architecture, les conversations entre développeurs.

---

## 2026-05-21 — Zéro CSS inline dans les JSX

**Décision :** Aucun style inline dans les composants `.jsx`. Tout le CSS passe par les fichiers `.css` et les variables `tokens.css`.

**Justification :** Maintenabilité, cohérence du design system, performance (CSS mis en cache par le navigateur), respect du principe de séparation des préoccupations.

**Exception temporaire V2.0 :** Quelques styles inline simples (`display: flex`, `gap`, `marginBottom`) ont été acceptés dans les pages pendant le scaffolding initial pour aller vite. Ils seront factorisés dans les CSS dédiés à mesure que les composants se stabilisent.

---

## 2026-05-21 — Typage JSDoc (pas TypeScript)

**Décision :** Le projet utilise JSDoc pour typer les entités métier, pas TypeScript.

**Justification :** Continuité avec la V1. JSDoc offre l'autocomplétion et la détection d'erreurs dans VS Code sans transpilation, ce qui simplifie le setup et l'outillage pour un projet solo ou en petit groupe.

---

## 2026-05-21 — Évaluations sommatives comme nœuds flottants

**Décision :** Les évaluations sommatives et diagnostiques globales sont des nœuds de `contenu_ordonne` dans le programme (type `evaluation_flottante`), jamais imbriquées dans une séquence ou séance.

**Justification pédagogique :** L'évaluation sommative valide l'objectif global du programme, pas d'une séquence particulière. Sa position dans le programme (avant, milieu, fin) est un choix pédagogique de l'auteur. La structure `contenu_ordonne` mixte (séquences + évaluations flottantes) reflète cette réalité.

**Règle d'alignement associée :** `eval_sommative.niveau_action === programme.objectif_niveau_action` (strictement égal, pas ≤).

---

## À venir

- V2.1 : Activation du mode Audit Qualiopi (champs `methode_pedagogique`, `psh_adaptations`, `statut`, `qualiopi_score`)
- V2.2 : Intégration de la courbe d'attention (Recharts ou D3 — à arbitrer en début de jalon)
- V2.3 : Courbe d'oubli Ebbinghaus + export iCal
