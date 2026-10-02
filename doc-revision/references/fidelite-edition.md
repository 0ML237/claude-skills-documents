# Fidélité en édition et restructuration

Contenu : 1. Pourquoi ce contrôle · 2. Méthode · 3. Règles de lecture du résultat · 4. Cas particuliers · 5. Rapport

## 1. Pourquoi ce contrôle

Quand on édite un document existant, la crainte principale est la modification involontaire : un chiffre qui change, un passage validé qui disparaît, une phrase reformulée alors qu'elle devait rester telle quelle. Ce contrôle compare le document d'origine et le résultat, puis vérifie que **seuls les changements annoncés ont eu lieu**.

Il s'applique aux tâches `edition` et `restructuration`. Pour `redesign`, adapter : le texte doit être identique mot pour mot (seule la mise en forme change), donc toute différence de texte est un constat.

## 2. Méthode

1. **Extraire le texte** des deux versions dans un format comparable : `pandoc -t plain --wrap=none` pour les DOCX, `pdftotext` pour un PDF. Normaliser : espaces multiples, espaces insécables, sauts de ligne.
2. **Découper par paragraphe**, en rattachant chaque paragraphe à sa section (le dernier titre rencontré).
3. **Aligner** les paragraphes des deux versions (comparaison par similarité, car un paragraphe reformulé ou déplacé n'est pas identique mot pour mot).
4. **Classer chaque différence** :
   - ajout (présent seulement dans le résultat) ;
   - suppression (présent seulement dans l'original) ;
   - reformulation (même passage, texte différent) ;
   - déplacement (même texte, autre position) ;
   - modification de donnée (un nombre, une date, un nom ou une décision change).
5. **Rapprocher** les différences du journal `modifications.md`.
6. **Contrôler `a_conserver_intact`** : chaque élément de la liste (section, passage) doit être retrouvé à l'identique dans le résultat.

L'exécution est confiée à `scripts/comparer.py` ; la lecture et la décision restent à ce skill.

## 3. Règles de lecture du résultat

| Cas | Verdict |
|---|---|
| Différence présente **et** consignée dans `modifications.md` | Conforme |
| Différence **absente** du journal | Constat « À corriger » : soit le journal est incomplet, soit une modification n'était pas voulue |
| Entrée du journal **sans** différence correspondante | Constat « À corriger » : la modification annoncée n'a pas eu lieu |
| Élément de `a_conserver_intact` altéré, même légèrement | **Bloquant** |
| Modification de donnée (nombre, date, nom, montant, décision) absente du journal | **Bloquant** |
| Suppression d'un passage non consignée | **Bloquant** |
| Reformulation non consignée d'un passage non protégé | « À corriger » |

La différence entre un chiffre qui change et un mot qui change tient au risque : une erreur sur une donnée peut avoir des conséquences réelles, une retouche de style rarement.

## 4. Cas particuliers

- **Restructuration** : de nombreux déplacements sont attendus. Vérifier qu'ils sont consignés et que **rien n'a disparu dans le mouvement** : le nombre total d'éléments (paragraphes, lignes de tableau, actions) doit rester cohérent avec les suppressions annoncées.
- **Tableaux** : comparer cellule par cellule, pas en texte continu ; une ligne perdue passe inaperçue autrement.
- **Numérotation** : un renumérotage consécutif à un ajout ou à un déplacement est normal ; vérifier que les renvois ont suivi.
- **Mise en forme seule** : les différences de style ne sont pas des différences de contenu, sauf si elles changent le sens (un passage barré, une mise en évidence qui disparaît).
- **Révisions et commentaires de l'original** : s'ils ont été traités (acceptés, rejetés, supprimés), vérifier que cela correspond à la décision de l'utilisateur consignée dans le diagnostic.

## 5. Rapport

Ajouter au `rapport-controle.md` une section :

```markdown
## Fidélité à l'original
- Passages protégés contrôlés : [n] sur [n] intacts
- Changements consignés et constatés : [n]
- Changements constatés non consignés : [liste, avec gravité]
- Changements consignés non constatés : [liste]
- Éléments d'origine disparus : [liste ou « aucun »]
```

Un résultat sans écart de ce type est le signal le plus fort qu'une édition s'est bien passée.
