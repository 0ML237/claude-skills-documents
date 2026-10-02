# Contrôle final

Contenu : 1. Préparation · 2. Les cinq familles de contrôle · 3. Gravité · 4. Ce qui peut être corrigé automatiquement · 5. Boucle de correction · 6. Verdict · 7. Modèle de `rapport-controle.md`

## 1. Préparation

Réunir : `fiche-cadrage.md`, `contenu.md`, les sources d'origine (notes, document existant), les fichiers de `sortie/` (DOCX et PDF), `charte.json`, et les images des pages si elles existent. Lancer `scripts/verifier.py`. Lire ses résultats, puis faire les contrôles qui demandent du jugement.

Juger le résultat par rapport à la **fiche et aux sources**, pas par rapport à ce que le générateur voulait faire.

## 2. Les cinq familles de contrôle

### A. Conformité à la fiche

- [ ] Le type de document correspond au champ `type_document` et la structure suit celle de la famille.
- [ ] La langue du document est celle de la fiche, sans mélange involontaire.
- [ ] Le niveau de formalité et le ton demandés sont tenus du début à la fin.
- [ ] Les formats de sortie demandés existent (PDF, DOCX, ou les deux).
- [ ] Les mentions obligatoires (références, signatures, mentions légales) sont présentes.
- [ ] La longueur respecte la contrainte de la fiche.
- [ ] La charte appliquée correspond au champ `charte` (et aux ajustements validés).
- [ ] Les éléments listés dans `elements_manquants` sont traités : fournis, ou signalés par un bloc `A-COMPLETER`.

### B. Intégrité du contenu

C'est la famille la plus importante : elle détecte les informations qui n'existent pas dans les sources.

- [ ] Chaque nom propre, date, chiffre, montant, pourcentage et décision se retrouve dans les sources. Les citer en cas de doute.
- [ ] Aucune affirmation n'a été ajoutée au-delà de ce que disent les sources (interprétation présentée comme un fait, généralisation, détail plausible mais inventé).
- [ ] Les calculs sont exacts : totaux, pourcentages, durées, échéances.
- [ ] Les attributions sont justes : qui a dit, qui décide, qui est responsable.
- [ ] Les blocs `A-COMPLETER` restants sont comptés et listés avec leur localisation.
- [ ] Rien d'important dans les sources n'a été omis (décision, action, réserve, chiffre clé).

### C. Cohérence interne

- [ ] Les dates, heures et durées concordent d'une section à l'autre.
- [ ] Les noms sont orthographiés de la même façon partout, avec la même fonction.
- [ ] Les chiffres répétés sont identiques (dans la synthèse et dans le détail, par exemple).
- [ ] Les renvois (« voir section 4 », « Tableau 2 ») pointent vers des éléments qui existent.
- [ ] La numérotation est continue : sections, tableaux, figures, annexes, identifiants d'exigences ou de constats.
- [ ] Un même concept porte toujours le même nom.
- [ ] Les acronymes sont développés à la première occurrence.
- [ ] Les actions ont toutes un responsable et une échéance, ou un bloc `A-COMPLETER`.

### D. Langue

- [ ] Orthographe, grammaire, accords, ponctuation.
- [ ] Typographie de la langue : en français, espaces insécables avant `:` `;` `!` `?`, guillemets « », nombres (12 400), dates en toutes lettres dans le corps ; en anglais, conventions anglaises.
- [ ] Registre constant, sans glissement entre familier et formel.
- [ ] Absence des défauts de style générique : formules creuses, puces superflues, gras décoratif, emojis (voir `doc-contenu/references/regles-ecriture.md`).
- [ ] Les titres sont informatifs et parallèles entre eux.

### E. Rendu et parité

