# Journal de bord

Nom et prénom : guillaume riti 
Dépôt : https://github.com/guiguilantha/JEU-IA.git
Outil utilisé (Copilot, modèle affiché) : Copilot student 

Règle : tu colles ici le texte exact de tes prompts (copier-coller, pas de capture). Une entrée par défi. Ce que tu n'as pas gardé compte autant que ce que tu as gardé.

## Défi 1 - Complétion

- Commentaire ou début de code que j'ai écrit :

``` js
// AFFICHER LE NOMBRE DE CRISTAUX ATTRAPÉS SUR L'ÉCRAN DE FIN DANS finScore 
```

- Ce que Copilot a proposé : finScore.textContent += " | CRISTAUX : " + cristaux;
- Ce que j'ai accepté, modifié ou refusé, et pourquoi : j'ai accepter le code donné car toute les variable etait  définie. 
- Comment j'ai vérifié que ça marche : le jeux marche bien sur la page de fin le nombre de cristaux attraper est bien afficher 

## Défi 2 - Ask

- Ma question (prompt exact) : 

``` 
je voudrai savoir comment il fle code fait pour que les objet tombe aléatoirment ?
```

- Une affirmation de la réponse que j'ai vérifiée : Les objets tombent de manière aléatoire grâce à Math.random() et à la fonction creerObjet
- Comment je l'ai vérifiée (un changement dans le code, un test dans le jeu) : j'ai desactiver le random en fixant le X des cristaux a 240
- Résultat : exacte, fausse ou incomplète : les cristaux tombe tous de la meme zone 

## Défi 3 - Plan

- Mon prompt en mode Plan :

``` js 
/plan Je veux ajouter un cristal de glace, plus rare que le doré. Quand on l'attrape, tous les
objets ralentissent pendant 4 secondes, puis reprennent leur vitesse. Respecte les règles de
.github/copilot-instructions.md. Propose un plan sans modifier le code.
```

- Le plan est dans le fichier `PLAN.md`.
- Ce que j'ai changé dans le plan avant de le valider (étape retirée, ajoutée, contrainte) et pourquoi : les choix confirmés sont : 3 % de rareté, ralentissement à 50 % pendant 4 secondes, score et combo d’un cristal normal, avec une apparence bleu clair. Le plan a été enregistré dans l’état de session ; aucun code du projet n’a été modifié.

## Défi 4 - Agent

- Mon prompt en mode Agent :

``` js
## Objectif

Modifie les textures et le décor du jeu pour créer une ambiance d’apocalypse zombie avec une ville en ruine.

## Contexte

Le jeu « Récif de Néon » est réalisé en HTML, CSS et JavaScript simples.
Le décor est dessiné directement dans le canvas, principalement dans `dessin.js`.
Le jeu doit continuer à fonctionner en ouvrant directement `index.html`.

## Contraintes

- Ajouter une ville en ruine en arrière-plan.
- Utiliser des bâtiments cassés, des fenêtres détruites, des fissures et de la fumée.
- Utiliser des couleurs sombres, vert toxique, gris, marron et rouge sang.
- Garder les objets du jeu visibles et faciles à reconnaître.
- Ne pas modifier les règles du jeu.
- Ne pas utiliser d’image ou de bibliothèque externe.
- Respecter les noms et la structure du code existant.
- Après toute modification de JavaScript, lancer `node --check`.
- Garder le code simple et lisible.

## Format attendu

Analyse d’abord `dessin.js`, `style.css` et `index.html`.
Présente ensuite un court plan, puis modifie le décor.
Indique les fichiers modifiés et explique comment vérifier le résultat dans le navigateur.
```

- Fichiers que l'agent a modifiés : dessin.js, style.css, index.html
- Ce que j'ai relu dans les changements avant d'accepter : dessin.js
- Ce que j'ai refusé, corrigé ou fait refaire : j'ai corriger les couleur.
- Mon jeu après l'agent (une phrase) : Le décor a été modifié pour créer une ambiance d’apocalypse zombie.

## Défi 5 - Pull request et revue

- Lien de ma pull request : https://github.com/guiguilantha/JEU-IA/pulls?q=is%3Apr+state%3Aclosed 
- Commentaire de la revue Copilot que j'ai traité (le texte) : Copilot was unable to review this pull request because the user who requested the review has insufficient remaining quota. Try requesting a review at a lower effort level.
- Ma décision (corrigé ou refusé) et pourquoi : garder le code 
- Lien de mon jeu publié : https://guiguilantha.github.io/JEU-IA/

## Bilan (3 lignes maximum)

- Ce que l'assistant a fait mieux ou plus vite que moi : le dessin du décor et la mise en place de l'ambiance d'apocalypse zombie.
- Ce qu'il a mal fait ou ce que j'ai dû corriger : l'UX 
- Ce que je ne lui laisserais pas faire : l'UX et le choix des couleurs.
