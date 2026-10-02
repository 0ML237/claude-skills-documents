---
name: doc-revision
description: Relit, vérifie et contrôle un document professionnel, à deux moments de la chaîne documentaire. En entrée, il fait le diagnostic d'un document existant avant toute édition, restructuration ou redesign (ce qu'il faut conserver, corriger, protéger). En sortie, il fait le contrôle final avant livraison (fidélité aux sources, cohérence, langue, parité DOCX/PDF, rendu) et produit un rapport avec un verdict. À utiliser dès qu'on demande de relire, vérifier, contrôler, auditer, valider avant envoi ou comparer deux versions d'un document, et automatiquement après doc-mise-en-forme ou avant doc-contenu pour un document existant.
---

# Révision de document

Ce skill est le contrôle indépendant de la chaîne : il **vérifie, il ne produit pas**. Cette séparation est volontaire, car un générateur qui se relit lui-même repère mal ses propres erreurs.

Il intervient deux fois :

- **Mode 1 : diagnostic**, avant de toucher à un document existant.
- **Mode 2 : contrôle final**, avant de livrer quoi que ce soit.

Il peut aussi servir seul, pour une relecture autonome (voir plus bas).

## Choisir le mode

| Situation | Mode | Fichier de référence |
|---|---|---|
| `tache` = `edition`, `restructuration` ou `redesign` et pas encore de `diagnostic.md` | Diagnostic | `references/diagnostic.md` |
| Des fichiers existent dans `sortie/` (DOCX et/ou PDF) | Contrôle final | `references/controle-final.md` |
| `tache` = `edition` ou `restructuration` et contrôle final | Contrôle final **plus** fidélité | `references/fidelite-edition.md` |
| L'utilisateur demande seulement de relire ou de vérifier un document, hors chaîne | Relecture autonome | `references/controle-final.md`, sans modification |

## Principes

1. **Indépendance.** Juger le résultat par rapport à la fiche et aux sources, pas par rapport à l'intention de celui qui l'a produit.
2. **Source unique.** Le texte vit dans `contenu.md`. Toute correction de texte se fait dans `contenu.md`, puis le document est régénéré par `doc-mise-en-forme`. Ne jamais retoucher directement le DOCX ou le PDF : le contenu et les fichiers divergeraient.
3. **Pas de modification silencieuse du fond.** Corriger seulement ce qui est mécanique : fautes de frappe évidentes, espaces insécables, ponctuation, numérotation de tableaux et de figures, styles. Tout problème de fond (chiffre, nom, date, décision, formulation) est signalé avec sa localisation, et sa correction attend la décision de l'utilisateur. Un relecteur qui réécrit sans le dire détruit la confiance qu'on lui accorde.
4. **Preuves.** Chaque constat indique où (section, page, ligne), quoi (citation courte) et pourquoi. Pas de remarque vague.
5. **Proportion.** Distinguer le bloquant de l'anecdotique. Une liste de 40 remarques sans hiérarchie est inutilisable.
6. **Deux boucles au plus.** Après deux tours de correction automatique, rendre la main avec ce qui reste.

## Mode 1 : diagnostic

Lire `references/diagnostic.md`. Analyser le document existant, écrire `diagnostic.md`, puis mettre à jour dans `fiche-cadrage.md` les champs `a_conserver_intact` et `elements_manquants`. Annoncer à l'utilisateur les points qui demandent sa décision avant de passer à `doc-contenu` ou `doc-mise-en-forme`.

## Mode 2 : contrôle final

Lire `references/controle-final.md` (et `references/fidelite-edition.md` en édition ou restructuration). Étapes :

1. Lancer `scripts/verifier.py` pour les vérifications mécaniques, puis lire ses résultats.
2. Faire la relecture qui demande du jugement : fidélité aux sources, cohérence, langue, registre.
3. Regarder le rendu des pages (images produites par `doc-mise-en-forme`).
4. Classer les constats, corriger ce qui est mécanique dans `contenu.md`, faire régénérer, recontrôler (deux boucles au maximum).
5. Écrire `rapport-controle.md` avec le verdict, dans le dossier de travail, **pas** dans `sortie/` : ce rapport est destiné à l'utilisateur, pas au destinataire du document.

## Scripts

Ils sont écrits et testés dans l'environnement de l'utilisateur. Leur interface est fixée ici pour que le reste du skill puisse s'appuyer dessus.

**`scripts/verifier.py`** : vérifications mécaniques.

```
python3 scripts/verifier.py --docx sortie/X.docx --pdf sortie/X.pdf \
  --contenu contenu.md --fiche fiche-cadrage.md --charte charte.json \
  --out verifs.json
```

Contrôles minimaux : parité de texte entre DOCX et PDF ; nombre de pages du PDF identique à une reconversion du DOCX ; polices attendues embarquées dans le PDF ; texte alternatif sur toutes les images ; blocs `A-COMPLETER` restants ; espaces avant `:` `;` `!` `?` et guillemets droits en français ; doubles espaces ; titres vides ou sauts de niveau ; continuité de la numérotation des tableaux, figures et identifiants (EXG-F-01…) ; résidus de gabarit (`TODO`, `XXX`, `lorem`, crochets non résolus). Sortie JSON : liste de constats `{id, famille, gravite, lieu, message, corrigeable_auto}`.

**`scripts/comparer.py`** : fidélité en édition (voir `references/fidelite-edition.md`).

```
python3 scripts/comparer.py --avant original.docx --apres sortie/X.docx \
  --journal modifications.md --fiche fiche-cadrage.md --out comparaison.json
```

Si ces scripts n'existent pas encore, effectuer les contrôles à la main avec `pandoc`, `pdftotext`, `pdffonts` et `pdftoppm`, et le signaler dans le rapport comme contrôle partiel.

## Relecture autonome

Quand l'utilisateur demande seulement de relire ou de vérifier un document, sans lancer la chaîne :

- ne rien modifier ;
- demander ou déduire la langue, le type, le public et le niveau de formalité, en un seul message court ;
- produire `rapport-controle.md` avec le même classement par gravité ;
- proposer à la fin de lancer la chaîne complète si des corrections sont souhaitées.

## Après le contrôle

- Verdict **Prêt** : dire où sont les fichiers (`sortie/`), signaler qu'ils peuvent être diffusés.
- Verdict **Prêt sous réserve** : lister les réserves (par exemple des blocs `A-COMPLETER` à résoudre) et laisser l'utilisateur décider.
- Verdict **Non prêt** : expliquer les points bloquants, proposer le chemin de correction (retour à `doc-contenu` pour le fond, à `doc-mise-en-forme` pour la forme) et ne pas présenter les fichiers comme finaux.
