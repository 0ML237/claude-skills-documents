---
name: doc-contenu
description: Structure et rédige le contenu d'un document professionnel ou administratif (procès-verbal, compte rendu, rapport de réunion, cahier des charges, rapport d'audit, présentation de projet ou de site, dossier technique, documentation technique, guide d'utilisation, courrier, note de service, convocation) à partir d'une fiche de cadrage validée. Produit un fichier contenu.md prêt à être mis en page, et un journal modifications.md quand un document existant est édité ou restructuré. À utiliser dès qu'il faut écrire, réécrire, compléter, corriger ou restructurer le texte d'un document, après doc-cadrage, et même si aucune mise en forme n'est demandée.
---

# Contenu de document

Ce skill écrit le **fond** : la structure, le texte, les tableaux, les décisions et les actions. Il ne s'occupe jamais de la présentation (couleurs, polices, pagination), qui relève de `doc-mise-en-forme`.

Séparer le sens du style a une conséquence pratique : on peut changer de charte graphique, ou produire un DOCX et un PDF, sans réécrire un seul mot.

## Prérequis

Lire `fiche-cadrage.md` dans le dossier de travail. Si le fichier est absent, ou s'il ne contient pas la ligne `validation`, ne pas rédiger : revenir à `doc-cadrage`, car écrire sans cadrage validé produit un texte à refaire.

## Déroulé

1. **Lire** la fiche, les sources, et `diagnostic.md` s'il existe (mode édition, restructuration).
2. **Charger** `references/<famille>.md` correspondant au champ `famille` de la fiche, puis `references/regles-ecriture.md`.
3. **Valider un plan** si le document dépasse environ 3 pages : présenter les sections prévues en quelques lignes et attendre l'accord. En dessous, passer directement à la rédaction, car cette étape ralentit sans rien apporter.
4. **Rédiger** `contenu.md` selon le format ci-dessous, dans la langue de la fiche, au niveau de formalité demandé.
5. **Tenir le journal** `modifications.md` si la tâche est `edition` ou `restructuration`.
6. **Conclure** en listant les éléments manquants, puis annoncer la suite : `doc-mise-en-forme`.

## Format de `contenu.md`

Ce fichier est le contrat avec `doc-mise-en-forme`. Respecter exactement ce format, car le skill suivant en dépend.

### En-tête de métadonnées

Un bloc YAML en tête de fichier, qui alimente la page de garde et les en-têtes :

```yaml
---
titre: Titre du document
sous_titre: (facultatif)
reference: (numéro ou code, si applicable)
date: 12 octobre 2026
auteur: Nom de l'auteur ou du service
organisation: Nom de l'organisation
langue: fr
confidentialite: (ex. Interne, Confidentiel, Public)
version: 1.0
---
```

Les champs inconnus restent vides ou sont omis ; ne jamais les inventer. Certaines familles ajoutent des champs (voir leur fichier de référence).

### Corps

Markdown standard, sans aucune directive de présentation :

- Pas de titre de niveau 1 dans le corps (le titre est dans l'en-tête). Utiliser `##` pour les sections, `###` et `####` pour les sous-niveaux. Ne pas dépasser trois niveaux.
- Tableaux Markdown simples, avec ligne d'en-tête. Une phrase de légende (« Tableau 1 : ... ») juste avant s'il y a plusieurs tableaux.
- Images : `![Description pour l'accessibilité](chemin)` suivie d'une ligne de légende.
- Blocs de code et de commande dans des blocs délimités, avec le langage indiqué.
- Aucune couleur, aucun HTML, aucun emoji, aucun saut de page manuel : la pagination appartient à `doc-mise-en-forme`.

### Les cinq blocs sémantiques

Utiliser la syntaxe d'alerte à citation. Chaque bloc a un sens précis, que `doc-mise-en-forme` habille à sa façon :

```markdown
> [!NOTE]
> Information complémentaire utile mais non essentielle.

> [!WARNING]
> Risque, précaution ou erreur à éviter.

> [!DECISION]
> Décision prise, formulée de façon autonome et datable.

> [!ACTION]
> Action à mener. Responsable : Nom. Échéance : 30 octobre 2026.

> [!A-COMPLETER]
> Information manquante dans les sources : précisez laquelle et pourquoi elle est nécessaire.
```

N'employer un bloc que lorsque l'information a ce statut. Un document saturé d'encadrés n'en met plus aucun en valeur.

## Journal `modifications.md`

En mode `edition` ou `restructuration`, produire ce journal pour que l'utilisateur retrouve les retouches sans relire tout le texte :

```markdown
# Journal des modifications

| Section | Nature | Avant (résumé) | Après (résumé) | Raison |
|---|---|---|---|---|
| 3. Budget | Correction | Total de 12 000 | Total de 12 400 | Erreur d'addition |
```

Les valeurs de la colonne `Nature` : ajout, suppression, reformulation, déplacement, correction. Ne consigner que les changements réels, sans commentaire sur ce qui est resté identique.

## Règles de rigueur

- **Ne rien inventer.** Un nom, une date, un chiffre, une décision ou une citation qui ne figure pas dans les sources est signalé par un bloc `A-COMPLETER`, jamais deviné.
- **Respecter `a_conserver_intact`.** En édition, restructuration et redesign, les passages listés dans la fiche sont repris tels quels.
- **Distinguer** les faits, les interprétations et les recommandations ; ne pas les mélanger dans une même phrase.
- **Un terme par concept.** Si le document appelle quelque chose « module » en page 1, ne pas le renommer « composant » en page 4.
- **Langue unique** : celle de la fiche. Les termes d'une autre langue ne subsistent que s'ils sont d'usage établi.

## Après la rédaction

Résumer en quelques lignes ce qui a été produit et dresser la liste des éléments manquants, avec pour chacun ce qu'il faut obtenir et auprès de qui si c'est connu. Passer ensuite à `doc-mise-en-forme`. Si ce skill n'est pas installé, le dire clairement : `contenu.md` reste un livrable exploitable en l'état.
