---
name: doc-mise-en-forme
description: Met en forme un document professionnel et produit le DOCX et le PDF finaux, avec un rendu éditorial sobre et premium (typographie, marges, page de garde, tableaux, sauts de page maîtrisés), en appliquant une charte graphique fournie, améliorée ou par défaut. À utiliser dès qu'il faut générer, mettre en page, redesigner, moderniser ou appliquer une charte à un document, après doc-contenu (ou après le diagnostic de doc-revision pour un document existant), et chaque fois que l'utilisateur demande un fichier Word ou PDF final. Évite le style générique d'IA : pas de bandeaux colorés, pas d'emojis, pas de saut de page à chaque section.
---

# Mise en forme de document

Ce skill transforme un contenu validé en fichiers finis : un **DOCX maître** et un **PDF** obtenu par conversion de ce DOCX. Passer par le DOCX pour produire le PDF garantit que les deux fichiers sont identiques (mêmes césures, mêmes sauts de page).

Il ne modifie jamais le fond. Si un texte paraît faux ou incomplet, le signaler à l'utilisateur au lieu de le corriger ici : c'est le rôle de `doc-contenu` et de `doc-revision`.

## Entrées

- `fiche-cadrage.md` : champs `charte`, `ajustements_charte`, `formats_sortie`, `langue`, `usage`, `a_conserver_intact`.
- `contenu.md` : en-tête YAML, Markdown et blocs sémantiques (`NOTE`, `WARNING`, `DECISION`, `ACTION`, `A-COMPLETER`).
- Pour une tâche `redesign` : le document existant. Extraire son contenu sans le réécrire (`pandoc -t markdown`), le ranger dans `contenu.md` selon le même format, puis procéder normalement.

## Déroulé

1. **Lire** la fiche et le contenu. Si `fiche-cadrage.md` n'a pas de ligne `validation`, revenir à `doc-cadrage`.
2. **Vérifier l'environnement** avec `scripts/check_env.sh` : Node avec le paquet `docx`, LibreOffice (`soffice`), `pdftoppm` (Poppler), `pandoc`. Si un outil manque, donner à l'utilisateur la commande d'installation exacte et attendre ; ne pas livrer sans contrôle visuel.
3. **Résoudre la charte** selon `references/charte.md`. Enregistrer le résultat dans `charte.json` dans le dossier de travail pour qu'il soit réutilisable.
4. **Générer le DOCX** avec `scripts/build_docx.mjs`, qui lit `contenu.md` et `charte.json`. Style et contenu restent séparés : aucune valeur de design n'est écrite en dur dans le script, tout vient des jetons.
5. **Convertir en PDF** avec `scripts/to_pdf.sh`.
6. **Contrôler le rendu** avec `scripts/render_check.sh`, qui convertit les pages en images. Regarder chaque page avec la liste de contrôle de `references/design-premium.md` (section Contrôle visuel). Corriger et régénérer, trois boucles au maximum.
7. **Livrer** dans le dossier `sortie/` : `<slug>.docx` et `<slug>.pdf`, selon `formats_sortie`. Signaler le nombre de blocs `A-COMPLETER` restants, puis passer à `doc-revision` pour le contrôle final.

Si les scripts n'existent pas encore, écrire le générateur directement en suivant les références, puis l'enregistrer dans `scripts/` pour qu'il serve la fois suivante.

## Où trouver les règles

| Besoin | Fichier |
|---|---|
| Valeurs de design, pagination, contrôle visuel | `references/design-premium.md` |
| Appliquer, modifier ou améliorer une charte | `references/charte.md` |
| Ce qu'il ne faut pas faire (style générique) | `references/defauts-visuels.md` |
| Jetons par défaut | `assets/charte-defaut.json` |

Lire `design-premium.md` et `defauts-visuels.md` avant toute génération. Lire `charte.md` dès que la fiche indique une charte fournie ou à améliorer.

## Principes

- **Retenue.** La hiérarchie passe par la taille, l'espace et le poids, pas par la couleur. Une seule couleur d'accent, utilisée avec parcimonie.
- **Cohérence.** Chaque élément de même nature a exactement le même traitement dans tout le document.
- **Pagination soignée.** Pas de titre seul en bas de page, pas de tableau coupé au milieu d'une ligne, pas de demi-pages blanches provoquées par des sauts de page automatiques.
- **Accessibilité.** Contraste suffisant, titres en styles de titre réels (pour la navigation et le sommaire), texte alternatif sur les images.
- **Fidélité.** Un seul contenu, deux formats identiques. Si les polices du DOCX diffèrent de celles du PDF, le signaler.

## Pièges de génération DOCX (bibliothèque `docx`)

Ces erreurs reviennent systématiquement ; les éviter dès le départ.

- La taille de page doit être définie explicitement pour A4 (11 906 × 16 838 DXA) ; ne pas compter sur la valeur par défaut.
- Un tableau a deux largeurs à renseigner : `columnWidths` sur le tableau et `width` sur chaque cellule, en `DXA`. Jamais en pourcentage. La somme des colonnes égale la largeur du tableau.
- Pour un fond de cellule, utiliser `ShadingType.CLEAR`, jamais `SOLID` (rendu noir).
- Les puces et numérotations passent par une configuration `numbering`, jamais par un caractère `•` écrit dans le texte.
- Un saut de page se place dans un `Paragraph`. Pas de `\n` : un paragraphe par ligne.
- Le sommaire n'indexe que les styles de titre intégrés (`HeadingLevel`) ; un style personnalisé a besoin de `outlineLevel`.
- Ne pas fabriquer un filet horizontal avec un tableau : utiliser la bordure basse d'un paragraphe.
- Les images exigent un `type` (`png`, `jpg`) et un texte alternatif.
- Une tabulation alignée à droite sur la même ligne (sommaire, en-tête) utilise une tabulation positionnelle, pas des espaces.
