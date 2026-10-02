# Famille : analyse

Types couverts : rapport d'audit, rapport d'étude, diagnostic, rapport d'évaluation.

## Finalité

Un rapport d'analyse sert à décider. Le lecteur principal (direction, comité, client) lit rarement plus que la synthèse et les recommandations ; le reste doit permettre de vérifier que ces conclusions tiennent. Tout constat doit donc pouvoir être retracé jusqu'à une preuve.

## Champs additionnels de l'en-tête

```yaml
commanditaire: 
perimetre: (en une ligne)
periode_analysee: 
confidentialite: (obligatoire pour un audit)
```

## Structure du rapport d'audit

1. **Synthèse** : en tête, une page au plus. Conclusion générale, trois à cinq constats majeurs, recommandations prioritaires. Rédiger cette section en dernier, mais la placer en premier.
2. **Périmètre et méthode** : ce qui a été examiné, ce qui ne l'a pas été, sur quelle période, avec quelles méthodes (entretiens, documents, tests, observations).
3. **Référentiel** : normes, politiques ou critères par rapport auxquels l'évaluation est faite.
4. **Constats** : un sous-ensemble par constat, voir ci-dessous.
5. **Recommandations** : tableau priorisé Recommandation, Constat lié, Priorité, Effort estimé, Responsable proposé.
6. **Conclusion et suites** : prochaines étapes et calendrier de suivi, si le document dépasse cinq pages.
7. **Annexes** : preuves détaillées, listes d'entretiens, extraits de données.

Pour un rapport d'étude, remplacer « Référentiel » par « État des lieux » et « Constats » par « Analyse », en gardant la synthèse en tête et les recommandations.

## Structure d'un constat

Chaque constat suit le même ordre, pour que le lecteur retrouve les mêmes repères :

- **Identifiant et titre** : « C-03 : Sauvegardes non testées ».
- **Constat** : ce qui a été observé, en termes factuels.
- **Preuve** : source, date, document ou test d'où cela provient.
- **Risque ou impact** : conséquence si rien n'est fait.
- **Gravité** : niveau selon l'échelle définie dans la méthode (par exemple Critique, Majeur, Mineur, Observation).

## Règles spécifiques

- Distinguer clairement **fait**, **analyse** et **recommandation**, y compris dans la formulation. « Les sauvegardes n'ont pas été restaurées depuis 2024 » est un fait ; « le risque de perte de données est élevé » est une analyse.
- Définir l'échelle de gravité une fois, dans la méthode, et l'appliquer sans changer de critère.
- Chaque recommandation renvoie à au moins un constat, et chaque constat majeur a au moins une recommandation.
- Rédiger les recommandations comme des actions : un verbe, un objet, un résultat attendu.
- Viser les processus, les systèmes et les situations, jamais les personnes.
- Ne pas affirmer au-delà des preuves : utiliser « n'a pas été observé » plutôt que « n'existe pas » quand l'absence n'est pas démontrée.

## Erreurs fréquentes

- Constat sans preuve ou sans source.
- Synthèse qui répète l'introduction au lieu de livrer la conclusion.
- Recommandations vagues (« améliorer la sécurité ») ou impossibles à vérifier.
- Gravité attribuée sans critère.
- Ton accusateur, ou au contraire si prudent que rien n'est tranché.

## Mini-exemple

```markdown
### C-03 : Sauvegardes non testées

**Constat.** Les sauvegardes de la base de données sont réalisées chaque nuit, mais aucune restauration n'a été testée depuis janvier 2025.

**Preuve.** Journal des sauvegardes (extrait en annexe B) ; entretien avec le responsable d'exploitation, 3 septembre 2026.

**Risque.** En cas d'incident, l'organisation ne peut pas garantir que les données sont récupérables ni en combien de temps.

**Gravité.** Majeur.

> [!WARNING]
> Une sauvegarde jamais restaurée ne peut pas être considérée comme fiable.
```
