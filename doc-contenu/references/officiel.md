# Famille : officiel

Types couverts : courrier, note de service, convocation, attestation, communiqué.

## Finalité

Ces documents sont courts et engageants. Le lecteur doit comprendre en quelques lignes qui écrit, à propos de quoi, ce qui est attendu de lui et pour quand. Ils peuvent avoir une valeur administrative ou juridique : l'exactitude des noms, des dates et des références prime sur le style.

## Champs additionnels de l'en-tête

```yaml
expediteur: (nom, fonction, organisation, coordonnées)
destinataire: (nom, fonction, organisation, adresse)
lieu: 
objet: 
references: (ex. Réf. 2026/114, vos réf., nos réf.)
pieces_jointes: (liste, ou « aucune »)
```

Le champ `titre` reste obligatoire : pour un courrier, il reprend l'objet.

## Structure du courrier

1. **Bloc expéditeur et destinataire**, repris de l'en-tête.
2. **Lieu et date.**
3. **Références et objet.** L'objet tient en une ligne et dit ce que le courrier demande ou annonce.
4. **Formule d'appel** : « Madame, Monsieur, » ou nominative si le destinataire est connu.
5. **Corps** : un paragraphe par idée. En général : le contexte en une ou deux phrases, la demande ou l'information principale, l'échéance éventuelle, ce qui se passe ensuite.
6. **Formule de politesse.**
7. **Signature** : nom et fonction.
8. **Pièces jointes**, si applicable.

## Structure de la note de service

1. **Émetteur, destinataires, date.**
2. **Objet.**
3. **Corps** : ce qui change ou ce qui est demandé, à partir de quand, pour qui, avec quelles exceptions.
4. **Entrée en vigueur** et durée si elle est limitée.
5. **Contact** pour toute question.

## Structure de la convocation

1. **Émetteur, destinataires, date d'envoi.**
2. **Objet** : nature de la réunion ou de l'événement.
3. **Date, heure et durée prévue, lieu ou lien de connexion.**
4. **Ordre du jour**, numéroté.
5. **Documents à lire ou à apporter.**
6. **Modalités de réponse** : confirmation de présence, procuration, date limite.

## Règles spécifiques

- **Une seule demande principale par courrier.** Si le sujet en contient plusieurs, les numéroter.
- **Les dates, heures, lieux et délais en toutes lettres et sans ambiguïté** : « avant le vendredi 30 octobre 2026, à 17 heures ».
- **Formules de politesse selon la langue du document** et le niveau de formalité :
  - français formel : « Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées. »
  - français semi-formel : « Je vous prie de recevoir, Madame, Monsieur, mes cordiales salutations. »
  - anglais : « Yours faithfully » (destinataire inconnu) ou « Yours sincerely » (destinataire connu).
- **Ne pas ajouter de formules de remerciement ou de politesse non sollicitées** au-delà de l'usage normal de la langue.
- **Tenir sur une page** pour un courrier ou une note, sauf nécessité.
- Pas de listes à puces dans le corps d'un courrier : des paragraphes. La numérotation reste acceptable dans une convocation ou une note qui énumère des points.
- Ne pas inventer d'adresse, de numéro de référence ou de nom de signataire : signaler chaque absence par un bloc `A-COMPLETER`.

## Erreurs fréquentes

- Objet vague (« À propos de votre dossier »).
- Demande noyée au milieu d'un long paragraphe.
- Date limite sans date précise.
- Registre qui oscille entre familier et formel.
- Oublier les pièces jointes citées dans le texte.

## Mini-exemple

```markdown
---
titre: Demande de report de la réunion du comité
expediteur: Marie Ngo, Secrétaire générale, Association X
destinataire: Monsieur le Président du comité
lieu: Yaoundé
objet: Demande de report de la réunion du 15 octobre 2026
references: Réf. SG/2026/041
pieces_jointes: aucune
date: 2 octobre 2026
---

Monsieur le Président,

Plusieurs membres du comité ne pourront pas assister à la réunion prévue le 15 octobre 2026, en raison d'un déplacement commun à cette date.

Je vous demande donc de bien vouloir reporter la réunion à la semaine du 19 octobre 2026. Une réponse avant le vendredi 9 octobre 2026 nous permettrait de prévenir tous les participants dans les délais.

Veuillez agréer, Monsieur le Président, l'expression de mes salutations distinguées.

Marie Ngo
Secrétaire générale
```
