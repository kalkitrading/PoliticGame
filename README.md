# Ne Pas Déranger

Simulateur satirique de président, à jouer en vertical sur mobile.
Tu gouvernes la République (fictive) d'Hexagonie depuis ton téléphone : SMS des ministres,
appels urgents, réseau social, sondages. Réprime, négocie, mens ou ignore. Chaque message a un prix.

## Jouer

Ouvre `index.html` dans un navigateur (idéalement sur téléphone, ou en mode mobile des outils développeur).
Aucune installation, aucun build.

## Mécaniques

- **Batterie** : chaque réponse coûte de l'énergie. À 0 %, le téléphone s'éteint et tes ministres décident à ta place.
- **Silence** : un message ignoré déclenche la décision par défaut, souvent la pire.
- **Fuites** 🔓 : les réponses cyniques peuvent ressortir dans la presse quelques jours plus tard.
- **Colère cachée** : la répression calme la rue tout de suite mais la colère s'accumule. Tant que l'ordre tient, elle reste sous le couvercle.
- **Assemblée** : 577 sièges, 7 groupes (dont le Rassemblement Hexagonal, l'Hexagonie Indomptée, les Verts Pâles…). Chaque groupe dépose ses textes. Vote, 49.3 ou retrait : chaque 49.3 déclenche une motion de censure, et la patience de l'opposition s'use.
- **Dette écologique** : elle monte chaque semaine. Si rien n'est voté pour le climat, c'est l'effondrement systémique.
- **Mode Ne pas déranger** : le temps file et la batterie se recharge, mais tes ministres répondent, votent et prennent des initiatives à ta place.
- **Citoyens** : Ginette, Lucas, Aminata, Patrice et Moussa t'écrivent pendant le mandat. Leur sort dépend de tes choix et s'affiche dans l'épilogue « Ce qu'ils sont devenus ».
- **8 semaines** de crise jusqu'à l'élection, 13 fins à découvrir.

## Fichiers

- `content.js` : personnages, événements, publications, fins. C'est là qu'on écrit le jeu.
- `content-parlement.js` : groupes parlementaires, textes de loi, chefs de groupe, écologie.
- `content-citoyens.js` : citoyens récurrents, épilogues, initiatives des ministres en mode Ne pas déranger.
- `game.js` : moteur (temps, batterie, fuites, fins) et rendu des applis du téléphone.
- `style.css`, `index.html` : interface.
- `tools/equilibrage.js` : simulateur d'équilibrage. `node tools/equilibrage.js 3000` joue 3 000 parties par profil de joueur (hasard, répressif, social, stratège, joueur moyen…) et affiche la répartition des fins. `node tools/equilibrage.js 1 moyen` détaille une partie.
