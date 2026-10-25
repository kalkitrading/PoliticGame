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
- **Dette écologique** : elle monte chaque semaine. Canicules, sécheresses et blocages agricoles suivent. Elle n'arrête pas la partie : si rien n'est voté pour le climat, l'effondrement systémique s'ajoute à la fin, quel que soit le gagnant de l'élection.
- **Mode Ne pas déranger** : le temps file et la batterie se recharge, mais tes ministres répondent, votent et prennent des initiatives à ta place.
- **Citoyens** : Ginette, Lucas, Aminata, Patrice et Moussa t'écrivent pendant le mandat. Leur sort dépend de tes choix et s'affiche dans l'épilogue « Ce qu'ils sont devenus ».
- **Programmes** : avant de commencer, tu choisis ton programme (Justice sociale, Urgence climatique, Libérer les énergies, L'Ordre, Ni l'un ni l'autre). Il fixe le groupe que tu diriges à l'Assemblée, tes alliés de départ et 4 promesses à tenir.
- **Fenêtre d'Overton** : chaque choix fait glisser ce qui est « dicible » dans le pays. Plus elle glisse à droite, plus le barrage contre le RH s'effondre.
- **Élection à deux tours** : en semaine 8, six candidats. Tu gagnes si tu es populaire et fidèle à ton programme. Sinon, tes électeurs trahis votent pour celui qui a fait ce que tu as fait : le Centre si tu as trahi vers le centre, le RH si tu as glissé à droite ou écrasé la rue, l'Hexagonie Indomptée si la rue est restée forte et écoutée.
- **Coups bas** : diaboliser un adversaire, exploiter une révélation de L'Écho, louer une ferme à trolls, ressortir des dossiers « arrangés »… ou subir une vidéo truquée, un hashtag assassin, un chantage. Chaque coup bas change l'image des candidats à l'élection, et un mensonge peut être démonté plus tard par un fact-check.
- **La Pente** : si tu reportes les élections, le mandat continue 4 semaines. Huit décrets « raisonnables » arrivent dans l'appli Parapheur, du recensement aux convois. Un Conseiller poli t'encourage avec les phrases de l'expérience de Milgram. Tu peux refuser à chaque étape (au 4e refus, l'expérience s'arrête pour toi) ; un décret laissé sans réponse est signé par le Secrétariat général. Les mots changent, les conversations se taisent, l'interface se ternit. Le jeu ne récompense aucune signature.
- **Chaque camp a son mandat** : les messages, les crises, les tweets et le Fil changent selon ton programme. À gauche (Justice sociale), ce sont les patrons, les tracteurs et les pétroliers qui bloquent le pays, la base syndicale réclame les cent jours, et les propositions réelles de la gauche reviennent (IVG dans la Constitution, interdiction des LBD, nationalisation de la sidérurgie, blocage des prix, RIC, prix plancher agricole). Chez les Verts (Urgence climatique), ce sont les gilets jaunes, les routiers, les chasseurs et la Fédération des Exploitants : taxe carbone, gazole détaxé, méga-bassines, autoroute à moitié construite, néonicotinoïdes face à une pétition record, PFAS et lobby de la poêle, nucléaire, soupe sur la Joconde. La colère de la rue y porte le RH, et l'« état d'urgence climatique » ouvre la même Pente que la loi Sécurité Absolue. À droite (Libérer les énergies), la grève contre ta réforme est la tienne, mais la voix change : l'affaire des costumes, le RSA sous conditions, l'AME, le voile dans le sport, la présomption de légitime défense, le référendum sur l'immigration, et surtout l'union des droites, qui peut t'ouvrir une majorité ou rendre le RH respectable. Chaque message garde une réponse fidèle, un compromis et une trahison : tu peux rester humaniste jusqu'au bout ou finir plus à droite que la droite.
- **8 semaines** de crise jusqu'à l'élection (12 dans La Pente), 19 fins à découvrir.

## Fichiers

- `content.js` : personnages, événements, publications, fins. C'est là qu'on écrit le jeu.
- `content-parlement.js` : groupes parlementaires, textes de loi, chefs de groupe, écologie.
- `content-citoyens.js` : citoyens récurrents, épilogues, initiatives des ministres en mode Ne pas déranger.
- `content-programmes.js` : programmes, promesses, fenêtre d'Overton, calcul de l'élection et fins selon le gagnant (partagé avec le simulateur).
- `content-gouvernements.js` : ce qui change selon ton gouvernement : ministres, première décision économique, budget, gestion de la police.
- `content-coupsbas.js` : coups bas lancés ou subis, et leur effet sur l'image des candidats.
- `content-pente.js` : La Pente (décrets, Conseiller, citoyens, mots qui changent, épilogues et fins de cette branche).
- `content-gauche.js` : la partie vue depuis un gouvernement de gauche (variantes des messages, nouvelles crises, Fil, publications, titres des semaines). Les autres camps suivront le même modèle (`variants[programme]`, `weeksBy`, `ambientBy`, `postsBy`).
- `content-verts.js` : la même chose pour un gouvernement écologiste.
- `content-droite.js` : la même chose pour un gouvernement de droite classique.
- `game.js` : moteur (temps, batterie, fuites, fins) et rendu des applis du téléphone.
- `style.css`, `index.html` : interface.
- `tools/equilibrage.js` : simulateur d'équilibrage. `node tools/equilibrage.js 1000` joue 1 000 parties pour chaque programme et chaque profil de joueur (fidèle, moyen, traître vers la droite, traître vers le centre, immobile) et affiche la répartition des fins. `node tools/equilibrage.js 1 fidele social` détaille une partie.