- [ ] Le PDF et le DOCX ont le même contenu et la même pagination.
- [ ] Les polices attendues sont embarquées dans le PDF ; toute substitution est signalée.
- [ ] La page de garde est correcte et sans en-tête ni pied de page.
- [ ] Aucun titre isolé en bas de page, aucun tableau coupé au milieu d'une ligne, pas de page quasi vide inattendue.
- [ ] Le sommaire, s'il existe, est complet et ses numéros de page sont exacts.
- [ ] Les images sont nettes, non rognées, légendées, avec texte alternatif.
- [ ] Les contrastes de couleur respectent les seuils d'accessibilité (4,5:1 pour le texte courant).
- [ ] Le document est exploitable : titres en vrais styles de titre, texte sélectionnable dans le PDF.

## 3. Gravité

| Niveau | Définition | Exemples |
|---|---|---|
| **Bloquant** | Le document ne peut pas être diffusé tel quel : il est faux, trompeur, incomplet sur l'essentiel ou illisible | information inventée ; total faux ; date contradictoire sur un engagement ; mention obligatoire absente ; passage à conserver altéré ; DOCX et PDF qui diffèrent ; signataire manquant |
| **À corriger** | Défaut net, mais sans fausser le sens | faute d'orthographe ; terme incohérent ; numérotation rompue ; typographie ; titre orphelin ; texte alternatif manquant |
| **Observation** | Amélioration possible, sans obligation | tournure lourde ; section qui pourrait être plus courte ; suggestion de présentation |

En cas de doute entre deux niveaux, retenir le plus grave et expliquer.

## 4. Ce qui peut être corrigé automatiquement

### Autorisé (mécanique)

- Fautes de frappe évidentes, hors noms propres.
- Espaces insécables, guillemets, ponctuation selon la langue.
- Doubles espaces, espaces en fin de ligne.
- Numérotation des tableaux, figures et listes.
- Texte alternatif manquant sur une image, à condition de décrire fidèlement ce que l'image montre.
- Styles : titres simulés en gras convertis en vrais titres.

### Interdit sans décision de l'utilisateur (fond)

- Modifier un chiffre, un nom, une date, une décision, un montant, une attribution.
- Reformuler une phrase, ajouter ou supprimer un passage.
- Combler un manque par une supposition.
- Trancher entre deux versions contradictoires d'une information.

Pour tout cela, **signaler** : localisation, citation courte, nature du problème, et la ou les options possibles. La correction se fait ensuite dans `contenu.md` par `doc-contenu`, après réponse de l'utilisateur.

## 5. Boucle de correction

1. Appliquer les corrections mécaniques dans `contenu.md` (jamais dans le DOCX ni le PDF).
2. Demander la régénération à `doc-mise-en-forme`.
3. Relancer les vérifications.
4. Deux boucles au maximum. Au-delà, décrire ce qui reste et pourquoi, sans insister.

Consigner dans le rapport ce qui a été corrigé automatiquement, pour que l'utilisateur sache précisément ce qui a changé.

## 6. Verdict

| Verdict | Condition |
|---|---|
| **Prêt** | Aucun bloquant, aucun « À corriger » non résolu, aucun `A-COMPLETER` restant |
| **Prêt sous réserve** | Aucun bloquant, mais des « À corriger » non résolus et/ou des `A-COMPLETER` restants, à traiter avant diffusion |
| **Non prêt** | Au moins un bloquant |

## 7. Modèle de `rapport-controle.md`

```markdown
# Rapport de contrôle

**Document** : [titre]  
**Date du contrôle** : [date]  
**Verdict** : Prêt | Prêt sous réserve | Non prêt

## Synthèse
[Trois à cinq lignes : état général, point le plus important, ce que l'utilisateur doit décider.]

## Constats

### Bloquants
1. [Section / page] : [citation courte]. [Pourquoi c'est un problème.] Options : [A] / [B].

### À corriger
1. [Section / page] : [constat]. [Corrigé automatiquement | À traiter].

### Observations
1. [constat]

## Éléments à compléter
- [localisation] : [ce qui manque]

## Corrections appliquées automatiquement
| Où | Nature | Avant | Après |
|---|---|---|---|

## Décisions attendues
- [question précise pour l'utilisateur]

## Couverture du contrôle
- Vérifications mécaniques : [effectuées par script | effectuées à la main | partielles]
- Fidélité à l'original : [contrôlée | sans objet]
- Rendu visuel : [pages regardées]
```
