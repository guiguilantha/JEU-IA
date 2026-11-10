Plan proposé
Aucun fichier du dépôt n’a été modifié.

1. Ajouter les réglages
Dans config.js :

Ajouter le type GLACE.
Ajouter une couleur bleu clair.
Ajouter une rareté de 3 %, inférieure aux 5 % du cristal doré.
Ajouter une durée de ralentissement de 4 secondes.
Ajouter un facteur de vitesse de 0,5, soit 50 % de la vitesse normale.

2. Reconnaître le cristal de glace
Dans jeu.js :

Modifier la sélection aléatoire du type d’objet.
Donner au cristal de glace une priorité correcte afin qu’il ne soit pas confondu avec le cristal doré.
Lui attribuer une taille et une vitesse cohérentes avec les autres objets.
3. Gérer son effet
Toujours dans jeu.js :

Ajouter un chronomètre d’effet de glace.
Quand le cristal est attrapé, régler ce chronomètre à 4 secondes.
Multiplier la vitesse de déplacement de tous les objets par 0.5 pendant l’effet.
Revenir automatiquement à la vitesse normale quand le chronomètre arrive à zéro.
Donner au cristal de glace le même score et le même combo qu’un cristal normal.

4. Dessiner le cristal
Dans dessin.js :

Ajouter un rendu bleu clair distinct.
Réutiliser le dessin de cristal existant plutôt que dupliquer toute la logique.
N’utiliser aucune image externe.

5. Vérifier le résultat
Exécuter node --check sur chaque fichier JavaScript modifié.
Ouvrir index.html.
Vérifier qu’un cristal de glace apparaît rarement.
Vérifier qu’après l’avoir attrapé, les objets ralentissent pendant 4 secondes puis reprennent leur vitesse.
Vérifier que les bombes, cristaux normaux et cristaux dorés conservent leur comportement.
Les choix confirmés sont : 3 % de rareté, ralentissement à 50 % pendant 4 secondes, score et combo d’un cristal normal, avec une apparence bleu clair. Le plan a été enregistré dans l’état de session ; aucun code du projet n’a été modifié.