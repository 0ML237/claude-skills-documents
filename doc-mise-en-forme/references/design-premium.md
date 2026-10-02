# Design system premium

Contenu : 1. Intention · 2. Page et grille · 3. Typographie · 4. Couleurs · 5. Page de garde · 6. En-tête et pied de page · 7. Sommaire · 8. Tableaux · 9. Blocs sémantiques · 10. Images, listes, code · 11. Pagination · 12. Libellés par langue · 13. Contrôle visuel · 14. Réglages de goût

Les valeurs ci-dessous sont les valeurs par défaut de `assets/charte-defaut.json`. Une charte fournie les remplace, jeton par jeton.

Repères d'unités : 1 mm = 56,7 DXA ; 1 pt = 20 DXA ; les tailles de police de la bibliothèque `docx` sont en demi-points (10,5 pt = 21).

## 1. Intention

Un document d'éditeur ou d'institution se reconnaît à ce qu'il ne montre pas : peu de couleurs, peu d'ornements, beaucoup d'espace, une hiérarchie évidente. Chaque choix ci-dessous sert la lisibilité et le calme visuel.

## 2. Page et grille

- Format A4 : 11 906 × 16 838 DXA.
- Marges : haut 28 mm, bas 25 mm, gauche 25 mm, droite 25 mm. Zone de texte : 160 mm (9 072 DXA).
- Distance de l'en-tête et du pied de page au bord : 12 mm.
- Texte aligné à gauche (drapeau à droite). Le texte justifié demande une césure fine que Word et LibreOffice n'appliquent pas de la même façon : il produit des « rivières » blanches et des écarts entre le DOCX et le PDF.

## 3. Typographie

Deux familles seulement : un serif pour le texte et les titres, un sans-serif pour les éléments secondaires.

| Rôle | Police | Taille | Interligne | Notes |
|---|---|---|---|---|
| Corps | Georgia | 10,5 pt | 1,4 | espace après paragraphe : 6 pt, pas de retrait de première ligne |
| Titre de couverture | Georgia | 30 pt | 1,15 | graisse normale |
| Sous-titre de couverture | Georgia italique | 14 pt | 1,3 | gris |
| Titre 2 | Georgia | 19 pt | 1,15 | graisse normale ; avant 24 pt, après 8 pt |
| Titre 3 | Georgia | 15 pt | 1,15 | graisse normale ; avant 16 pt, après 6 pt |
| Titre 4 | Georgia | 12 pt | 1,2 | gras ; avant 12 pt, après 4 pt |
| En-tête, pied, étiquettes | Arial | 8 pt | 1,2 | petites capitales, espacement des lettres +0,5 pt, gris |
| Légendes | Arial | 8,5 pt | 1,25 | gris ; étiquette (« Tableau 1 ») en petites capitales |
| Tableaux | Georgia | 10 pt | 1,25 | |
| Citation | Georgia italique | 10,5 pt | 1,4 | retrait gauche 12 mm |
| Code | Courier New | 9 pt | 1,2 | fond gris très clair |

Échelle des titres : rapport d'environ 1,25 entre niveaux (12, 15, 19, puis 30 pour la couverture). Les titres 2 et 3 en graisse normale donnent un aspect plus éditorial que le gras ; la taille et l'espace avant portent la hiérarchie.

Pas de souligné pour les titres, pas de majuscules pour les titres de contenu (les petites capitales sont réservées aux éléments secondaires en Arial), pas de couleur pour les titres : ils restent dans la couleur du texte.

## 4. Couleurs

| Jeton | Valeur | Usage |
|---|---|---|
| `texte` | `1A1A1A` | tout le texte principal et les titres |
| `secondaire` | `6B7280` | en-têtes, pieds, légendes, sous-titre |
| `accent` | `1E3A5F` | unique couleur d'accent : filet de couverture, blocs Décision et Action, liens |
| `attention` | `B45309` | blocs Attention et À compléter uniquement |
| `filet` | `D1D5DB` | filet d'en-tête, bordures légères |
| `filet_leger` | `E5E7EB` | lignes de tableau |
| `fond_code` | `F5F5F4` | fond des blocs de code |

Contraste : le texte gris `6B7280` sur blanc atteint un rapport d'environ 4,8:1, acceptable pour du petit texte (seuil de 4,5:1). Ne pas l'éclaircir. Tout remplacement de couleur par une charte doit être vérifié avec le même seuil.

Interdits : dégradés, ombres, plus d'une couleur d'accent, fonds colorés en aplat.

## 5. Page de garde

Aucun aplat de couleur, aucune image décorative. Le logo n'apparaît que s'il est fourni.

De haut en bas :

