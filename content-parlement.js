// Ne Pas Déranger — l'Assemblée : groupes, textes de loi, chefs de groupe, écologie.
// Groupes parodiques d'un pays fictif. Les positions sont caricaturées exprès, dans tous les sens.
//
// Pour chaque texte, st[groupe] = probabilité de base de voter pour.
// yes / no / buried = effets si adopté / rejeté / enterré. against = effets si TON groupe vote contre.
// rel = changement d'humeur des groupes envers toi. eco = dette écologique (100 = effondrement).

(() => {
  const C = window.CONTENT;

  // de gauche à droite dans l'hémicycle
  C.groups = [
    { id: "HI",  name: "L’Hexagonie Indomptée", seats: 85,  col: "#d1342f", rel: 15, T: 60, leader: "Maxime Tonnerre" },
    { id: "VP",  name: "Les Verts Pâles",       seats: 38,  col: "#3aa864", rel: 35, T: 50, leader: "Capucine Lombric" },
    { id: "PP",  name: "Le Parti du Peut-Être", seats: 66,  col: "#e46a97", rel: 40, T: 35, leader: "Olivier Hésitant" },
    { id: "CA",  name: "Le Centre Absolu",      seats: 168, col: "#f0b429", rel: 90, T: 35, leader: "Édouard Lisse" },
    { id: "DIV", name: "Divers & Égarés",       seats: 33,  col: "#8d93a5", rel: 50, T: 30, leader: "" },
    { id: "DP",  name: "La Droite Patrimoniale", seats: 47, col: "#4a86e0", rel: 50, T: 25, leader: "Bertrand Héritage" },
    { id: "RH",  name: "Rassemblement Hexagonal", seats: 140, col: "#22356f", rel: 30, T: 20, leader: "Steeve Frontière" },
  ];

  Object.assign(C.contacts, {
    frontiere: { name: "Steeve Frontière", role: "Président du groupe RH", av: "🧱", col: "#22356f" },
    tonnerre:  { name: "Maxime Tonnerre", role: "Président du groupe HI", av: "⚡", col: "#d1342f" },
    lombric:   { name: "Capucine Lombric", role: "Présidente du groupe VP", av: "🪱", col: "#3aa864" },
    hesitant:  { name: "Olivier Hésitant", role: "Président du groupe PP (peut-être)", av: "🤷", col: "#e46a97" },
    heritage:  { name: "Bertrand Héritage", role: "Président du groupe DP", av: "🏰", col: "#4a86e0" },
    meteo:     { name: "Météo-Hexagonie", role: "Vigilance", av: "🌡️", col: "#c2410c" },
    agri:      { name: "Syndicat Agricole Majoritaire", role: "", av: "🚜", col: "#6b8e23" },
  });

  // ---------------------------------------------------------------- TEXTES DE LOI
  C.laws = [
    // ===== Semaine 1
    { id: "l_budget", w: 1, at: 0.2, by: S => S.me,
      title: "Budget 2027",
      desc: "Le budget de l’État. Sans lui, pas d’argent. Avec lui, pas d’amis. Comme chaque année, il manque une soixantaine de voix.",
      st: S => C.proximityStance(S, 0.95),
      yes: { fx: { budget: 12 }, news: "Budget 2027 adopté : « Un budget de responsabilité », selon les responsables" },
      no: { fx: { budget: -10, colere: 3 }, news: "Budget rejeté : l’Hexagonie vit à crédit, les marchés froncent les sourcils" },
      buried: { fx: { budget: -12 }, news: "Aucun budget voté : l’État tourne avec le budget de l’an dernier, et la photocopieuse de l’an dernier" } },

    { id: "l_jets", w: 1, at: 0.55, by: "VP",
      title: "Interdiction des jets privés",
      desc: "Les milliardaires devront prendre le train. En première classe, on n’est pas des monstres.",
      st: { HI: 0.9, VP: 1, PP: 0.75, CA: 0.3, DIV: 0.4, DP: 0.05, RH: 0.25 },
      yes: { fx: { eco: -10, patrons: -8, jeunes: 5, ouvriers: 3 }, rel: { VP: 10, HI: 4, DP: -6 },
             news: "Jets privés interdits : Vallon-Dividende découvre le TGV et porte plainte contre le wagon-bar",
             posts: [["@CapucineLombric", "Victoire ! Les riches vont enfin respirer le même air que nous. Un peu moins pollué, du coup."]] },
      no: { fx: { jeunes: -3 }, news: "Jets privés : l’Assemblée défend la liberté de polluer en altitude" } },

    // ===== Semaine 2
    { id: "l_preference", w: 2, at: 0.15, by: "RH",
      title: "« Préférence Hexagonale »",
      desc: "Allocations, logements sociaux et emplois publics réservés aux Hexagoniens « de souche ». Il faudra présenter l’acte de naissance de son arrière-grand-mère. En trois exemplaires.",
      st: { HI: 0, VP: 0, PP: 0.03, CA: 0.3, DIV: 0.35, DP: 0.55, RH: 1 },
      yes: { fx: { jeunes: -8, retraites: 5, police: 4, patrons: -5, colere: 9 }, rel: { RH: 15, HI: -15, VP: -10, PP: -10 }, set: { prefHex: true },
             news: "Préférence Hexagonale adoptée : les mairies submergées de demandes d’actes de naissance d’arrière-grands-mères",
             posts: [["@SteeveFrontiere", "Historique. L’Hexagonie aux Hexagoniens. (Sauf le Président : sa grand-mère est belge, on vérifie.)"],
                     ["@Lea_Sciences_Po", "Ma mère est infirmière, née à Dakar, 30 ans de service public. Elle vient de perdre son logement social. Merci l’Assemblée."]] },
      no: { fx: { retraites: -2 }, news: "Préférence Hexagonale rejetée : Steeve Frontière dénonce « une Assemblée hors-sol »" },
      against: S => S.flags.pacteRH ? { rel: { RH: -25 }, news: "Steeve Frontière : « Le Président a trahi sa parole. Nous, on ne trahit jamais. Sauf quand ça arrange »" } : null },

    { id: "l_smic", w: 2, at: 0.45, by: "HI",
      title: "SMIC à 2 000 € net",
      desc: "Financé par une taxe sur les dividendes, les yachts et « tout ce qui brille ».",
      st: { HI: 1, VP: 0.8, PP: 0.75, CA: 0.1, DIV: 0.3, DP: 0, RH: 0.3 },
      yes: { fx: { ouvriers: 12, jeunes: 6, patrons: -12, budget: -5, colere: -10 }, rel: { HI: 10, PP: 4, DP: -8 },
             news: "SMIC à 2 000 € : liesse dans les supermarchés, malaise au Mouvement des Entreprises Dodues",
             posts: [["@MaximeTonnerre", "Le peuple a gagné. Ce soir, pâtes au beurre ET au fromage."]] },
      no: { fx: { ouvriers: -4, colere: 3 }, news: "SMIC à 2 000 € rejeté : les députés, payés 7 600 € par mois, jugent la mesure « irréaliste »" } },

    // ===== Semaine 3
    { id: "l_immigration", w: 3, at: 0.12, by: "CA",
      title: "Loi Immigration « Équilibrée »",
      desc: "On reprend 80 % du programme du RH, avec un ton apaisé et une police de caractère plus douce. Clémence appelle ça « la fermeté humaniste ».",
      st: { HI: 0, VP: 0, PP: 0.1, CA: 0.7, DIV: 0.45, DP: 0.8, RH: 0.65 },
      yes: { fx: { retraites: 5, police: 5, jeunes: -8, colere: 5 }, rel: { RH: 10, HI: -10, VP: -8, PP: -8 }, set: { loiImmig: true },
             news: "Loi Immigration adoptée grâce au RH. Steeve Frontière : « Une victoire idéologique. Merci qui ? »",
             posts: [["@SteeveFrontiere", "Le gouvernement copie nos idées. La prochaine fois, ils copieront aussi nos fautes d’orthographe."]] },
      no: { fx: { retraites: -3, police: -2 }, news: "Loi Immigration rejetée : trop molle pour le RH, trop dure pour la gauche, incompréhensible pour le centre" },
      buried: { news: "La loi Immigration est enterrée. Personne n’avait compris ce qu’elle contenait, de toute façon." } },

    { id: "l_renov", w: 3, at: 0.5, by: "VP",
      title: "Plan Rénovation",
      desc: "Isoler 5 millions de passoires thermiques en 5 ans. Des emplois, moins de factures, moins de CO₂. Seul défaut : c’est une bonne idée, donc ça coûte.",
      st: { HI: 0.85, VP: 1, PP: 0.9, CA: 0.5, DIV: 0.6, DP: 0.3, RH: 0.3 },
      yes: { fx: { eco: -15, budget: -8, ouvriers: 6, retraites: 4 }, rel: { VP: 10, PP: 4 },
             news: "Plan Rénovation adopté : 200 000 emplois annoncés, 3 logements isolés pour l’instant" },
      no: { fx: { retraites: -2 }, news: "Plan Rénovation rejeté : les Hexagoniens continueront de chauffer les oiseaux" } },

    // ===== Semaine 4
    { id: "l_climat_raisonnable", w: 4, at: 0.1, by: "CA",
      title: "Loi Climat « Ambition Raisonnable »",
      desc: "Neutralité carbone en 2097. Crédit d’impôt pour les SUV électriques de 3 tonnes. Une éolienne par département, dans le jardin du maire d’opposition.",
      st: { HI: 0.15, VP: 0.3, PP: 0.5, CA: 0.9, DIV: 0.5, DP: 0.55, RH: 0.3 },
      yes: { fx: { eco: -6, patrons: 3, jeunes: -2 },
             news: "Loi Climat adoptée. Les climatologues : « C’est un pansement sur un volcan »",
             posts: [["@CapucineLombric", "2097. Pourquoi pas 3000 ? Au moins, plus personne ne serait là pour vérifier."]] },
      no: { news: "Même la loi Climat « raisonnable » est rejetée. Le climat, lui, ne vote pas." } },

    { id: "l_heritage", w: 4, at: 0.4, by: "DP",
      title: "Loi « Héritage »",
      desc: "Suppression des droits de succession au-delà de 10 M€. Mériter sa fortune, c’est fatigant. La recevoir, c’est plus simple.",
      st: { HI: 0, VP: 0.05, PP: 0.05, CA: 0.5, DIV: 0.4, DP: 1, RH: 0.4 },
      yes: { fx: { patrons: 12, ouvriers: -8, jeunes: -5, budget: -6, colere: 6 }, rel: { DP: 15, HI: -8, PP: -4 },
             news: "Loi Héritage adoptée : 4 000 familles soulagées, 68 millions de personnes pas concernées",
             posts: [["@BertrandHeritage", "Ma grand-mère est émue. Elle a 12 immeubles et une larme."]] },
      no: { news: "Loi Héritage rejetée : les héritiers devront, horreur, payer comme tout le monde" },
      against: S => S.flags.promesseDP ? { rel: { DP: -25 }, news: "TRAHISON : Bertrand Héritage accuse le Président d’avoir « menti à sa grand-mère »" } : null },

    // ===== Semaine 5
    { id: "l_regul", w: 5, at: 0.12, by: "HI",
      title: "Régularisation des travailleurs sans-papiers",
      desc: "Soutenue par… le patronat du BTP et de la restauration. Ils construisent nos routes, livrent nos repas et gardent nos enfants. Idée : arrêter de faire semblant qu’ils n’existent pas.",
      st: { HI: 1, VP: 0.95, PP: 0.8, CA: 0.3, DIV: 0.4, DP: 0.2, RH: 0 },
      yes: { fx: { patrons: 4, budget: 5, jeunes: 6, retraites: -6, police: -4, colere: -3 }, rel: { HI: 8, VP: 5, RH: -15, DP: -5 },
             news: "250 000 travailleurs régularisés : ils vont enfin payer des impôts. Ils sont ravis, paraît-il",
             posts: [["@SteeveFrontiere", "SCANDALE. Des travailleurs non déclarés remplacés par… des travailleurs déclarés. Où va le pays ?"],
                     ["@MiloDu93", "mon pote bosse ici depuis 12 ans sans papiers. ce soir il pleure. merci pour une fois"]] },
      no: { fx: { jeunes: -3 }, news: "Régularisation rejetée : les livreurs continueront de livrer les députés sans exister" } },

    { id: "l_permis", w: 5, at: 0.4, by: "RH",
      title: "Déchéance de nationalité pour les mauvais conducteurs",
      desc: "Trois points perdus = un aller simple vers « le pays d’origine ». Pour les Hexagoniens de souche, un stage de récupération de points suffira.",
      st: { HI: 0, VP: 0, PP: 0, CA: 0.15, DIV: 0.25, DP: 0.3, RH: 0.95 },
      yes: { fx: { jeunes: -6, retraites: 2, colere: 5 }, rel: { RH: 10, HI: -10, VP: -5 },
             news: "Premier expulsé pour excès de vitesse : un chauffeur de taxi né à Lyon, renvoyé vers… Lyon. La préfecture « étudie le dossier »" },
      no: { news: "La déchéance pour excès de vitesse rejetée. Steeve Frontière promet de revenir « à 130 km/h »" } },

    { id: "l_kerosene", w: 5, at: 0.65, by: "VP",
      title: "Taxe kérosène et fin des vols courts",
      desc: "Plus de vols intérieurs quand le train fait moins de 4 h, et une taxe sur le kérosène. Les ministres découvrent le train.",
      st: { HI: 0.8, VP: 1, PP: 0.75, CA: 0.4, DIV: 0.4, DP: 0.1, RH: 0.1 },
      yes: { fx: { eco: -12, patrons: -6, retraites: -2, budget: 5 }, rel: { VP: 8 },
             news: "Fin des vols courts : un ministre bloqué 6 h en gare de Vierzon, « une expérience humaine bouleversante »" },
      no: { news: "Taxe kérosène rejetée : « Le ciel appartient à ceux qui peuvent se le payer »" } },

    // ===== Semaine 6
    { id: "l_retraite", w: 6, at: 0.1, by: S => (S.me === "DP" ? "DP" : "CA"),
      title: S => S.flags.ret65 ? "Retraite à 65 ans" : "Retraite à 67 ans",
      desc: S => S.flags.ret65
        ? "Version « compromis » négociée avec le PP. Deux ans de moins que prévu, deux ans de plus qu’avant. Tout le monde est mécontent : c’est donc un bon compromis."
        : "Travailler plus longtemps pour mourir plus près de son poste. Le Conseil d’orientation des retraites dit que ce n’est pas nécessaire. On ne lui a pas demandé.",
      st: S => ({ HI: 0, VP: 0, PP: S.flags.ret65 ? 0.6 : 0.05, CA: 0.8, DIV: 0.35, DP: 0.8, RH: 0.15 }),
      yes: S => S.flags.ret65
        ? { fx: { budget: 6, ouvriers: -6, retraites: -3, colere: 6 }, news: "Retraite à 65 ans adoptée : « Un compromis historique », selon le PP, qui hésite encore" }
        : { fx: { budget: 10, ouvriers: -12, retraites: -6, colere: 12 }, rel: { HI: -8, PP: -6 },
            news: "Retraite à 67 ans : « Vous pourrez profiter de 3 bonnes années », promet le ministre",
            posts: [["@PatriceDu59", "67 ans. Mon père est mort à 66. Il était en avance, faut croire."]] },
      no: { fx: { budget: -4 }, news: "Réforme des retraites rejetée : un ministre fond en larmes, puis part en retraite anticipée" } },

    { id: "l_commission", w: 6, at: 0.5, by: "PP",
      title: "Commission sur la création d’une commission",
      desc: "Une commission chargée d’étudier l’opportunité de créer une commission sur le pouvoir d’achat. Premières conclusions attendues en 2031. Peut-être.",
      st: { HI: 0.3, VP: 0.6, PP: 1, CA: 0.6, DIV: 0.7, DP: 0.5, RH: 0.4 },
      yes: { fx: { colere: -2, budget: -1 }, rel: { PP: 10 },
             news: "Adoptée : la commission sur la commission se réunira en 2031, sous réserve",
             posts: [["@OlivierHesitant", "Grande victoire. Ou pas. On verra. #PeutÊtre"]] },
      no: { rel: { PP: -5 }, news: "La commission sur la commission est rejetée. Le PP envisage de réfléchir à une réaction" } },

    // ===== Semaine 7
    { id: "l_mur", w: 7, at: 0.1, by: "RH",
      title: "« Bouclier Hexagonal »",
      desc: "Un mur de 3 mètres le long de toute la frontière. Coût : 14 milliards. Avec la montée des eaux, il servira aussi de digue. Le RH appelle ça « l’écologie patriotique ».",
      st: { HI: 0, VP: 0, PP: 0, CA: 0.2, DIV: 0.3, DP: 0.4, RH: 1 },
      yes: { fx: { eco: 5, budget: -10, police: 4, jeunes: -8, retraites: 3, colere: 6 }, rel: { RH: 12, HI: -10, VP: -10 },
             news: "Le mur est voté. Premier problème : l’Hexagonie a aussi une frontière maritime. Le RH propose un mur flottant" },
      no: { news: "Le mur est rejeté. Steeve Frontière : « Nous construirons le mur, et c’est l’Assemblée qui paiera »" } },

    { id: "l_climat_urgence", w: 7, at: 0.45, by: "VP",
      title: "Loi Climat d’urgence",
      desc: "Soutenue par 4 000 scientifiques. Neutralité carbone en 2040, sortie des pesticides, plan train massif. Les lobbies ont déjà réservé tous les restaurants autour de l’Assemblée.",
      st: { HI: 0.75, VP: 1, PP: 0.7, CA: 0.35, DIV: 0.4, DP: 0.05, RH: 0.05 },
      yes: { fx: { eco: -25, patrons: -8, ouvriers: -4, jeunes: 10, retraites: -3, colere: 2 }, rel: { VP: 15, HI: 5, DP: -8 },
             news: "Loi Climat d’urgence adoptée : les scientifiques pleurent de joie, les lobbyistes pleurent tout court" },
      no: { fx: { jeunes: -6 }, news: "Loi Climat d’urgence rejetée. Les 4 000 scientifiques retournent à leurs courbes" },
      against: S => S.flags.promesseVP ? { rel: { VP: -20 }, news: "Capucine Lombric : « Le Président m’a menti. Le climat, lui, ne ment pas »" } : null },

    // ===== Semaine 8
    { id: "l_revocation", w: 8, at: 0.1, by: "HI", revoke: true, when: S => S.me !== "HI",
      title: "Référendum révocatoire du Président",
      desc: "Si la majorité des électeurs le demande, le Président est révoqué. Le RH, qui déteste l’HI, trouve l’idée « intéressante ». Tout le monde la trouve intéressante, sauf toi.",
      st: { HI: 1, VP: 0.8, PP: 0.5, CA: 0, DIV: 0.4, DP: 0.1, RH: 0.8 },
      yes: { news: "Référendum révocatoire adopté : le vote a lieu dans 48 heures" },
      no: { news: "Référendum révocatoire rejeté : le Président garde son poste, et une sueur froide" } },

    { id: "l_feries", w: 8, at: 0.45, by: "CA",
      title: "Loi « Jours Fériés Rendus »",
      desc: S => S.stats.feries > 0
        ? "On rend les deux jours fériés supprimés. À une semaine de l’élection. Pure coïncidence."
        : "Un jour férié de plus : le « Jour du Président ». À une semaine de l’élection. Pure coïncidence.",
      st: { HI: 0.5, VP: 0.6, PP: 0.8, CA: 0.95, DIV: 0.6, DP: 0.3, RH: 0.6 },
      yes: { fx: { ouvriers: 8, jeunes: 3, budget: -4, patrons: -5, feries: -2 },
             news: "Jours fériés rendus à 6 jours de l’élection : « Aucun rapport », jure l’Élysée" },
      no: { news: "Même les jours fériés sont rejetés. L’Assemblée n’aime vraiment personne." } },
  ];

  // ---------------------------------------------------------------- SMS DES CHEFS DE GROUPE
  C.events.push(
    { id: "w1_tonnerre", w: 1, at: 0.84, from: "tonnerre", when: S => S.me !== "HI",
      m: ["Président, Maxime Tonnerre, Hexagonie Indomptée.",
          "Je vous préviens : au premier 49.3, je dépose une motion de censure. Au deuxième aussi. Au troisième, je dors à l’Assemblée."],
      c: [
        { t: "Bonne nuit, alors.", cost: 2, r: "Rira bien qui censurera le dernier.", rel: { HI: -3 } },
        { t: "On peut discuter.", cost: 4, r: "Discuter, c’est bien. Augmenter le SMIC, c’est mieux.", rel: { HI: 6 } },
      ],
      d: { r: "Pas de réponse. Je prends ça pour du mépris. J’ai une grande expérience du mépris." } },

    { id: "w2_frontiere", w: 2, at: 0.08, from: "frontiere", when: S => S.me !== "RH",
      m: ["Président. Steeve Frontière.",
          "On peut s’entendre. Tu soutiens ma Préférence Hexagonale, et le RH ne votera jamais la censure. Parole de patriote."],
      c: [
        { t: "Marché conclu.", cost: 5, r: "Excellent. Je savais qu’au fond, tu étais des nôtres. Tout au fond.",
          rel: { RH: 20 }, set: { pacteRH: true },
          leak: { p: 0.6, fx: { jeunes: -10, colere: 8 }, rel: { HI: -10, VP: -10, PP: -10 },
                  news: "RÉVÉLATIONS : un pacte secret entre l’Élysée et le RH, par SMS" } },
        { t: "Jamais.", cost: 3, r: "Dommage. On se reverra au moment de la censure.", rel: { RH: -10 } },
      ],
      d: { r: "Le silence, c’est déjà un peu un oui. On en reparlera." } },

    { id: "w3_heritage", w: 3, at: 0.3, from: "heritage", when: S => S.me !== "DP",
      m: ["Président, Bertrand Héritage.",
          "Mes 47 députés sont à vous… si vous votez ma loi Héritage la semaine prochaine. Ma grand-mère vous embrasse. Elle a 12 immeubles."],
      c: [
        { t: "Promis.", cost: 4, r: "Parfait. Ma grand-mère vous enverra une carte. Elle l’écrit sur un lingot.",
          rel: { DP: 15 }, set: { promesseDP: true } },
        { t: "Non.", cost: 3, r: "Vous le regretterez. Mes avocats héritent aussi de mes rancunes.", rel: { DP: -5 } },
      ],
      d: { r: "Pas de réponse. Je note. Je note tout, c’est héréditaire." } },

    { id: "w4_lombric", w: 4, at: 0.52, from: "lombric", when: S => S.me !== "VP",
      m: ["Président, Capucine Lombric. L’eau monte. Littéralement.",
          "Soit vous soutenez une vraie loi climat, soit les noyés de cette semaine seront sur votre conscience. Et sur mon compte Le Fil."],
      c: [
        { t: "Je soutiendrai votre prochaine loi climat.", cost: 4, r: "Je l’imprime et je l’encadre. Sur papier recyclé.", rel: { VP: 15 }, set: { promesseVP: true } },
        { t: "L’écologie punitive, non merci.", cost: 3, r: "Vous savez ce qui est punitif ? Un fleuve dans votre salon.", rel: { VP: -10 }, fx: { jeunes: -4 } },
      ],
      d: { r: "Pas de réponse. Comme la planète, en fait. Elle non plus ne répond plus." } },

    { id: "w6_hesitant", w: 6, at: 0.04, from: "hesitant", when: S => S.me === "CA" || S.me === "DP",
      m: ["Président, Olivier Hésitant, Parti du Peut-Être.",
          "On pourrait ne pas voter la censure sur les retraites… si c’était 65 ans au lieu de 67. Ou 66. On hésite. Mais plutôt 65. Je crois."],
      c: [
        { t: "Deal : 65 ans.", cost: 5, r: "Formidable. Enfin, je crois. Je consulte le groupe. Ils hésitent. C’est bon signe.",
          rel: { PP: 20, DP: -5 }, set: { ret65: true } },
        { t: "Ce sera 67.", cost: 3, r: "Bon. Alors on votera peut-être la censure. Sans doute. Probablement.", rel: { PP: -8 } },
      ],
      d: { r: "Pas de réponse. On hésitait déjà, maintenant on hésite encore plus." } },
  );

  // ---------------------------------------------------------------- ÉCOLOGIE : ÉVÉNEMENTS ALÉATOIRES
  C.pool.push(
    { id: "p_canicule", minW: 3, from: "meteo", when: S => S.eco >= 60,
      m: ["Vigilance rouge : 41 °C en novembre. Les hôpitaux saturent, les vignes brûlent.", "Le ministère de la Santé réclame un plan d’urgence."],
      c: [
        { t: "Plan canicule d’urgence.", cost: 5, r: "Plan lancé. On rouvre les piscines municipales qu’on avait fermées par économie.",
          fx: { budget: -5, retraites: 4 } },
        { t: "Distribuez des éventails tricolores.", cost: 3, r: "Les éventails sont « made in » ailleurs. Mais tricolores.",
          fx: { retraites: -8, colere: 4 }, news: "Canicule : l’État distribue des éventails tricolores aux plus de 75 ans" },
      ],
      d: { r: "Pas d’instruction. On a conseillé de « boire de l’eau ». Il n’y en a plus.", fx: { retraites: -6, blesses: 40 } } },

    { id: "p_secheresse", minW: 4, from: "agri", when: S => S.eco >= 70,
      m: ["Sécheresse totale. Plus une goutte dans les rivières.", "On bloque les autoroutes avec nos tracteurs tant qu’on n’a pas nos méga-bassines."],
      c: [
        { t: "Méga-bassines pour tous.", cost: 4, r: "Merci Président. On pompera la nappe jusqu’à la dernière goutte, promis.",
          fx: { eco: 5, patrons: 3, jeunes: -5 }, set: { megabassines: true }, news: "Méga-bassines : le gouvernement cède, les nappes phréatiques aussi" },
        { t: "Partage de l’eau et aides à la transition.", cost: 6, r: "Partager ? On n’a pas l’habitude. Mais on prend les aides.",
          fx: { budget: -6, eco: -4, ouvriers: 2 } },
        { t: "Envoyez les CRS contre les tracteurs.", cost: 4, r: "Les tracteurs pèsent 12 tonnes. Les CRS, 80 kilos. Je vous laisse faire le calcul.",
          fx: { ordre: 3, retraites: -6, colere: 6 }, news: "Pour la première fois, la police charge des tracteurs. Les tracteurs ont gagné." },
      ],
      d: { r: "Pas de réponse. Les autoroutes sont bloquées. Le fumier, lui, est livré devant les préfectures.", fx: { ordre: -5, colere: 4 } } },
  );

  // ---------------------------------------------------------------- PUBLICATIONS DES CHEFS DE GROUPE (Le Fil)
  C.ambient.tense.push(
    ["@SteeveFrontiere", "Le gouvernement est à bout de souffle. Nous, on a du souffle. Et des propositions de loi."],
    ["@CapucineLombric", "Il fait 24 °C en novembre et l’Assemblée débat de la couleur des drapeaux. #Climat"],
  );
  C.ambient.angry.push(
    ["@MaximeTonnerre", "Le 49.3, c’est la démocratie en mode avion. #Censure"],
  );

  // ---------------------------------------------------------------- ALERTES
  // Envoyées une seule fois, quand une jauge approche d'une fin brutale.
  C.alerts = [
    { id: "a_patrons", from: "parti", when: S => S.g.patrons < 20,
      m: ["Président, alerte : le patronat appelle nos députés un par un.",
          "Si leur soutien tombe sous 5 %, le groupe votera la censure. Ils ont déjà imprimé les bulletins."],
      c: [
        { t: "Je vais les rassurer.", cost: 2, r: "Vite. Ils aiment les baisses d’impôts et les dîners en terrasse." },
        { t: "Qu’ils essaient.", cost: 2, r: "Ils vont essayer." },
      ],
      d: { r: "Pas de réponse. Les patrons prennent ça pour du mépris. Ils n’ont pas tort." } },
    { id: "a_police", from: "general", when: S => S.g.police < 20,
      m: ["Président, la troupe gronde. Les policiers ne vous suivent plus.",
          "Sous 8 % de soutien, je ne réponds plus de rien. Enfin si : je réponds de tout. Moi."],
      c: [
        { t: "Message reçu.", cost: 2, r: "Je l’espère." },
        { t: "C’est une menace ?", cost: 2, r: "C’est une prévision météo. Avec des chars." },
      ],
      d: { r: "Pas de réponse. Les casernes en prennent note." } },
    { id: "a_budget", from: S => S.flags.rabotVire ? "bercy" : "rabot", when: S => S.budget < 15,
      m: ["Les caisses sont presque vides. À zéro, le FMI débarque.",
          "Il faut trouver de l’argent. N’importe où. Même dans le canapé de l’Élysée."],
      c: [
        { t: "Je m’en occupe.", cost: 2, r: "J’ai déjà vérifié le canapé : 3 € et une télécommande." },
        { t: "On empruntera.", cost: 2, r: "Les prêteurs aussi lisent les sondages." },
      ],
      d: { r: "Pas de réponse. Le FMI a réservé un hôtel à côté." } },
    { id: "a_colere", from: "clemence", when: S => S.colere >= 85,
      m: ["Président, la rue est à bout. Si l’ordre lâche, c’est la révolution.",
          "J’ai repéré les sorties de secours. Il y en a trois. Deux sont murées."],
      c: [
        { t: "Je vais calmer le jeu.", cost: 2, r: "Bonne idée. Commence par ne rien écrire de cynique." },
        { t: "La police tiendra.", cost: 2, r: "La police aussi lit Le Fil." },
      ],
      d: { r: "Pas de réponse. J’ai rangé mes affaires dans un sac. Au cas où." } },
    { id: "a_eco", from: "lombric", when: S => S.eco >= 72,
      m: ["Président, les scientifiques sont formels : on approche du point de non-retour.",
          "Si rien n’est voté pour le climat, c’est l’effondrement d’ici quelques semaines. Ce n’est pas une métaphore."],
      c: [
        { t: "Je vais agir.", cost: 2, r: "Je vous crois à moitié. C’est déjà beaucoup.", rel: { VP: 5 } },
        { t: "Encore cette chanson.", cost: 2, r: "La chanson, c’est le bruit des incendies.", rel: { VP: -5 } },
      ],
      d: { r: "Pas de réponse. La planète non plus ne répond plus." } },
  ];

  // ---------------------------------------------------------------- NOUVELLES FINS
  Object.assign(C.endings, {
    censure: { title: "Censuré",
      text: "Motion de censure adoptée par {n} voix. Le RH et l’HI ont voté ensemble, puis se sont lavé les mains. Ton gouvernement tombe. Ton deuxième Premier ministre aussi. Le troisième refuse le poste par SMS. Tu restes Président d’un palais vide, et tu écris à des ministres qui n’existent plus." },
    effondrement: { title: "Effondrement systémique",
      text: "Été 2027 : 52 °C à Lyon. Les récoltes ont brûlé, les assureurs ont fait faillite, les fleuves sont à sec. Ton dernier post : « Ensemble, adaptons-nous. » Publié depuis un bunker climatisé. Les historiens qui restent appellent ça « la décennie où personne n’a rien voté »." },
    revoque: { title: "Révoqué",
      text: "L’Assemblée a voté le référendum révocatoire, tes propres frondeurs compris. {n} % des Hexagoniens ont voté pour ton départ. Les autres n’ont pas trouvé leur bureau de vote. Tu quittes l’Élysée à pied : la voiture de fonction, elle, n’a pas été révoquée." },
  });
})();
