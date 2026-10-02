---
name: doc-cadrage
description: Point d'entrée obligatoire pour tout travail sur un document professionnel ou administratif : créer, rédiger, éditer, modifier, restructurer, reformuler ou redesigner un procès-verbal, compte rendu ou rapport de réunion, cahier des charges, rapport d'audit, dossier ou document de présentation (projet, site physique), dossier technique, documentation technique, guide d'utilisation, courrier, note de service, convocation, ou tout autre document. Pose les questions nécessaires, produit une fiche de cadrage validée, puis enchaîne vers les skills doc-contenu, doc-mise-en-forme et doc-revision. À utiliser dès qu'un document est mentionné, même si la demande semble simple et même si l'utilisateur fournit déjà un fichier ou des notes brutes.
---

# Cadrage de document

Ce skill est le chef d'orchestre de la chaîne documentaire. Il ne produit pas le document : il s'assure qu'on sait précisément **quoi** produire, **pour qui** et **comment**, puis il passe la main au bon skill.

La raison d'être de cette étape : un document raté l'est presque toujours à cause d'un mauvais cadrage (mauvais public, ton inadapté, périmètre flou, charte oubliée), rarement à cause de la rédaction elle-même. Dix minutes de questions évitent trois allers-retours de corrections.

## Déroulé

### 1. Lire avant de demander

Examiner le message de l'utilisateur et tous les fichiers fournis (document existant, notes, charte, exemples). Déduire tout ce qui peut l'être. Ne jamais reposer une question dont la réponse figure déjà dans le message ou dans un fichier : c'est la principale source d'agacement.

### 2. Identifier la tâche

Classer la demande dans l'un de ces quatre modes (en cas de doute, le demander) :

| Mode | Signal typique |
|---|---|
| `creation` | « rédige », « prépare », « fais-moi » un document à partir de rien ou de notes brutes |
| `edition` | « corrige », « complète », « mets à jour », « modifie » un document existant, fond inclus |
| `restructuration` | « reformule », « réorganise », « clarifie » : le fond est conservé, la structure ou l'écriture change |
| `redesign` | « refais la mise en page », « modernise », « applique la charte » : le contenu ne bouge pas |

### 3. Identifier le type et la famille

Rattacher le document à une famille : `compte-rendu`, `cadrage-specification`, `analyse`, `presentation`, `technique` ou `officiel`. Les types courants et leur famille sont listés dans `references/questions.md`. Pour un type inconnu, choisir la famille la plus proche et le signaler dans la fiche : la chaîne reste utilisable.

### 4. Poser les questions manquantes

Consulter `references/questions.md` pour la banque de questions. Règles de conduite :

- **Langue du document en premier** si elle n'est pas connue : elle est fixée par le client et conditionne tout le reste.
- **Par petits blocs de 5 à 7 questions maximum**, jamais un questionnaire complet d'un coup.
- **Proposer une réponse par défaut** pour chaque question (« Public : direction et partenaires ? »), pour que l'utilisateur puisse répondre « ok » ou corriger.
- Si un outil de questions interactives est disponible, l'utiliser ; sinon, questions numérotées en texte.
- Ne poser que les questions qui changent réellement le résultat. Une question dont toutes les réponses mèneraient au même document est inutile.

### 5. Établir la fiche de cadrage

Remplir la fiche selon le modèle de `references/fiche-cadrage.md`. La présenter à l'utilisateur sous forme de résumé lisible (pas le fichier brut) et **attendre sa validation explicite** avant de produire quoi que ce soit. Signaler en fin de fiche les éléments manquants plutôt que de les combler par des suppositions.

Exception : si l'utilisateur dit clairement « fais directement » ou si la demande est trivialement complète, résumer la fiche en deux lignes et continuer sans attendre.

### 6. Enregistrer et enchaîner

Enregistrer la fiche validée dans le dossier de travail sous le nom `fiche-cadrage.md`. Les skills suivants la lisent depuis ce fichier : c'est le contrat commun de la chaîne, et il survit même si la conversation devient longue.

Puis déclencher les skills selon le parcours :

| Mode | Parcours |
|---|---|
| `creation` | `doc-contenu` → `doc-mise-en-forme` → `doc-revision` (contrôle final) |
| `edition` | `doc-revision` (diagnostic) → `doc-contenu` → `doc-mise-en-forme` → `doc-revision` (contrôle final) |
| `restructuration` | `doc-revision` (diagnostic) → `doc-contenu` → `doc-mise-en-forme` → `doc-revision` (contrôle final) |
| `redesign` | `doc-revision` (diagnostic) → `doc-mise-en-forme` → `doc-revision` (contrôle final) |

Écrire le parcours retenu dans la fiche, champ `parcours`, et annoncer à l'utilisateur la prochaine étape en une phrase. Si l'un des skills du parcours n'est pas installé, le dire clairement et poursuivre avec les consignes de la fiche en meilleur effort, sans bloquer.

## Principes à respecter

- **Ne rien inventer.** Une information absente (date, nom, décision, chiffre) est signalée comme manquante, jamais devinée.
- **Rester bref.** Le cadrage est une étape de précision, pas un entretien. Si la demande est claire, la fiche tient en quelques lignes.
- **Respecter le périmètre.** En `edition` et `redesign`, demander ce qui doit rester strictement intact, car c'est ce que l'utilisateur craint le plus de voir modifié.
- **Charte graphique.** Trois cas : charte fournie (à appliquer), charte à améliorer (partir de l'existante et proposer des corrections), ou aucune (style premium par défaut défini dans `doc-mise-en-forme`). Toujours le demander, l'utilisateur peut vouloir modifier ou enrichir une charte existante.
- **Formats de sortie.** Par défaut PDF et DOCX, sauf indication contraire.
