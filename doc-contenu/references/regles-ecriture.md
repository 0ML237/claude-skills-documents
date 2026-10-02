# Règles d'écriture

Contenu : 1. Principe · 2. Ce qui trahit un texte généré · 3. Structure et titres · 4. Phrases et vocabulaire · 5. Typographie française · 6. Registres de formalité · 7. Relecture finale

## 1. Principe

Un bon document administratif ou technique est écrit comme le ferait un professionnel rigoureux : il dit ce qu'il a à dire, dans l'ordre où le lecteur en a besoin, puis s'arrête. Le test de relecture est simple : une secrétaire générale ou un ingénieur expérimenté aurait-il écrit cette phrase ainsi ? Sinon, la réécrire.

## 2. Ce qui trahit un texte généré

Ces habitudes donnent immédiatement un aspect « fabriqué par IA ». Les éviter systématiquement.

- **Listes à puces partout.** Une liste sert à énumérer des éléments parallèles (trois éléments ou plus), des étapes dans un ordre précis ou des actions. Un raisonnement, une explication ou une nuance s'écrit en phrases.
- **Gras en excès.** Pas de mot en gras au milieu d'une phrase pour « faire ressortir », et pas de structure « **Terme :** explication » répétée sur chaque ligne. Le gras est réservé aux libellés de tableau et, très rarement, à un avertissement.
- **Emojis et symboles décoratifs** (✓, →, ★, ●●●) : jamais.
- **Tirets cadratins** (—) en série : les remplacer par une virgule, un point ou des parenthèses.
- **Formules creuses** : « il est important de noter que », « dans un monde en constante évolution », « force est de constater », « en conclusion », « n'hésitez pas à », « il convient de souligner ». Supprimer, la phrase garde son sens.
- **Triplets rhétoriques** (« rapide, fiable et sécurisé ») : ne garder que les qualificatifs démontrés par un fait.
- **Adjectifs laudatifs** (robuste, innovant, puissant, complet, optimal) : à remplacer par un chiffre, une preuve, ou à supprimer.
- **Résumé qui répète** : un paragraphe final qui redit ce qui précède n'a pas de place dans un document de moins de dix pages.
- **Titres génériques** (« Introduction », « Conclusion », « Points clés ») sans fonction réelle : titrer par le contenu (« Calendrier retenu », « Écarts constatés »).
- **Symétrie artificielle** : trois points par section, chacun de la même longueur. Un document réel est irrégulier parce que le sujet l'est.

## 3. Structure et titres

- Une section = une idée. Si une section en contient deux, la scinder.
- Trois niveaux de titres au maximum.
- Placer la conclusion ou la décision en premier quand le lecteur est pressé (synthèse en tête des rapports d'analyse).
- Un titre dit ce que la section contient, en quelques mots, sans deux-points ni question.
- Les tableaux servent à comparer ou à référencer, pas à décorer. Un tableau de deux colonnes qui pourrait être une phrase est une phrase.

## 4. Phrases et vocabulaire

- Voix active, sujet concret. « Le comité a validé le budget » plutôt que « Le budget a été validé par le comité ».
- Longueur moyenne d'environ 20 à 25 mots, en alternant phrases courtes et plus longues.
- Un verbe précis plutôt qu'un verbe générique suivi d'un nom (« décider » plutôt que « prendre la décision de »).
- Une idée par phrase quand elle porte une obligation, une date ou un chiffre.
- Même terme pour même concept, d'un bout à l'autre du document.
- Acronymes développés à la première occurrence, sauf ceux d'usage universel.

## 5. Typographie française

Appliquer ces règles quand la langue du document est le français :

- Espace insécable avant `:`, `;`, `!`, `?` et à l'intérieur des guillemets : « comme ceci ».
- Guillemets français « » ; guillemets anglais seulement pour une citation dans une citation.
- Nombres : espace insécable comme séparateur de milliers (12 400), virgule décimale (3,5), espace avant les unités et le symbole % (15 %).
- Dates en toutes lettres dans le corps (12 octobre 2026) ; formats courts réservés aux tableaux.
- Majuscules : seulement aux noms propres et au début des phrases ; pas de majuscule aux fonctions, jours et mois.
- « Premier » abrégé en 1er, « deuxième » en 2e.

Pour l'anglais : guillemets droits ou typographiques simples, format de date `12 October 2026`, séparateur de milliers par virgule, pas d'espace avant la ponctuation.

## 6. Registres de formalité

| Registre | Usage | Marques |
|---|---|---|
| Courant | notes internes, échanges d'équipe | phrases directes, « nous », peu de formules |
| Semi-formel | comptes rendus, rapports internes, documents de projet | vouvoiement ou impersonnel, formules d'ouverture et de clôture sobres |
| Formel | courriers officiels, procès-verbaux, documents contractuels | impersonnel, formules de politesse complètes, aucun familier |

Rester dans un seul registre d'un bout à l'autre. Le niveau demandé dans la fiche (`niveau_formalite`) l'emporte sur toute habitude.

## 7. Relecture finale

Avant de rendre `contenu.md`, vérifier :

1. Toutes les sections prévues sont présentes et rien n'a été inventé.
2. Aucun emoji, aucun gras décoratif, aucune puce là où une phrase suffisait.
3. Aucune des formules creuses de la section 2 ne subsiste.
4. Les noms, dates et chiffres sont cohérents d'un passage à l'autre.
5. Les blocs `A-COMPLETER` couvrent tout ce qui manque.
6. Le registre est resté le même du début à la fin.
