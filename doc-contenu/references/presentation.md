# Famille : presentation

Types couverts : document de présentation de projet, présentation de site physique, dossier de présentation, proposition commerciale.

## Finalité

Ces documents cherchent à informer, convaincre ou obtenir un accord. La confiance se construit avec des faits vérifiables, pas avec des qualificatifs. Un lecteur qui n'a pas le temps doit comprendre en une page de quoi il s'agit, pourquoi cela compte et ce qu'on attend de lui.

## Champs additionnels de l'en-tête

```yaml
destinataire: (ex. investisseurs, partenaires, direction)
objectif: (ex. obtenir un financement, faire valider le projet)
```

## Structure d'un document de présentation de projet

1. **En une page** : le projet, son enjeu, ce qui est demandé au lecteur. Utilisable seul.
2. **Contexte et enjeu** : le problème ou l'opportunité, avec un fait ou un chiffre à l'appui.
3. **Le projet** : ce qui sera fait, pour qui, et ce qui change concrètement.
4. **Chiffres clés** : trois à cinq indicateurs au plus, présentés dans un tableau court.
5. **Calendrier et phases** : étapes, jalons, durée.
6. **Équipe et partenaires** : qui porte le projet, avec leurs rôles.
7. **Besoins ou conditions** : budget, moyens, conditions d'adhésion ou de réalisation.
8. **Prochaines étapes** : ce qui se passe après la lecture, avec une date et un contact.

## Structure d'une présentation de site physique

1. **En une page** : le site, sa nature, ce qui le distingue.
2. **Localisation et accès** : adresse, plan de situation, accès routier et transports.
3. **Caractéristiques** : surfaces, capacités, configuration, état général.
4. **Équipements et services** : ce qui est disponible sur place, avec les quantités.
5. **Contraintes et réglementation** : usages autorisés, normes, limitations connues.
6. **Visuels** : plans et photographies, chacun avec légende et crédit.
7. **Conditions d'accès ou d'exploitation** : statut, disponibilité, contacts.

## Règles spécifiques

- **Preuve avant adjectif.** « Un site de 4 200 m², à 12 minutes de l'aéroport » vaut mieux que « un site exceptionnellement bien situé ».
- **Un message par section.** Chaque section répond à une question du lecteur ; si elle n'en répond à aucune, la supprimer.
- **Chiffres clés limités à cinq**, chacun avec son unité et sa source ou sa date.
- **Légender chaque visuel** avec ce qu'il montre, pas avec un mot décoratif. Si une photo ou un plan n'est pas fourni, placer un bloc `A-COMPLETER` à l'endroit prévu.
- **Terminer par une action concrète** (valider, contacter, visiter) avec une échéance ou un contact, et non par une formule de remerciement.
- Adapter le vocabulaire au destinataire : un investisseur lit la rentabilité et les risques, un partenaire technique lit la faisabilité.
- Ne jamais présenter une hypothèse ou une prévision comme un fait.

## Erreurs fréquentes

- Superlatifs et slogans à la place de faits.
- Jargon que le destinataire ne partage pas.
- Chiffres sans date, sans source ou sans unité.
- Aucune demande claire au lecteur.
- Photos sans légende, plans sans échelle.

## Mini-exemple

```markdown
## 4. Chiffres clés

Tableau 1 : le site en quelques indicateurs

| Indicateur | Valeur |
|---|---|
| Surface bâtie | 4 200 m² |
| Capacité d'accueil | 350 personnes |
| Distance de l'aéroport | 12 minutes en voiture |
| Année de construction | 2018 |

> [!A-COMPLETER]
> Les plans de niveau et la surface du terrain ne figurent pas dans les sources. À fournir pour la section Visuels.
```
