# Charte graphique

Contenu : 1. Principe · 2. Les jetons · 3. Cas 1 : charte fournie · 4. Cas 2 : charte à améliorer · 5. Cas 3 : charte par défaut · 6. Extraire une charte d'un document · 7. Règles de sécurité

## 1. Principe

Une charte est un ensemble de **jetons** (couleurs, polices, tailles, marges, logo) stocké dans un fichier `charte.json`. Le générateur ne contient aucune valeur de design : il lit uniquement ce fichier. Changer de charte revient donc à changer de fichier, sans toucher au contenu ni au script.

Le champ `charte` de `fiche-cadrage.md` détermine le cas : `fournie`, `a_ameliorer` ou `defaut_premium`. Le champ `ajustements_charte` précise les modifications que l'utilisateur souhaite.

## 2. Les jetons

Le schéma complet est dans `assets/charte-defaut.json`. Grandes familles :

- `page` : format, marges, distance de l'en-tête et du pied.
- `polices` : texte, titres, secondaire, code.
- `tailles_pt`, `interligne`, `espacement_pt` : échelle typographique et rythme vertical.
- `couleurs` : texte, secondaire, accent, attention, filets, fonds.
- `couverture`, `tableaux`, `blocs` : comportements propres à ces éléments.
- `pagination` : seuil du sommaire, saut avant annexes, saut avant chaque section.
- `logo` : chemin du fichier et hauteur, ou `null`.
- `nom`, `origine`, `version` : identification de la charte.

Les couleurs s'écrivent en hexadécimal **sans le dièse** (`1E3A5F`), format attendu par la bibliothèque de génération.

## 3. Cas 1 : charte fournie

1. Identifier la source : fichier JSON déjà au bon format, guide de marque (PDF, DOCX, image) ou description écrite.
2. Traduire en jetons : couleurs exactes, noms de polices, tailles, marges, logo. Partir de `assets/charte-defaut.json` et remplacer uniquement ce que la charte précise. Tout jeton non précisé garde la valeur par défaut.
3. Renseigner `origine` avec la source (par exemple `Guide de marque client X, v2`).
4. Vérifier les polices : sont-elles installées sur le poste ? Sinon, le dire et proposer une police de repli, car le PDF et le DOCX ne se rendraient pas comme prévu.
5. Appliquer **strictement**. Ne pas corriger ni embellir la charte de sa propre initiative : une charte fournie est une contrainte du client.

## 4. Cas 2 : charte à améliorer

L'utilisateur veut partir d'une charte existante et l'améliorer ou la corriger. Procéder en trois temps :

1. **Traduire** la charte en jetons comme au cas 1.
2. **Auditer** selon les critères ci-dessous et dresser une liste de corrections proposées, chacune avec sa justification.
3. **Présenter la liste et attendre l'accord de l'utilisateur** avant de l'appliquer. Ne rien changer sans validation. Appliquer ensuite uniquement les corrections acceptées, et noter dans `charte.json` ce qui a été modifié par rapport à l'origine.

Critères d'audit :

| Critère | Seuil ou règle |
|---|---|
| Contraste du texte courant | rapport d'au moins 4,5:1 avec le fond |
| Contraste du grand texte et des éléments graphiques | au moins 3:1 |
| Familles de polices | deux au maximum |
| Couleurs d'accent | une seule, éventuellement une seconde pour les alertes |
| Échelle de titres | rapport régulier (autour de 1,2 à 1,33) entre niveaux |
| Taille du corps | 10 à 11,5 pt |
| Interligne du corps | 1,3 à 1,5 |
| Longueur de ligne | 60 à 90 caractères environ |
| Marges | au moins 20 mm de chaque côté |
| Hiérarchie | un titre se distingue du texte par au moins deux variables (taille, graisse, espace) |

Calculer les rapports de contraste, ne pas les estimer à l'œil.

## 5. Cas 3 : charte par défaut

Utiliser `assets/charte-defaut.json` tel quel, avec les éventuels `ajustements_charte` de la fiche. Écrire le résultat dans `charte.json` pour que les documents suivants du même client restent cohérents.

## 6. Extraire une charte d'un document

Quand l'utilisateur dit « utilise le style de ce document » :

- **DOCX** : lire les styles et les propriétés de page dans les fichiers XML de l'archive (polices, tailles, couleurs, marges) plutôt que de les deviner d'après le rendu.
- **PDF** : lire les polices avec `pdffonts` et mesurer les marges et les tailles sur les pages converties en images ; les couleurs se relèvent sur l'image.
- **Image ou capture** : relever couleurs et proportions par observation et le signaler comme approximatif.

Présenter la charte extraite à l'utilisateur avant de l'appliquer, en précisant ce qui est mesuré et ce qui est estimé.

## 7. Règles de sécurité

- Le logo fourni est utilisé tel quel : pas de recoloration ni de déformation, proportions conservées, zone de protection d'au moins la moitié de sa hauteur.
- Ne jamais intégrer dans une charte un fichier dont la provenance ou les droits d'usage sont douteux (police sous licence non vérifiée, par exemple) sans le signaler.
- Une charte propre à un client ne sert qu'à ce client : ne pas la réutiliser pour un autre document sans que l'utilisateur le demande.
