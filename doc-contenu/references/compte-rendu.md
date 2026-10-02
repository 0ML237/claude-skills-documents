# Famille : compte-rendu

Types couverts : procès-verbal de réunion, rapport de réunion, compte rendu d'événement.

## Choisir entre PV et rapport de réunion

Le **procès-verbal** est un document de référence : factuel, neutre, centré sur les décisions prises. Il peut faire foi et être signé. Le **rapport de réunion** est plus narratif : il synthétise les échanges, met en perspective et peut proposer une analyse. En cas de doute, le demander dans le cadrage, car les deux n'ont pas le même degré de formalité ni de détail.

## Champs additionnels de l'en-tête

```yaml
type_reunion: (ex. Comité de pilotage, Assemblée générale)
lieu: 
heure_debut: 
heure_fin: 
president_seance: 
secretaire_seance: 
```

## Structure du procès-verbal

1. **Identification de la réunion** : nature, date, lieu, heures de début et de fin, président et secrétaire de séance (reprise des champs de l'en-tête sous forme lisible).
2. **Participants** : présents, absents excusés, absents. Un tableau Nom, Fonction, Statut.
3. **Ordre du jour** : liste numérotée, suivie si possible dans le même ordre que le déroulé.
4. **Déroulé par point** : une section par point de l'ordre du jour. Contenu : résumé des échanges en quelques phrases, puis la décision dans un bloc `DECISION` si une décision a été prise.
5. **Récapitulatif des décisions** : seulement si le document dépasse deux pages.
6. **Plan d'actions** : tableau Action, Responsable, Échéance. Chaque action existe aussi dans un bloc `ACTION` au point concerné si elle est importante.
7. **Prochaine réunion** : date, lieu, points déjà prévus.
8. **Signatures** : président et secrétaire de séance, si le PV est signé.

Le rapport de réunion reprend 1 à 3 en version courte, puis remplace le déroulé détaillé par une synthèse thématique, des constats et des recommandations.

## Règles spécifiques

- Reporter les propos au discours indirect, avec attribution : « M. Durand indique que le délai est tenu ». Pas de verbatim, sauf demande explicite.
- Employer un seul temps de narration d'un bout à l'autre (présent de narration ou passé composé), jamais un mélange.
- Séparer ce qui a été **discuté** de ce qui a été **décidé** : seul ce qui est décidé va dans un bloc `DECISION`.
- Chaque action a un responsable et une échéance. Si l'un des deux manque dans les notes, le signaler par un bloc `A-COMPLETER` plutôt que d'attribuer.
- Ne pas ajouter d'opinion, ni d'interprétation de l'auteur, dans un PV.
- Orthographier les noms exactement comme dans les sources ; en cas de doute, le signaler.

## Erreurs fréquentes

- Oublier l'heure de fin ou la liste des absents excusés.
- Actions sans responsable ou sans échéance.
- Résumer les échanges au point de perdre l'argument qui a motivé la décision.
- Mêler une opinion personnelle au compte rendu.
- Reprendre l'ordre des notes plutôt que celui de l'ordre du jour.

## Mini-exemple

```markdown
## 2. Budget de l'exercice

M. Durand présente l'état des dépenses : 62 % du budget annuel sont engagés à fin septembre. Mme Ngo demande si les marges prévues pour la communication restent tenables. Après discussion, le comité estime que l'enveloppe suffit si aucun nouvel événement n'est ajouté avant décembre.

> [!DECISION]
> Le comité maintient le budget de communication à son niveau actuel et gèle tout nouvel événement jusqu'au 1er décembre.

> [!ACTION]
> Transmettre au comité l'état détaillé des engagements. Responsable : M. Durand. Échéance : 20 octobre 2026.
```
