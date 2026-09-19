# Politique de travail — CEY Website & CEY Admin

1. **Travailler étape par étape** : Découper chaque travail en étapes unitaires claires.
2. **Strict nécessaire** : Faire uniquement les modifications demandées et celles strictement nécessaires.
3. **Préservation de l'existant** : Ne pas casser les fonctionnalités existantes.
4. **Phase de test utilisateur** : Après chaque modification, laisser l'utilisateur tester avant de continuer.
5. **Validation requise** : Ne passer à l'étape suivante qu'après confirmation explicite par l'utilisateur que le test est réussi.
6. **Branches Git** : Avant chaque grande modification, proposer un nom de branche en anglais (ne jamais créer de branche automatiquement).
7. **Commits Git** : Ne proposer un nom de commit en anglais qu'après la réussite confirmée du test de la modification précédente. Ne pas donner de nouveau nom de branche ou de commit si l'étape précédente a échoué. Ne jamais créer de commit automatiquement.
8. **GitHub** : Ne jamais pousser vers GitHub sans autorisation explicite.
9. **Séparation stricte des projets** : Ne pas mélanger les projets :
   - `cey-website` (site public)
   - `cey-dashboard` (dashboard admin)
10. **Contrôle qualité** : Vérifier la syntaxe et le fonctionnement après chaque changement important.
11. **Opérations destructives proscrites** : Ne jamais effectuer d'opération dangereuse ou destructive sans prévenir et obtenir une confirmation explicite.
12. **Protection du code existant** : Ne pas supprimer de code dans `cey-website` (par exemple `app/admin/`) sans validation explicite.
13. **Vérification finale** : Toujours vérifier et lister les fichiers modifiés avant de clôturer une étape.
