# Famille : technique

Types couverts : dossier technique, documentation technique, guide d'utilisation, procédure, manuel.

## Trois documents, trois logiques

- **Dossier technique** : explique comment c'est conçu et pourquoi. Public : ingénieurs, décideurs techniques, évaluateurs. Contenu : architecture, choix, dimensionnement, spécifications.
- **Documentation technique** : sert de référence pour exploiter ou faire évoluer. Public : développeurs, exploitants. Contenu : composants, configuration, interfaces, exploitation, dépannage.
- **Guide d'utilisation** : aide à accomplir des tâches. Public : utilisateurs finaux. Contenu : procédures pas à pas, organisées par ce que l'utilisateur veut faire, et non par les fonctions du produit.

Le niveau technique du lecteur, défini dans le cadrage, détermine le vocabulaire : ne jamais employer un terme que le lecteur ne connaît pas sans l'expliquer.

## Champs additionnels de l'en-tête

```yaml
produit: 
version_produit: 
public_technique: (ex. utilisateur final, technicien, développeur)
```

## Structure du dossier technique

1. **Objet et périmètre** : ce que le dossier décrit et à qui il s'adresse.
2. **Vue d'ensemble** : architecture générale, schéma d'ensemble.
3. **Spécifications** : caractéristiques, capacités, contraintes de fonctionnement.
4. **Choix de conception** : décisions importantes et leur justification, avec les alternatives écartées.
5. **Dimensionnement et performances**, si pertinent.
6. **Sécurité et conformité**.
7. **Annexes** : plans, schémas détaillés, fiches techniques.

## Structure de la documentation technique

1. **Objet et public**.
2. **Prérequis** : environnement, accès, outils, versions.
3. **Vue d'ensemble** : composants et leurs relations.
4. **Installation et configuration**.
5. **Référence** : interfaces, paramètres, commandes, un élément par entrée, au même format.
6. **Exploitation** : sauvegarde, surveillance, mises à jour.
7. **Dépannage** : tableau Symptôme, Cause probable, Solution.
8. **Glossaire** et **historique des versions**.

## Structure du guide d'utilisation

1. **À qui s'adresse ce guide et ce qu'il permet de faire.**
2. **Avant de commencer** : prérequis, comptes, matériel.
3. **Premiers pas** : la tâche la plus courante, de bout en bout.
4. **Tâches courantes** : une section par tâche, titrée par le verbe (« Créer un compte », « Exporter un rapport »).
5. **Dépannage** : problèmes fréquents et solutions.
6. **Obtenir de l'aide** : contact, ressources.

## Règles spécifiques

- **Procédures numérotées, une action par étape**, au mode impératif : « Cliquez sur Enregistrer. » Ne pas regrouper deux actions dans une même étape.
- **Indiquer le résultat attendu** après les étapes critiques : « La page de confirmation s'affiche. »
- **Placer les avertissements avant l'étape concernée**, dans un bloc `WARNING`, jamais après.
- **Commandes, code et valeurs de configuration** dans des blocs de code avec le langage indiqué ; les noms de boutons ou d'éléments d'interface en gras uniquement dans ce contexte, conformément à l'usage des guides.
- **Nommer les éléments d'interface exactement comme à l'écran**, dans la langue de l'interface.
- **Mentionner les versions** concernées chaque fois qu'une procédure en dépend.
- **Décrire les captures d'écran** par une légende ; si elles ne sont pas fournies, placer un bloc `A-COMPLETER` à l'endroit prévu.
- Un sujet n'est expliqué qu'une fois ; ailleurs, renvoyer vers la section concernée.

## Erreurs fréquentes

- Étapes qui contiennent plusieurs actions ou plusieurs conditions.
- Prérequis découverts en cours de procédure.
- Avertissement donné après que l'action dangereuse a été décrite.
- Guide organisé selon les menus du logiciel plutôt que selon les tâches de l'utilisateur.
- Nom d'élément différent entre le texte et l'écran.
- Procédure jamais vérifiée de bout en bout.

## Mini-exemple

```markdown
## Exporter un rapport

**Prérequis.** Disposer du rôle Gestionnaire.

> [!WARNING]
> L'export remplace tout fichier de même nom présent dans le dossier de destination.

1. Ouvrez le menu **Rapports**.
2. Sélectionnez le rapport à exporter.
3. Cliquez sur **Exporter**, puis choisissez le format PDF.
4. Choisissez le dossier de destination et cliquez sur **Enregistrer**.

Le fichier apparaît dans le dossier choisi sous quelques secondes.

> [!A-COMPLETER]
> Capture d'écran de la boîte de dialogue d'export (étape 3) non fournie.
```
