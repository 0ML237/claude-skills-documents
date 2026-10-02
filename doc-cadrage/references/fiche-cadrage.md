# Modèle de fiche de cadrage

La fiche est le **contrat commun** de la chaîne de skills. Chaque champ existe parce qu'au moins un skill suivant en a besoin. Ne pas ajouter de champ décoratif ; ne pas supprimer un champ, mettre `non précisé` si l'information manque.

Enregistrer sous `fiche-cadrage.md` dans le dossier de travail.

## Modèle

```markdown
# Fiche de cadrage

## Identification
- tache: creation | edition | restructuration | redesign
- type_document: [ex. procès-verbal, cahier des charges, rapport d'audit]
- famille: compte-rendu | cadrage-specification | analyse | presentation | technique | officiel
- titre_provisoire: [titre de travail]
- langue: [fixée par le client]

## Destinataires et usage
- public_cible: [qui lit, quel niveau de connaissance du sujet]
- usage: lecture | impression | signature | archivage | diffusion externe
- niveau_formalite: courant | semi-formel | formel
- ton: [ex. sobre, institutionnel, pédagogique, chaleureux]

## Matière première
- sources: [liste : fichiers, notes brutes, enregistrements, liens]
- document_existant: [chemin du fichier, ou « aucun »]
- a_conserver_intact: [pour edition et redesign : ce qui ne doit pas bouger]

## Contraintes
- longueur: [pages ou mots visés, ou « libre »]
- mentions_obligatoires: [références, numéros, signatures, mentions légales]
- delai: [si pertinent]

## Mise en forme
- charte: fournie (chemin) | a_ameliorer (chemin) | defaut_premium
- ajustements_charte: [modifications ou améliorations souhaitées, le cas échéant]
- formats_sortie: pdf, docx

## Suivi
- elements_manquants: [informations à obtenir, signalées dans le document final]
- parcours: [ex. doc-contenu > doc-mise-en-forme > doc-revision]
- validation: confirmee le [date] par l'utilisateur
```

## Règles de remplissage

- Valeurs fermées (`tache`, `famille`, `charte`) : utiliser exactement les valeurs listées, car les skills suivants s'en servent pour choisir leur comportement.
- `elements_manquants` n'est jamais vide par défaut : s'il n'y a rien de manquant, écrire `aucun`.
- `a_conserver_intact` est obligatoire pour `edition`, `restructuration` et `redesign`.
- Une fiche sans la ligne `validation` n'est pas utilisable pour produire le document.

## Exemple rempli (abrégé)

```markdown
# Fiche de cadrage

## Identification
- tache: creation
- type_document: procès-verbal de réunion
- famille: compte-rendu
- titre_provisoire: PV de la réunion de pilotage du 12 octobre
- langue: français

## Destinataires et usage
- public_cible: membres du comité de pilotage et direction
- usage: archivage et diffusion interne
- niveau_formalite: formel
- ton: sobre

## Matière première
- sources: notes-reunion.txt
- document_existant: aucun
- a_conserver_intact: sans objet

## Contraintes
- longueur: 2 à 3 pages
- mentions_obligatoires: numéro de référence, signature du président de séance
- delai: sans objet

## Mise en forme
- charte: defaut_premium
- ajustements_charte: aucun
- formats_sortie: pdf, docx

## Suivi
- elements_manquants: liste des absents excusés
- parcours: doc-contenu > doc-mise-en-forme > doc-revision
- validation: confirmee le 2026-10-12 par l'utilisateur
```