1. **En haut** : nom de l'organisation (Arial 8 pt, petites capitales, gris). Si un logo est fourni, le placer ici à gauche, hauteur 12 mm, à la place du nom.
2. **Au tiers de la page** (espace avant d'environ 100 mm depuis le haut de la zone de texte) : le titre en Georgia 30 pt, aligné à gauche, largeur maximale de 130 mm.
3. **Sous le titre** : un filet d'accent de 40 mm de long et d'épaisseur 1,5 pt (bordure basse d'un paragraphe de largeur réduite, ou retrait droit), puis le sous-titre en Georgia italique 14 pt gris, s'il existe.
4. **En bas de la zone de texte** : bloc de métadonnées à deux colonnes sans bordure. Colonne gauche : étiquettes en Arial 8 pt petites capitales gris (Référence, Date, Version, Auteur, Confidentialité). Colonne droite : valeurs en Georgia 10 pt. N'afficher que les champs renseignés.

La page de garde n'a ni en-tête ni pied de page. Elle est comptée comme page 1 mais son numéro n'est pas affiché.

## 6. En-tête et pied de page

À partir de la page 2.

- **En-tête** : à gauche, titre court du document (60 caractères au plus, tronqué proprement) ; à droite, niveau de confidentialité s'il est renseigné. Arial 8 pt, petites capitales, gris. Filet bas de 0,5 pt couleur `filet`.
- **Pied de page** : à droite, « Page x sur y ». À gauche, nom de l'organisation si renseigné. Même style que l'en-tête, sans filet.
- Utiliser les champs de numérotation automatique, jamais un numéro écrit en dur.

## 7. Sommaire

Généré seulement si le document compte **12 pages ou plus** hors page de garde. Méthode : générer une première fois sans sommaire, compter les pages au rendu, régénérer avec sommaire si le seuil est atteint.

- Placé après la page de garde, sur sa propre page, suivi d'un saut de page.
- Titre : « Sommaire » (voir libellés), en Georgia 19 pt, sans numérotation de page ni entrée dans le sommaire lui-même.
- Niveaux 2 et 3 seulement. Entrées en Georgia 10,5 pt ; niveau 3 en retrait de 6 mm. Numéros de page alignés à droite avec points de conduite (tabulation positionnelle).
- Les titres doivent utiliser les styles de titre intégrés, sinon le sommaire reste vide.

## 8. Tableaux

Style « livre » : seulement des filets horizontaux, jamais de lignes verticales, jamais de fond alterné.

- Largeur : toute la zone de texte (9 072 DXA), largeurs de colonnes proportionnelles au contenu, somme exacte.
- Filet supérieur : 1 pt, couleur `texte`. Filet sous la ligne d'en-tête : 0,5 pt, couleur `texte`. Filets entre lignes : 0,5 pt, couleur `filet_leger`. Filet inférieur : 1 pt, couleur `texte`.
- Ligne d'en-tête : Arial 8,5 pt en petites capitales, gras, couleur `texte`. Répétée en tête de page si le tableau est coupé.
- Cellules : Georgia 10 pt ; marges internes de 100 DXA à gauche et à droite, 80 DXA en haut et en bas.
- Alignement : texte à gauche ; colonnes entièrement numériques (nombres, pourcentages, montants) alignées à droite, avec le même nombre de décimales.
- Les lignes ne se coupent jamais entre deux pages (`cantSplit`).
- La légende (« Tableau 1 : ... ») se place au-dessus, liée au tableau (`keepNext`).
- Un tableau de plus de 5 colonnes envisage l'orientation paysage pour sa section seulement, ou une réduction de la taille à 9 pt ; ne jamais le laisser déborder.

## 9. Blocs sémantiques

Chaque bloc est un paragraphe avec un filet vertical à gauche, un retrait de 6 mm et un petit libellé. Pas de fond coloré, pas de cadre fermé, pas d'icône.

| Bloc | Filet | Libellé | Couleur du libellé |
|---|---|---|---|
| NOTE | 2,25 pt continu, `9CA3AF` | Note | `secondaire` |
| WARNING | 2,25 pt continu | Attention | `attention` |
| DECISION | 2,25 pt continu | Décision | `accent` |
| ACTION | 2,25 pt continu | Action | `accent` |
| A-COMPLETER | 2,25 pt **pointillé** | À compléter | `attention` |

- Le libellé est en Arial 8 pt gras, petites capitales, sur sa propre ligne ; le texte suit en Georgia 10,5 pt.
- Espace avant et après le bloc : 8 pt. Le bloc reste d'un seul tenant (`keepLines`) et son libellé est lié au texte (`keepNext`).
- Dans un bloc ACTION, mettre en évidence le responsable et l'échéance en les séparant par une ligne propre si le texte les contient.
- Les blocs `A-COMPLETER` restent visibles dans le document : ils sont destinés à être résolus avant diffusion. Le skill en indique le nombre à la livraison.

## 10. Images, listes, code

- **Images** : largeur maximale de la zone de texte, alignées à gauche, texte alternatif obligatoire, légende en dessous (Arial 8,5 pt gris), liée à l'image (`keepNext` sur l'image).
- **Listes à puces** : puce « • » au niveau 1, « – » au niveau 2, retrait suspendu de 6 mm, 3 pt entre les éléments. **Listes numérotées** : « 1. », mêmes retraits. Toujours via la configuration de numérotation.
- **Code** : Courier New 9 pt, fond `fond_code` (`ShadingType.CLEAR`), retrait de 3 mm, lignes conservées ensemble (`keepLines`) tant que le bloc tient sur une page.
- **Liens** : couleur `accent`, soulignés.
- **Citations** : retrait de 12 mm, italique, sans guillemets ajoutés ni filet décoratif.

## 11. Pagination

C'est le point où les documents générés trahissent leur origine. Règles :

- **Titres** : lier chaque titre au paragraphe suivant (`keepNext`) et empêcher leur coupure (`keepLines`) : jamais un titre seul en bas de page.
- **Veuves et orphelines** : contrôle activé sur tous les paragraphes de texte.
- **Pas de saut de page avant chaque section.** Les sections s'enchaînent ; c'est ce qui évite les demi-pages blanches et l'aspect de gabarit.
- **Sauts de page forcés, et seulement ceux-ci** : après la page de garde ; après le sommaire ; avant la première annexe (titre 2 commençant par « Annexe » ou « Appendix »).
- **Tableaux** : lignes insécables, en-tête répétée, légende liée. Les tableaux courts (moins de 8 lignes) restent d'un seul tenant (`keepNext` sur les lignes).
- **Blocs sémantiques** : d'un seul tenant, comme indiqué plus haut.
- **Dernière page** : si elle ne contient que une à trois lignes, essayer une seule fois de réduire l'espace avant les titres 2 de 24 à 18 pt ; sinon, la signaler sans forcer.

## 12. Libellés par langue

| Élément | Français | Anglais |
|---|---|---|
| Sommaire | Sommaire | Contents |
| Pagination | Page x sur y | Page x of y |
| Tableau | Tableau | Table |
| Image | Figure | Figure |
| Annexe | Annexe | Appendix |
| Note | Note | Note |
| Attention | Attention | Warning |
| Décision | Décision | Decision |
| Action | Action | Action |
| À compléter | À compléter | To complete |
| Confidentialité | Confidentialité | Confidentiality |
| Référence | Référence | Reference |

Pour une langue absente de ce tableau, traduire ces libellés et appliquer les conventions typographiques de la langue (voir `doc-contenu/references/regles-ecriture.md` pour le français et l'anglais).

## 13. Contrôle visuel

Après la conversion en PDF, convertir les pages en images (`scripts/render_check.sh`) et vérifier page par page :

1. **Couverture** : titre bien placé, filet aligné, métadonnées en bas, aucun en-tête ni pied de page.
2. **Titres** : aucun titre isolé en bas de page, hiérarchie lisible d'un coup d'œil.
3. **Tableaux** : aucun tableau coupé au milieu d'une ligne, en-tête répétée, pas de débordement à droite, chiffres alignés.
4. **Espaces blancs** : aucune page (hors dernière et hors pages précédant un saut forcé) laissée à plus d'un tiers vide.
5. **Blocs** : filet continu, libellé lié au texte, pas de bloc coupé.
6. **En-tête et pied** : pas de chevauchement avec le texte, numérotation correcte, absents de la couverture.
7. **Polices** : vérifier avec `pdffonts` que Georgia et Arial sont bien embarquées ; sinon, signaler la substitution.
8. **Sommaire** (si présent) : entrées complètes, numéros de page exacts.
9. **Images** : non rognées, légendées, dans la zone de texte.
10. **Cohérence** : mêmes espacements et mêmes styles pour les éléments de même nature.

Corriger, régénérer, recontrôler. Trois boucles au maximum ; au-delà, décrire à l'utilisateur ce qui reste et pourquoi.

## 14. Réglages de goût

Ces valeurs sont un point de départ, pas un jugement définitif. Si le rendu paraît s'écarter de ce que l'utilisateur apprécie, modifier un jeton à la fois dans `charte.json` :

- Lignes trop longues (environ 85 caractères par ligne à 10,5 pt) : passer les marges gauche et droite à 28 mm, ou le corps à 11 pt.
- Page trop dense : augmenter l'interligne à 1,5 et l'espace après paragraphe à 8 pt.
- Titres trop discrets : passer le titre 2 en gras, ou à 20 pt.
- Aspect trop institutionnel : accent plus chaud (bordeaux `7A1F3D`), en vérifiant le contraste.
- Typographie plus distinctive : changer la police du corps par une police installée sur le poste, et prévenir que le DOCX demandera la même police chez le destinataire.
