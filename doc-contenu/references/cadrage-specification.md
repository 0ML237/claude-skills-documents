# Famille : cadrage-specification

Types couverts : cahier des charges, note de cadrage, termes de référence, spécifications fonctionnelles.

## Finalité

Un cahier des charges est un document de décision et de contrôle. Il doit permettre à un prestataire de chiffrer et de réaliser, et au commanditaire de vérifier plus tard que ce qui est livré correspond à ce qui était demandé. Tout ce qui ne peut pas être vérifié n'a pas sa place dans une exigence.

## Champs additionnels de l'en-tête

```yaml
commanditaire: 
prestataire: (si connu)
statut: (ex. Brouillon, Validé)
```

## Structure du cahier des charges

1. **Contexte** : situation de départ et raison du projet, en quelques paragraphes.
2. **Objectifs** : ce que le projet doit permettre d'obtenir, de préférence mesurable.
3. **Périmètre** : ce qui est inclus, ce qui est explicitement exclu. L'exclusion évite la plupart des litiges.
4. **Parties prenantes** : qui commande, qui valide, qui utilise, qui réalise.
5. **Exigences fonctionnelles** : ce que le système ou le service doit faire.
6. **Exigences non fonctionnelles** : performance, sécurité, disponibilité, accessibilité, conformité.
7. **Contraintes** : budget, délais, technologies imposées, réglementation, dépendances.
8. **Livrables** : liste des éléments remis, avec leur format.
9. **Planning et jalons** : phases, dates clés, conditions de passage d'une phase à l'autre.
10. **Critères d'acceptation** : comment on vérifiera que chaque livrable est conforme.
11. **Risques et hypothèses** : ce qui est supposé vrai, et ce qui pourrait faire dévier le projet.
12. **Glossaire** : seulement si des termes spécialisés sont utilisés.

Pour une note de cadrage, retenir 1 à 4, 7, 9 et 11, en une à deux pages.

## Règles spécifiques

- **Numéroter chaque exigence** avec un identifiant stable (EXG-F-01 pour fonctionnelle, EXG-N-01 pour non fonctionnelle), pour permettre des renvois depuis les tests et le suivi.
- **Rendre chaque exigence vérifiable.** « Le système doit être rapide » ne l'est pas ; « une page se charge en moins de 3 secondes sur une connexion 4G » l'est.
- **Prioriser** chaque exigence : Obligatoire, Souhaitable, Optionnel. Présenter les exigences sous forme de tableau Identifiant, Exigence, Priorité, Critère de vérification.
- **Décrire le besoin, pas la solution**, sauf si la technologie est imposée par une contrainte réelle.
- Employer « doit » pour l'obligation, « devrait » pour le souhaitable, « peut » pour l'optionnel, et s'y tenir dans tout le document.
- Une ambiguïté ou une donnée manquante (budget, délai, volume) devient un bloc `A-COMPLETER`, jamais une valeur estimée.

## Erreurs fréquentes

- Exigences vagues ou impossibles à tester.
- Mélanger objectifs (le pourquoi) et exigences (le quoi).
- Périmètre sans exclusions explicites.
- Décider d'une solution technique avant d'avoir décrit le besoin.
- Exigences en doublon ou contradictoires entre sections.

## Mini-exemple

```markdown
## 5. Exigences fonctionnelles

Tableau 1 : exigences fonctionnelles du module de paiement

| Identifiant | Exigence | Priorité | Vérification |
|---|---|---|---|
| EXG-F-01 | Le système doit permettre le paiement par carte bancaire et par mobile money. | Obligatoire | Un paiement test réussit avec chaque moyen |
| EXG-F-02 | Le système doit envoyer un reçu par e-mail dans les 60 secondes. | Obligatoire | Reçu reçu en moins d'une minute sur 20 essais |
| EXG-F-03 | Le système peut proposer l'enregistrement d'une carte. | Optionnel | Fonction activable depuis le profil |

> [!A-COMPLETER]
> Le plafond de paiement par transaction n'est pas précisé dans les sources. À confirmer par le commanditaire.
```
