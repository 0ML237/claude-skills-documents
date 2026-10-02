# Diagnostic d'un document existant

Contenu : 1. Objectif · 2. Lire le document selon son format · 3. Inventaire · 4. Classer les constats · 5. Risques à signaler · 6. Mettre à jour la fiche · 7. Modèle de `diagnostic.md`

## 1. Objectif

Avant d'éditer, restructurer ou redessiner un document existant, savoir précisément ce qu'il contient, ce qui marche, ce qui ne marche pas, et ce qu'on risque d'abîmer. Le diagnostic protège l'utilisateur contre la crainte la plus courante : voir changer ce qu'il ne voulait pas changer.

Il ne corrige rien. Il décrit.

## 2. Lire le document selon son format

| Format | Méthode |
|---|---|
| DOCX | `pandoc -t markdown` pour le texte et la structure. Décompresser l'archive pour lire les styles (`word/styles.xml`), les commentaires (`word/comments.xml`), les révisions en attente (balises `w:ins` et `w:del` dans `word/document.xml`), les champs (sommaire, renvois) et les polices utilisées. |
| PDF | `pdfinfo` (pages, taille), `pdftotext -layout` (texte), `pdffonts` (polices), `pdfimages -list` (images), `pdftoppm` pour regarder les pages. |
| PDF sans texte extractible | Document numérisé : le dire à l'utilisateur. Une reconnaissance de caractères (OCR) est nécessaire, avec un risque d'erreurs à faire valider. Ne pas poursuivre en prétendant avoir lu le contenu. |
| Markdown ou texte | Lecture directe. |
| Autre (Pages, ODT, Google Docs) | Demander l'export en DOCX ou PDF, ou le convertir si l'outil est disponible. |

Toujours **regarder le rendu** (pages converties en images) en plus de lire le texte : un problème de forme se voit mal dans le texte extrait.

## 3. Inventaire

Relever, avec des chiffres :

- nombre de pages, de mots, langue détectée ;
- plan : liste des titres avec leur niveau ;
- tableaux (nombre, taille, cellules fusionnées), images (nombre, présence de texte alternatif), listes ;
- styles et polices utilisés, tailles, couleurs, marges ;
- éléments automatiques : sommaire, numéros de page, renvois, notes de bas de page ;
- commentaires et révisions en attente ;
- en-têtes et pieds de page (identiques sur toutes les pages ou non).

## 4. Classer les constats

### À conserver

Ce qui fonctionne et que l'édition ne doit pas altérer : une structure claire, une formulation juridique figée, des tableaux de données, un passage validé par un tiers, une charte déjà respectée. C'est la base du champ `a_conserver_intact`.

### À corriger, en deux catégories

**Fond** :
- chiffres, totaux ou dates incohérents d'un passage à l'autre ;
- contradictions entre sections ;
- informations manquantes pour le type de document (par exemple un PV sans heure de fin, un cahier des charges sans périmètre exclu) ;
- redites, passages hors sujet ;
- structure confuse ou ordre peu logique ;
- affirmations non étayées dans un document qui exige des preuves.

**Forme** :
- styles incohérents (plusieurs façons de présenter un même type d'élément) ;
- hiérarchie de titres brisée ou simulée avec du gras ;
- mise en page chargée ou fragile ;
- typographie irrégulière ;
- éléments illisibles (contraste faible, images floues).

Classer chaque constat par gravité : **Important** (affecte la compréhension ou la fiabilité), **Utile** (améliorerait nettement le document), **Mineur**. Donner pour chacun sa localisation et une citation courte.

## 5. Risques à signaler

Ce qui rend la reconstruction fragile ou demande une décision :

- **Révisions en attente** : à accepter, rejeter ou conserver ? Ne jamais décider seul.
- **Commentaires** : les traiter, les conserver ou les supprimer ?
- **Tableaux complexes** (cellules fusionnées, imbriqués) : peuvent se reproduire différemment.
- **Images intégrées de basse résolution**, ou liées à un fichier externe absent.
- **Numérotations liées** à des renvois ou à des champs.
- **Plusieurs sections** avec en-têtes ou orientations différentes.
- **Polices absentes** du poste, remplacées à l'affichage.
- **Formulaires, macros, champs dynamiques** : à signaler comme non reproductibles tels quels.
- **Contenu en plusieurs langues**.
- **Document signé ou figé** : toute modification en invalide la valeur.

## 6. Mettre à jour la fiche

Après le diagnostic, modifier `fiche-cadrage.md` :

- `a_conserver_intact` : liste précise, identifiable par des titres de section ou des débuts de phrase exacts. Cette précision est ce qui permet la vérification de fidélité plus tard, donc éviter les formules floues comme « le fond ».
- `elements_manquants` : compléter avec les manques de fond détectés.

Puis présenter à l'utilisateur, en quelques lignes, ce qu'il doit trancher (révisions, commentaires, lacunes) avant de poursuivre.

## 7. Modèle de `diagnostic.md`

```markdown
# Diagnostic

## Identité
- fichier: [nom]
- format: [DOCX | PDF | autre]
- pages: [n] · mots: [n] · langue: [fr | en | ...]
- type apparent: [type et famille]

## Inventaire
- titres: [n] (niveaux 1 à [x])
- tableaux: [n] · images: [n] (dont [n] sans texte alternatif) · listes: [n]
- polices: [liste] · marges: [valeurs] · couleurs principales: [valeurs]
- éléments automatiques: [sommaire, numéros de page, renvois...]
- commentaires: [n] · révisions en attente: [n]

## À conserver
- [élément 1, avec localisation]
- [élément 2]

## À corriger
### Fond
1. [Important] [localisation] : [constat, citation courte]
2. [Utile] ...
### Forme
1. [Utile] [localisation] : [constat]

## Risques
- [risque et décision attendue]

## Décisions attendues de l'utilisateur
- [question 1]
- [question 2]
```
