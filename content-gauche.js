// Ne Pas Déranger — la partie vue depuis un gouvernement de gauche (programme « Justice sociale »).
// Chaque événement garde trois familles de réponses : fidèle (ce que dirait vraiment la gauche),
// compromis, et trahison (pour pouvoir glisser vers le centre ou la droite).
// Clins d'œil au réel : les « Pigeons » et l'exil fiscal (2012), le « mur de l'argent » (1924),
// le tournant de la rigueur (1983), Athènes 2015, la perquisition de 2018, la cravate de 2017,
// les propositions de loi de la gauche (IVG, LBD, blocage des prix, nationalisations, RIC…).
// Ici, la rue en colère, ce sont surtout les patrons, les tracteurs et la droite. La base, elle, s'impatiente.

(() => {
  const C = window.CONTENT;
  const P = "social";
  const all = () => [...C.events, ...C.pool, ...(C.alerts || [])];
  // variante d'un événement existant ; ov: false = la fenêtre d'Overton vient des fx de la variante
  const V = (id, v) => { const e = all().find(x => x.id === id); e.variants = { ...(e.variants || {}), [P]: v.c ? { ov: false, ...v } : v }; };

  const prog = C.programmes.find(p => p.id === P);
  // la rue en colère porte la droite classique, pas toi
  prog.street = "DP";
  // le grand jeudi de la semaine 2 n'est pas une manif contre toi, mais celle des patrons et des tracteurs
  prog.names = { ...(prog.names || {}), "Jeudi Noir": "Jeudi des Tracteurs", "JeudiNoir": "JeudiDesTracteurs" };

  Object.assign(C.contacts, {
    edito: { name: "Éditorialiste en chef", role: "InfoChoc 24", av: "🎙️", col: "#7a2d2d" },
  });

  // ---------------------------------------------------------------- LES SEMAINES
  C.weeksBy = C.weeksBy || {};
  C.weeksBy[P] = {
    1: { title: "Les Cent Jours", agenda: ["Lun — Premier Conseil des ministres du gouvernement populaire", "Jeu — Les marchés ouvrent. Ou pas."] },
    2: { title: "La Révolte des Pigeons", agenda: ["Jeu — Manifestation patronale « Laissez-nous entreprendre »", "Ven — 300 tracteurs montent sur la capitale"] },
    3: { title: "La Grève du Capital", agenda: ["Toute la semaine — Les pétroliers ferment les vannes", "Mer — Questions au gouvernement : « Venezuela ? »"] },
    5: { title: "La Perquisition", agenda: ["Mar — Perquisition au siège du parti", "Jeu — Réunion du groupe parlementaire"] },
    6: { title: "Le Mur de l’Argent", agenda: ["Lun — Les marchés attaquent la dette", "Ven — Sommet de l’Union Atlantique"] },
    7: { title: "L’Ultimatum de Bruxelles", agenda: ["Mar — Bruxelles exige un plan de rigueur", "Jeu — Débat télévisé"] },
  };

  // ================================================================ SEMAINE 1
  V("w1_intro", {
    m: ["Félicitations Président. 50,3 % des voix. Les marchés ont perdu 4 % dans la matinée, les éditorialistes douze points de tension.",
        "Rappel : chaque réponse vide ta batterie 🔋. Quand elle meurt, tes ministres décident à ta place.",
        "Et règle n° 1 à gauche : chaque phrase sera découpée et passée en boucle sur quatorze chaînes. Les réponses 🔓 peuvent fuiter."],
    c: [
      { t: "Compris.", cost: 2, r: "Parfait. J’ai préparé une cellule de riposte. Elle s’appelle « on dément tout, sauf le SMIC »." },
      { t: "Qu’ils viennent. On a le peuple avec nous.", cost: 2, r: "Le peuple, oui. Les chaînes d’info, non. On fera avec.", set: { arrogant: true } },
    ],
  });

  V("w1_maman", {
    m: ["Mon chéri tu passes à la télé jeudi ? Mets une cravate. Ah non, c’est vrai, vous n’en mettez plus, vous.",
        "Mets au moins une chemise repassée. Et mange, tu as une tête de motion de censure."],
  });

  V("w1_josy", {
    m: ["Bravo, camarade Président. L’Union des Travailleurs Fatigués est fière. Un peu moins fatiguée, même.",
        "Maintenant on attend : retraite à 60 ans, SMIC à 1 600 € net, dégel du point d’indice. Les cent jours, pas les cent ans."],
    c: [
      { t: "Tout sera voté dans les cent jours.", cost: 6, r: "On note la date. On note toujours la date.",
        fx: { colere: -6, ouvriers: 4, overton: -2 }, set: { centJours: true } },
      { t: "Il faudra du temps. Les marchés nous observent.", cost: 5, r: "Les marchés. Déjà. On a gagné il y a quatre jours.",
        fx: { colere: 4, ouvriers: -3, patrons: 3, overton: 1 } },
      { t: "Les syndicats n’ont pas à dicter la politique du gouvernement.", cost: 5, r: "On a entendu cette phrase pendant quarante ans. Jamais de la bouche d’un des nôtres.",
        fx: { colere: 8, ouvriers: -8, patrons: 4, overton: 3 },
        leak: { p: 0.6, fx: { ouvriers: -6, jeunes: -4 }, news: "FUITE : le Président de gauche à l’UTF : « Les syndicats n’ont pas à dicter la politique »" } },
    ],
    d: { r: "Pas de réponse. Ça commence bien.", fx: { colere: 4 } },
  });

  V("w1_prefet", {
    m: ["Préfet Garrot. Jeudi prochain : manifestation « Laissez-nous entreprendre ». Patrons, artisans, la droite, et 300 tracteurs.",
        "Je propose le même dispositif que pour les autres manifs : renforts, drones, LBD, interpellations préventives."],
    c: [
      { t: "Même droit de manifester pour tous. Dispositif léger.", cost: 6, r: "Des tracteurs en dispositif léger. Je décline toute responsabilité pour les pare-chocs.",
        fx: { ordre: -4, police: -4, patrons: 2, colere: -2, overton: -1 }, set: { leger: true } },
      { t: "Accordé. Pas de quartier.", cost: 6, r: "Avec plaisir. C’est la première fois qu’on me demande de gazer des notaires.",
        fx: { ordre: 8, police: 6, patrons: -8, colere: 8, gav: 300, overton: 3 }, set: { repression: true } },
      { t: "Faites ce qu’il faut.", cost: 4, r: "Je fais toujours ce qu’il faut. C’est ce qui m’inquiète chez moi.",
        fx: { ordre: 10, police: 8, colere: 10, gav: 600, overton: 4 }, set: { carteBlanche: true },
        leak: { p: 0.4, fx: { jeunes: -6, colere: 6 }, news: "Le Président de gauche au préfet : « Faites ce qu’il faut. » Le préfet a fait." } },
    ],
    d: { r: "Pas de réponse. J’improvise. J’adore improviser.", fx: { ordre: 10, police: 8, colere: 10, gav: 600, overton: 4 }, set: { carteBlanche: true } },
  });

  V("w1_kevin", {
    m: ["yo le Président 🔥 c Kévin (3,2M d’abonnés)",
        "jte propose un live : tu fais tes courses avec un SMIC pour montrer que tu sais combien coûte le beurre. 50k€ le placement"],
    c: [
      { t: "Banco. Mais sans le placement.", cost: 6, r: "gratuit ?? frère t’es un vrai de gauche toi. bon ok",
        fx: { jeunes: 4, retraites: 1 }, news: "Le Président fait ses courses avec un SMIC en direct : « Le beurre, c’est un scandale »" },
      { t: "Non. Je suis le Président.", cost: 2, r: "ok monsieur le président de tous les français 🙄", fx: { jeunes: -2 } },
    ],
  });

  // ================================================================ SEMAINE 2
  V("w2_josy_a", {
    m: S => S.flags.rigueur
      ? ["Vous avez reporté le SMIC et les retraites « pour rassurer Bruxelles ». On a voté pour vous, pas pour Bruxelles.",
         "Grève jeudi. Avec vos propres électeurs dans le cortège."]
      : ["L’emprunt, c’est bien, mais on ne voit rien venir. Les gens attendent leur fiche de paie, pas un plan à dix ans.",
         "Jeudi, on fait une marche « pour que la gauche reste à gauche ». Vous êtes invité."],
    c: [
      { t: "Vous avez raison. On applique le programme, maintenant.", cost: 10, when: S => S.flags.rigueur || S.flags.gelPensions || S.flags.emprunt,
        r: "Merci. On n’aura pas besoin de vous le rappeler deux fois. Enfin, on espère.",
        fx: { budget: -12, colere: -15, ouvriers: 10, retraites: 6, patrons: -10, overton: -3 }, set: { rigueur: false, gelPensions: false, recul: true },
        news: "Le gouvernement renonce au report : « Le programme, tout le programme »" },
      { t: "Je dégèle le point d’indice. Pour commencer.", cost: 8, r: "Pour commencer. On retient le mot.",
        fx: { retraites: 4, ouvriers: 4, budget: -5, colere: -4, overton: -1 } },
      { t: "Je ne gouverne pas pour la rue.", cost: 5, r: "Vous avez été élu par la rue. Elle s’en souviendra.",
        fx: { colere: 8, ouvriers: -6, patrons: 3, overton: 3 } },
    ],
    d: { r: "Pas de réponse. On marche jeudi.", fx: { colere: 6 } },
  });

  V("w2_josy_b", {
    m: ["Bravo pour la taxe sur les dividendes. Les patrons manifestent contre toi jeudi.",
        "Nous, on organise une contre-manifestation pour te soutenir. On t’invite. En baskets."],
    c: [
      { t: "J’y serai.", cost: 10, r: "Un Président dans un cortège syndical. Les éditorialistes vont faire des malaises. Parfait.",
        fx: { jeunes: 5, ouvriers: 6, retraites: -4, patrons: -6, police: -6, ordre: -3, colere: -4, overton: -3 }, set: { defile: true },
        news: "Le Président défile avec les syndicats face à la manifestation patronale" },
      { t: "Restez chez vous. Pas de provocation.", cost: 3, r: "D’accord. Mais eux, ils ne restent pas chez eux.", fx: { colere: -2 } },
    ],
  });

  V("w2_vallon_a", {
    m: ["Président. Édouard de Vallon-Dividende.",
        "Si votre taxe passe, je pars en Belgique. Un grand acteur l’a fait avant moi. Il a même eu un passeport russe en prime."],
    c: [
      { t: "Bon voyage. Et payez l’exit tax avant de partir.", cost: 5, r: "Vous me taxez même pour partir ? C’est du totalitarisme.",
        fx: { patrons: -6, ouvriers: 3, budget: -3, overton: -1 }, news: "Vallon-Dividende s’exile en Belgique : « Je suis un réfugié fiscal »" },
      { t: "Restez. On peut parler de vos investissements ici.", cost: 5, r: "Parler, oui. Payer, non. Mais parlons.", fx: { patrons: 4, colere: 2 } },
      { t: "On peut trouver un arrangement…", cost: 6, r: "Je savais que vous étiez raisonnable. Même à gauche, tout le monde a un prix.",
        fx: { patrons: 12, budget: -6, overton: 3 }, set: { taxeRiches: false, arrangement: true },
        leak: { p: 0.6, fx: { ouvriers: -12, jeunes: -10, colere: 10 }, news: "FUITE : le Président de gauche à Vallon-Dividende : « On peut trouver un arrangement… »" } },
    ],
  });

  V("w2_vallon_b", {
    m: ["Président, merci de ne pas avoir taxé les dividendes. Vraiment.",
        "Je vous invite à dîner au Fouquet’s pour en parler. Une tradition présidentielle, paraît-il."],
    c: [
      { t: "Non merci. Je dîne à la cantine de l’Élysée.", cost: 3, r: "La cantine. Vous êtes un homme étrange.", fx: { patrons: -3, ouvriers: 2 } },
      { t: "Avec plaisir.", cost: 4, r: "Formidable. Je réserve. Venez sans journaliste, surtout.",
        fx: { patrons: 8, overton: 2 },
        leak: { p: 0.6, fx: { ouvriers: -12, jeunes: -8, colere: 10 }, news: "Le Président de gauche dîne au Fouquet’s avec Vallon-Dividende. Photo à l’appui." } },
    ],
  });

  V("w2_call_prefet", {
    m: S => [S.flags.carteBlanche ? "Vous m’aviez dit de faire ce qu’il faut. Je fais ce qu’il faut ?" : "Jeudi, 15 h, devant la préfecture. Ça chauffe.",
             "Fumier sur les grilles, pneus en feu, un tracteur fonce sur le cordon. La contre-manif syndicale arrive en face. Je charge ?"],
    c: [
      { t: "Chargez.", cost: 4, r: "Bien reçu. On charge tout le monde. C’est plus simple.",
        fx: { ordre: 6, police: 5, patrons: -6, colere: 10, blesses: 340, gav: 800, overton: 3 }, set: { charge: true },
        news: "Charge contre les tracteurs et la contre-manif : 340 blessés" },
      { t: "Protégez les bâtiments. Séparez les cortèges. Pas de charge.", cost: 4, r: "Séparer des syndicalistes et des agriculteurs en colère. Je vous enverrai la facture des boucliers.",
        fx: { ordre: 2, colere: -4, police: -3, blesses: 30, gav: 100 }, news: "Manifestation patronale tendue mais sans charge : « Une première »" },
      { t: "Retirez-vous. Ils rentreront traire.", cost: 4, r: "Retirer. Je note l’heure. Je note toujours l’heure.",
        fx: { ordre: -12, police: -12, colere: -4, blesses: 10, overton: -1 }, set: { retrait: true },
        news: "La préfecture recouverte de fumier : la police s’était retirée" },
    ],
    d: { r: "Appel manqué. Le préfet a chargé. Tout le monde.", fx: { ordre: 6, police: 5, colere: 12, blesses: 410, gav: 900, overton: 3 }, set: { charge: true } },
  });

  V("w2_video_a", {
    m: ["🚨 Une vidéo cartonne : un CRS frappe un agriculteur à terre. 4 millions de vues.",
        "La droite parle de « dictature bolivarienne ». On dit quoi ?"],
    c: [
      { t: "Suspension du policier. Et une IGPN enfin indépendante.", cost: 6, r: "C’était dans le programme. Les syndicats de police, eux, vont adorer.",
        fx: { police: -12, jeunes: 6, retraites: 2, colere: -6, overton: -2 }, set: { igpnIndependante: true },
        news: "Violence contre un agriculteur : suspension du policier, l’IGPN deviendra indépendante" },
      { t: "Il faut attendre l’enquête.", cost: 5, r: "« Attendre l’enquête. » On a dénoncé cette phrase pendant dix ans.",
        fx: { police: 4, jeunes: -6, colere: 6, overton: 2 } },
      { t: "Il a dû glisser sur son tracteur.", cost: 4, r: "Je vais faire comme si je n’avais pas lu ça. Je le ferai mal.",
        fx: { police: 6, overton: 2 },
        leak: { p: 0.75, fx: { jeunes: -12, retraites: -8, colere: 12 }, news: "FUITE : « Il a dû glisser sur son tracteur », écrit le Président de gauche" } },
    ],
  });

  V("w2_video_b", {
    m: ["🚨 Sans police, des agriculteurs ont muré la permanence d’une députée écolo. Au fumier.",
        "La droite crie au laxisme, la gauche à la provocation. On dit quoi ?"],
    c: [
      { t: "La loi est la même pour tous. Poursuites.", cost: 5, r: "Contre des agriculteurs. Préparez-vous à un hiver de tracteurs.", fx: { ordre: 6, retraites: -2 } },
      { t: "C’est une colère légitime, mal exprimée.", cost: 5, r: "La députée écolo appréciera la nuance. Elle sent le fumier.", fx: { retraites: 3, jeunes: -3 } },
      { t: "Au moins, ils fertilisent.", cost: 4, r: "Je supprime ce message. De mon téléphone et de ma mémoire.",
        leak: { p: 0.6, fx: { retraites: -10, jeunes: -4, colere: 6 }, news: "FUITE : « Au moins, ils fertilisent » : le Président se moque des agriculteurs" } },
    ],
  });

  // ================================================================ SEMAINE 3
  V("w3_rabot", {
    m: ["Les pétroliers ferment les raffineries pour protester contre la taxe sur les superprofits. 60 % des stations à sec.",
        "Ils appellent ça « un arrêt technique ». Le technicien a un yacht."],
    c: [
      { t: "Réquisition des raffineries. Nationalisation s’il le faut.", cost: 8, r: "Nationaliser. Le mot fait toujours trembler les plateaux télé. Ça marche encore.",
        fx: { patrons: -8, ouvriers: 5, ordre: 4, budget: -9, colere: -2, overton: -4 }, set: { nationalisation: true },
        news: "Le gouvernement réquisitionne les raffineries : « Le pétrole appartient à la nation »" },
      { t: "On ouvre les stocks stratégiques.", cost: 8, r: "Les stocks de guerre. C’est une guerre, finalement. Une guerre de l’argent.",
        fx: { budget: -6, colere: -3, ordre: 2 } },
      { t: "Retirer la taxe sur les superprofits.", cost: 6, r: "Les pétroliers rouvrent dans l’heure. Ils ont gagné. Ils gagnent toujours quand on recule.",
        fx: { patrons: 10, ouvriers: -8, colere: 6, overton: 3 }, set: { arrangement: true },
        news: "Le gouvernement retire la taxe sur les superprofits : les raffineries rouvrent dans l’heure" },
    ],
    d: { r: "Pas de réponse. Les pétroliers attendent. Eux, ils ont le temps.", fx: { colere: 6, ordre: -3 } },
  });

  V("w3_josy", {
    m: ["Les syndicats sont avec vous contre les pétroliers. Les cheminots proposent même de transporter le carburant.",
        "En échange : SMIC à 1 600 € net par décret, tout de suite. Pas dans six mois."],
    c: [
      { t: "Deal. Décret ce soir.", cost: 8, r: "Ce soir. On n’y croyait plus. On y croit.",
        fx: { budget: -8, ouvriers: 10, jeunes: 4, patrons: -7, colere: -10, overton: -3 }, set: { dealSyndicat: true },
        news: "SMIC à 1 600 € net par décret : les patrons parlent de « fin du monde », les caissières de « fin du mois »" },
      { t: "D’abord le vote à l’Assemblée. On respecte les formes.", cost: 6, r: "Les formes. D’accord. Mais les formes, ça ne paie pas le loyer.",
        fx: { ouvriers: 3, colere: -3 } },
      { t: "Je ne négocie pas sous la pression.", cost: 6, r: "Ce n’est pas de la pression, c’est votre programme. Vous l’avez écrit.",
        fx: { ouvriers: -8, colere: 10, overton: 2 } },
    ],
    d: { r: "Pas de réponse. Les cheminots rentrent chez eux.", fx: { colere: 5 } },
  });

  V("w3_kevin", {
    m: ["frérot les chaînes d’info disent que tu vas transformer le pays en Venezuela 💀",
        "jte fais une vidéo « le président réagit aux mèmes Venezuela sur lui » ? ça peut rattraper"],
    c: [
      { t: "Go.", cost: 6, r: "y’en a un avec toi en béret, tu rigoles hein", fx: { jeunes: 4, budget: -1 } },
      { t: "Paie-le pour dire que tous les patrons fraudent.", cost: 5, r: "frère 80k€ et je dis ce que tu veux. même que les patrons fraudent (ça c’est facile)",
        leak: { p: 0.7, fx: { jeunes: -8, patrons: -6, retraites: -6, colere: 6 }, news: "FUITE : l’Élysée a payé Kévin 80 000 € pour attaquer les patrons" } },
      { t: "Pas le temps.", cost: 2, r: "ok. jferai la vidéo sans toi. elle s’appelle « le président a peur de Caracas »" },
    ],
  });

  // ================================================================ SEMAINE 5 : la perquisition
  V("w5_chloe", {
    m: ["Chloé Ferrand, L’Écho. Des policiers perquisitionnent en ce moment le siège de ton parti et l’appartement de M. Partage.",
        "Enquête sur les comptes de campagne. Les images tournent en boucle. Ta réaction ?"],
    c: [
      { t: "« La République, c’est moi ! »", cost: 4, r: "C’est… une phrase. Elle va te suivre longtemps. Très longtemps.",
        fx: { jeunes: 3, retraites: -8, colere: 4 }, image: { me: -3 },
        news: "« La République, c’est moi ! » : le Président face aux policiers, en direct" },
      { t: "Nous coopérons. Nous n’avons rien à cacher.", cost: 5, r: "Calme, sobre, républicain. Les chaînes d’info sont déçues.",
        fx: { retraites: 3, colere: -3 }, image: { me: 2 } },
      { t: "C’est une instrumentalisation politique de la justice.", cost: 5, r: "Ça, tout le monde le dit. La droite le dit aussi, quand c’est chez elle.",
        fx: { jeunes: 2, retraites: -4 }, image: { me: -1 } },
      { t: "M. Partage est suspendu immédiatement.", cost: 6, r: "Rapide. Il dit que c’est un complot. Il a peut-être raison, mais il est suspendu.",
        fx: { colere: -4, jeunes: 2 }, set: { rabotVire: true }, news: "Perquisition : M. Partage suspendu de son ministère « par précaution »" },
    ],
    d: { r: "Pas de réaction. J’écris : « L’Élysée se mure dans le silence ». Mes lecteurs adorent.", fx: { retraites: -4, colere: 4 } },
  });

  // ================================================================ SEMAINE 6
  V("w6_josy_hot", {
    when: S => S.colere >= 55 && !!(S.flags.rigueur || S.flags.arrangement),
    m: ["Vous avez reporté, puis reculé, puis reculé encore. On appelle ça le tournant de la rigueur. On l’a déjà vécu une fois.",
        "Grève générale lundi. Avec vos électeurs. Contre vous."],
    c: [
      { t: "Vous avez raison. On revient au programme.", cost: 10, r: "On verra. On a été trahis souvent. On verra.",
        fx: { budget: -12, colere: -22, patrons: -12, ouvriers: 14, jeunes: 8, overton: -3 }, set: { cede: true, rigueur: false } },
      { t: "Réquisitionner les grévistes.", cost: 8, r: "Un gouvernement de gauche qui réquisitionne des grévistes. Vous entrez dans les livres d’histoire. Pas dans le bon chapitre.",
        fx: { ordre: 8, colere: 12, ouvriers: -14, gav: 2000, overton: 5 }, set: { requisition: true } },
      { t: "Je démissionne ?", cost: 2, r: "…C’est une question ou une réponse ?", end: "burnout" },
    ],
  });

  V("w6_prefet", {
    m: ["Banlieue Nord : émeutes après la mort d’un jeune de 17 ans lors d’un contrôle routier.",
        "Deuxième nuit. 300 voitures brûlées. Les syndicats de police parlent de « nuisibles » dans un communiqué."],
    c: [
      { t: "J’irai à la marche blanche. Et le policier sera suspendu.", cost: 12, r: "Un Président à une marche blanche. Les syndicats de police menacent de « se mettre en retrait ».",
        fx: { jeunes: 8, police: -10, colere: -8, retraites: -4, overton: -3 },
        news: "Le Président à la marche blanche : « La police doit protéger, pas tuer »" },
      { t: "Couvre-feu et renforts.", cost: 6, r: "Les blindés sont prêts. Vos électeurs, eux, sont sous les blindés.",
        fx: { ordre: 8, jeunes: -12, colere: 10, police: 5, gav: 900, blesses: 150, overton: 4 } },
      { t: "C’est la faute des réseaux sociaux.", cost: 3, r: "Les réseaux sociaux. Un de vos prédécesseurs avait accusé les jeux vidéo. Vous progressez.",
        fx: { jeunes: -8, colere: 4, retraites: 3, overton: 2 }, news: "Émeutes : le Président de gauche accuse les réseaux sociaux" },
    ],
    d: { r: "Pas d’instruction. J’ai appliqué la doctrine. La doctrine, c’est moi.", fx: { ordre: 6, jeunes: -10, colere: 10, gav: 900, blesses: 200, overton: 4 } },
  });

  V("w6_clemence", {
    m: ["Idée : on lance le premier référendum d’initiative citoyenne. C’était dans le programme.",
        "Les éditorialistes vont faire des malaises. Les gilets de toutes les couleurs vont adorer."],
    c: [
      { t: "Lançons le RIC.", cost: 6, r: "Je prépare le site. Il va planter. Tout plante quand on donne la parole aux gens.",
        fx: { colere: -6, jeunes: 3, ouvriers: 3, retraites: -3, overton: -2 }, set: { ric: true },
        news: "Premier référendum d’initiative citoyenne : 4 millions de signatures en 48 heures" },
      { t: "D’abord une assemblée citoyenne tirée au sort.", cost: 5, r: "Tirée au sort. Comme à Athènes. L’ancienne, pas celle de 2015.",
        fx: { colere: -5 } },
      { t: "Pas besoin. On a été élus pour ça.", cost: 3, r: "« On a été élus pour ça. » Tous les présidents l’ont dit. Tous.",
        fx: { colere: 5, jeunes: -4, overton: 1 } },
    ],
  });

  // ================================================================ SEMAINE 7
  V("w7_eco_low", {
    m: ["Bruxelles et les marchés exigent un plan de rigueur. Sinon, les taux s’envolent.",
        "Ça s’est déjà passé à Athènes en 2015. Ils avaient voté non. Puis ils avaient dit oui."],
    c: [
      { t: "Référendum sur le plan de Bruxelles.", cost: 8, r: "Un référendum. Les marchés détestent la démocratie quand elle vote mal.",
        fx: { colere: -6, patrons: -7, jeunes: 4, ouvriers: 4, budget: -4, overton: -2 },
        news: "Le Président soumet le plan de Bruxelles à référendum : panique sur les marchés" },
      { t: "Taxer les transactions financières à la place.", cost: 6, r: "La taxe dont tout le monde parle et que personne ne fait. Vous la faites ?",
        fx: { budget: 4, patrons: -6, ouvriers: 2 } },
      { t: "Accepter le plan. Comme d’autres avant nous.", cost: 6, r: "Le tournant de la rigueur, version 2027. Les historiens avaient déjà le chapitre.",
        fx: { budget: 12, ouvriers: -10, retraites: -8, jeunes: -6, colere: 10, overton: 4 }, set: { rigueur: true },
        news: "Le gouvernement de gauche accepte le plan de rigueur de Bruxelles" },
    ],
  });

  V("w7_debat", {
    m: ["Débat télé jeudi, le dernier avant l’élection. Ils vont tous te parler du Venezuela.", "Ta stratégie ?"],
    c: [
      { t: "Défendre le bilan social, chiffres à l’appui.", cost: 6, r: "Le SMIC, les pensions, la cantine. Des chiffres. Les chiffres, ça ne fait pas peur.",
        fx: { ouvriers: 5, retraites: 4, colere: -4 } },
      { t: "Appeler à l’union de toute la gauche.", cost: 6, r: "L’union. Les Verts et le PP vont dire oui. Puis se disputer sur la virgule.",
        fx: { jeunes: 4 }, rel: { VP: 8, PP: 8 } },
      { t: "Durcir le ton sur la sécurité pour séduire le centre.", cost: 6, r: "Tu vas parler comme eux. Ils vont gagner deux fois.",
        fx: { police: 6, retraites: 4, jeunes: -8, overton: 5 } },
    ],
  });

  // ================================================================ ÉVÉNEMENTS ALÉATOIRES
  V("p_culture", {
    m: ["Président, je passe sur un plateau ce soir.", "Je peux dire que les milliardaires sont « des parasites » ? C’est sociologiquement défendable."],
    c: [
      { t: "Surtout pas !", cost: 3, r: "Dommage. Je dirai « des optimisateurs ». C’est plus élégant." },
      { t: "Vas-y, ça va buzzer.", cost: 3, r: "Ça a buzzé. Très fort. Dans les deux sens.",
        fx: { jeunes: 4, patrons: -4, retraites: -3, overton: -1 }, news: "La ministre de la Culture qualifie les milliardaires de « parasites »" },
    ],
    d: { r: "Pas de réponse, donc j’y vais. Je l’ai dit. Les deux camps sont ravis d’être furieux.", fx: { patrons: -4, jeunes: 2 } },
  });

  V("p_baguette", {
    m: ["Le prix de la baguette passe à 2 €. Les pâtes, l’huile et les couches suivent.", "Les gens remplissent leur caddie à moitié."],
    c: [
      { t: "Blocage des prix des produits de première nécessité.", cost: 5, r: "C’était dans le programme. La grande distribution parle de « soviétisation de la moutarde ».",
        fx: { budget: -4, ouvriers: 6, retraites: 4, patrons: -5, overton: -2 }, news: "Prix bloqués sur 100 produits de première nécessité" },
      { t: "C’est le marché.", cost: 3, r: "« C’est le marché. » Tu l’as dit avec ta voix, en plus.", fx: { ouvriers: -6, colere: 5, overton: 2 } },
      { t: "Qu’ils mangent de la brioche.", cost: 3, r: "…Vraiment ? Toi ?",
        leak: { p: 0.6, fx: { ouvriers: -12, retraites: -6, colere: 10 }, news: "« Qu’ils mangent de la brioche » : le Président de gauche cite l’Histoire. La mauvaise." } },
    ],
  });

  V("p_vente", {
    m: ["Les caisses fondent. Idée : on renationalise les autoroutes.", "Les péages rapportent 4 milliards par an aux concessionnaires. Ce serait à nous."],
    c: [
      { t: "Renationalisons.", cost: 5, r: "Les concessionnaires parlent de « spoliation ». Ils ont payé 15 milliards ce qui en vaut 40. Le rachat coûte cher, les péages rapporteront plus tard.",
        fx: { budget: -6, patrons: -8, ouvriers: 3, overton: -2 }, news: "Renationalisation des autoroutes : « Les péages appartiennent à ceux qui les paient »" },
      { t: "Pas maintenant, c’est trop cher.", cost: 3, r: "Trop cher. Pour eux, c’était donné.", fx: { budget: -2 } },
      { t: "Privatiser la Loterie Nationale, finalement.", cost: 4, r: "Privatiser. Un gouvernement de gauche. Je le note dans le registre des surprises.",
        fx: { budget: 12, patrons: 5, ouvriers: -6, overton: 3 } },
    ],
  });

  // ================================================================ CITOYENS
  V("c_lucas_blesse", {
    m: ["C’est Lucas. Celui de l’œil. J’étais dans la contre-manif, face aux tracteurs. Les CRS ont chargé tout le monde, nous aussi.",
        "Sous un gouvernement de gauche. Je suis porte-parole du collectif des blessés. On sera devant l’Élysée jeudi. Vous viendrez ?"],
  });
  V("c_lucas_ok", {
    m: ["Bonjour, c’est Lucas, 19 ans. J’étais à la contre-manif de jeudi. Je n’ai rien eu, j’ai eu de la chance.",
        "J’ai décidé de me présenter aux municipales. Un conseil ?"],
  });
  const lucasPost = C.citizenPosts.find(p => p.id === "cp_lucas_blesse");
  lucasPost.variants = { [P]: { t: "Contre-manif face aux tracteurs. Les CRS ont chargé tout le monde. Je ne reverrai plus de l’œil gauche. Sous un gouvernement de gauche." } };
  const lucasPost1 = C.citizenPosts.find(p => p.id === "cp_lucas1");
  lucasPost1.variants = { [P]: { t: "Contre-manif jeudi face à la manif des patrons. Ma mère a peur. Je lui ai dit qu’on était au pouvoir, maintenant. Elle a ri." } };

  // ================================================================ NOUVEAUX ÉVÉNEMENTS PROPRES À LA GAUCHE
  C.events.push(
    // la droite et les patrons bloquent le pays, quand tu tiens ton programme
    { id: "w6_blocage_droite", w: 6, at: 0.12, from: "agri",
      when: S => S.programme === P && S.g.patrons < 35 && !(S.flags.rigueur || S.flags.arrangement),
      ov: false,
      m: ["Les routiers, les agriculteurs et le patronat bloquent le pays contre votre politique. Ils appellent ça « la grève de l’investissement ».",
          "Ils exigent le retrait de la taxe sur les dividendes et du SMIC à 1 600 €."],
      c: [
        { t: "Je ne céderai pas au mur de l’argent.", cost: 8, r: "Le mur de l’argent. Il a fait tomber un gouvernement en 1924. On verra s’il est toujours aussi solide.",
          fx: { patrons: -6, ouvriers: 6, colere: 4, overton: -2 }, news: "« Je ne céderai pas au mur de l’argent » : le Président tient face aux blocages" },
        { t: "Négocier avec les PME, pas avec les multinationales.", cost: 8, r: "Diviser les patrons. Les petits contre les gros. Ça peut marcher. Ça a parfois marché.",
          fx: { colere: -10, patrons: 4, budget: -4 } },
        { t: "Je retire la taxe et le SMIC à 1 600 €.", cost: 6, r: "Ils lèvent les barrages en une heure. Ils ont gagné. Tes électeurs regardaient.",
          fx: { patrons: 15, colere: -20, ouvriers: -12, jeunes: -8, overton: 6 }, set: { arrangement: true },
          news: "Le gouvernement de gauche cède aux blocages patronaux et retire ses réformes" },
      ],
      d: { r: "Pas de réponse. Les barrages tiennent.", fx: { colere: 6, ordre: -6, budget: -6 } } },

    // les propositions phares de la gauche, au fil du mandat (avec un piège à chaque fois)
    { id: "g_ivg", w: 2, at: 0.9, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["On inscrit le droit à l’IVG dans la Constitution ? C’était une proposition de notre groupe. Elle avait été votée à 337 voix contre 32, il y a quelques années.",
          "Le Sénat voulait remplacer « droit » par « liberté ». Un mot. Toute la différence."],
      c: [
        { t: "Le droit. Pas la liberté. Le droit.", cost: 5, r: "Le mot exact. Les juristes vont pleurer de joie. Les autres vont pleurer tout court.",
          fx: { jeunes: 6, retraites: -2, overton: -2 }, rel: { VP: 5, PP: 5 }, news: "Le droit à l’IVG inscrit dans la Constitution, avec le mot « droit »" },
        { t: "« Liberté », pour avoir le Sénat avec nous.", cost: 4, r: "Un compromis. Le mot qui fâche personne et qui protège un peu moins.",
          fx: { jeunes: 2 }, rel: { DP: 3 } },
      ],
      d: { r: "Pas de réponse. On en reparlera. On en reparle depuis cinquante ans." } },

    { id: "g_lbd", w: 4, at: 0.15, from: "douce", when: S => S.programme === P && !S.flags.desarmement, ov: false,
      m: ["Président, Mme Douce. Notre groupe avait déposé une proposition pour interdire les LBD et les grenades en manifestation.",
          "On le fait ? Les syndicats de police menacent déjà de « se mettre en retrait »."],
      c: [
        { t: "On interdit les LBD en manifestation.", cost: 6, r: "C’est fait. Les manifestants vont peut-être garder leurs deux yeux. Les syndicats de police, eux, vont garder leur rancune.",
          fx: { police: -10, jeunes: 8, ordre: -4, overton: -3 }, set: { desarmement: true },
          news: "Les LBD interdits en manifestation : « Une police qui protège, pas qui mutile »" },
        { t: "On encadre leur usage, sans interdire.", cost: 5, r: "Un encadrement. Le mot préféré des ministères.", fx: { police: -2, jeunes: 2 } },
        { t: "On les garde. On n’est jamais trop prudents.", cost: 3, r: "On les garde. La police vous remercie. Lucas, un peu moins.",
          fx: { police: 6, jeunes: -6, overton: 2 } },
      ],
      d: { r: "Pas de réponse. On garde les LBD, par défaut. Le défaut, c’est toujours ce qui existe déjà.", fx: { police: 2 } } },

    { id: "g_arcelor", w: 5, at: 0.75, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, le groupe sidérurgique ferme deux hauts-fourneaux dans le Nord. 2 000 emplois. Il a touché 300 millions d’aides publiques l’an dernier.",
          "Notre groupe avait fait voter sa nationalisation à l’Assemblée. Coût estimé : 3 milliards. On y va ?"],
      c: [
        { t: "On nationalise.", cost: 8, r: "L’acier redevient public. Patrice va appeler sa femme en pleurant. De joie, cette fois.",
          fx: { budget: -11, ouvriers: 8, patrons: -7, overton: -3 }, set: { nationalisation: true },
          news: "Nationalisation de la sidérurgie : 2 000 emplois sauvés dans le Nord" },
        { t: "On exige le remboursement des aides publiques.", cost: 6, r: "Le remboursement. Ils ont des avocats pour ça. Nous aussi, maintenant.",
          fx: { budget: 3, ouvriers: 4, patrons: -4 } },
        { t: "C’est une décision européenne, pas la nôtre.", cost: 3, r: "« C’est européen. » La phrase que tous les gouvernements disent quand ils ne veulent rien faire.",
          fx: { ouvriers: -10, colere: 6, overton: 2 }, news: "Fermeture des hauts-fourneaux : le gouvernement de gauche renvoie à Bruxelles" },
      ],
      d: { r: "Pas de réponse. Les hauts-fourneaux s’éteignent ce soir.", fx: { ouvriers: -8, colere: 6 } } },

    { id: "g_venezuela", w: 4, at: 0.72, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["Les chaînes d’info parlent du « Venezuela hexagonal » 24 heures sur 24. Un éditorialiste a pleuré en direct sur le prix du caviar.",
          "On riposte comment ?"],
      c: [
        { t: "Inviter un économiste prix Nobel sur le plateau.", cost: 5, r: "Il a démonté le « Venezuela » en quatre minutes. L’éditorialiste a changé de sujet : l’insécurité.",
          fx: { retraites: 3 }, image: { me: 2 } },
        { t: "Boycotter ces chaînes.", cost: 3, r: "Ils font les émissions sans toi. Sur toi. Avec un fauteuil vide qui te ressemble.",
          fx: { jeunes: 2, retraites: -4 }, image: { me: -1 } },
        { t: "Faire racheter une chaîne d’info par un ami.", cost: 4, r: "Un ami milliardaire de gauche. On cherche encore. Il paraît qu’il en existe un.",
          fx: { budget: -1 },
          leak: { p: 0.5, fx: { jeunes: -6, retraites: -4 }, image: { me: -4 }, news: "Le Président aurait cherché un milliardaire pour racheter une chaîne d’info" } },
      ],
      d: { r: "Pas de riposte. Le Venezuela fait la une une semaine de plus." , image: { me: -2 } } },
  );

  V("w4_call_aubrac", {
    m: ["Président, le fleuve est sorti de son lit. 12 villages sous l’eau. Il me faut des hommes, tout de suite.",
        "Problème : tous les CRS du pays sont dans la capitale, face aux tracteurs."],
  });

  V("w6_josy_calm", {
    m: ["Les camarades sont prêts à défendre le gouvernement dans la rue contre les blocages patronaux.",
        "Mais la base veut des actes. La retraite à 60 ans, c’était dans les cent jours. On est au jour quarante-deux."],
    c: [
      { t: "La retraite à 60 ans passera avant l’élection.", cost: 4, r: "On a fait une capture d’écran. Avec beaucoup d’amour, et un peu de méfiance.",
        fx: { ouvriers: 5, colere: -4, overton: -1 } },
      { t: "Merci. Mais pas de surenchère, il faut rassurer.", cost: 3, r: "Rassurer qui ? Les marchés sont déjà rassurés. C’est nous qui ne le sommes pas.",
        fx: { patrons: 2, ouvriers: -3, overton: 1 } },
      { t: "Vous n’avez plus besoin de manifester : on est au pouvoir.", cost: 3, r: "Vous êtes au pouvoir. Nous, on est au travail. Nuance qu’on vous rappellera.",
        fx: { colere: 6, ouvriers: -6, overton: 1 } },
    ],
  });

  V("w6_call_atlantique", {
    m: ["Hey buddy ! Nationalisations, SMIC, taxes… Very communist. Very sad. Many people are saying it.",
        "Petite chose : vous achetez nos avions F-55 ? 12 milliards. Sinon, taxes sur votre fromage. 400 %."],
    c: [
      { t: "Non. Et on quitte le commandement intégré de l’Union Atlantique.", cost: 5, r: "Quitter ? Nobody quits me. Bye bye camembert. And bye bye you.",
        fx: { patrons: -6, jeunes: 4, retraites: -2, overton: -2 }, rel: { DP: -4, CA: -4 },
        news: "L’Hexagonie quitte le commandement intégré de l’Union Atlantique : le camembert taxé à 400 %" },
      { t: "Non merci. On achète hexagonien.", cost: 4, r: "Ok. Bye bye camembert. Vos avions à vous volent, au moins ?",
        fx: { patrons: -6, ouvriers: 2, retraites: 2 }, news: "Guerre du fromage : l’Union Atlantique taxe le camembert à 400 %" },
      { t: "Deal.", cost: 4, r: "Great ! You’re not so communist after all. Les avions ne volent pas encore, mais ils sont très beaux.",
        fx: { budget: -12, patrons: 6, police: 3, eco: 3, ouvriers: -4, overton: 2 },
        news: "Le gouvernement de gauche achète 12 milliards d’avions qui ne volent pas" },
    ],
  });

  V("w7_eco_high", {
    m: ["Bonne nouvelle : la taxe sur les dividendes rapporte plus que prévu. Un petit surplus, une semaine avant l’élection.", "On en fait quoi ?"],
    c: [
      { t: "Dégel des pensions et minima sociaux +10 %.", cost: 6, r: "Pas un chèque électoral : une hausse durable. La différence ? Les éditorialistes ne la font pas.",
        fx: { budget: -12, retraites: 8, ouvriers: 6, jeunes: 3, colere: -8 }, news: "Pensions et minima sociaux revalorisés de 10 %" },
      { t: "On investit dans l’hôpital public.", cost: 6, r: "Aminata va peut-être avoir une collègue. Une seule, mais une.",
        fx: { budget: -10, retraites: 5, ouvriers: 4, colere: -5 } },
      { t: "Baisse d’impôts pour les entreprises.", cost: 6, r: "Les entreprises vous remercient. Vos électeurs relisent le programme. Ils ne trouvent pas la page.",
        fx: { budget: -10, patrons: 12, ouvriers: -6, overton: 3 } },
      { t: "Rembourser la dette, pour rassurer les marchés.", cost: 4, r: "Le geste le moins sexy de l’histoire. Les marchés applaudissent poliment. Ta base, pas du tout.",
        fx: { patrons: 4, ouvriers: -3, overton: 1 } },
    ],
  });

  V("p_feux", {
    m: ["Des agriculteurs ont incendié deux bâtiments de la Mutualité agricole et un centre des impôts.", "Ils exigent la fin des « normes » et des prix qui paient. On fait quoi ?"],
    c: [
      { t: "Un prix plancher pour les agriculteurs. Par décret.", cost: 5,
        r: "Notre groupe l’avait fait voter article par article, puis le texte entier avait été rejeté à six voix près. Cette fois, c’est un décret. La grande distribution parle de « soviétisation du lait ».",
        fx: { budget: -3, retraites: 3, patrons: -4, colere: -6, ordre: 2, overton: -1 }, news: "Prix plancher garanti pour les agriculteurs : la grande distribution furieuse" },
      { t: "Envoyez l’armée.", cost: 5, r: "L’armée contre les paysans, sous un gouvernement de gauche. Les manuels d’histoire hésitent sur le chapitre.",
        fx: { ordre: 6, colere: 8, retraites: -6, blesses: 90, gav: 400, overton: 3 } },
      { t: "Supprimer les normes environnementales.", cost: 4, r: "Les tracteurs repartent. Les pesticides restent. Capucine Lombric pleure en direct.",
        fx: { eco: 5, patrons: 4, colere: -4, jeunes: -4, overton: 3 }, rel: { VP: -6 } },
    ],
    d: { r: "Pas d’ordre. On a laissé brûler. Les agriculteurs disent que c’était « du compost ».", fx: { budget: -6, ordre: -6 } },
  });

  V("a_colere", {
    m: ["Président, le pays est bloqué : barrages de tracteurs, grève de l’investissement, et ta propre base qui gronde.",
        "La droite parle de « destitution ». J’ai repéré les sorties de secours. Il y en a trois. Deux sont murées."],
  });

  V("a_patrons", {
    m: ["Président, alerte : le patronat appelle un par un les députés du Peut-Être et de la Droite Patrimoniale.",
        "Si son soutien tombe sous 5 %, ils votent la censure avec le RH. Ils ont déjà imprimé les bulletins."],
    c: [
      { t: "Recevoir les PME : crédit d’impôt pour les petits, pas pour les multinationales.", cost: 3,
        r: "Les boulangers et les plombiers sont venus. Les multinationales ont envoyé un huissier. Ça divise le front patronal.",
        fx: { patrons: 10, budget: -4 } },
      { t: "Pause sur les nouvelles taxes.", cost: 2, r: "Rassurer le patronat. Tu sais comment ça a fini en 1983 ? Par un tournant.",
        fx: { patrons: 12, ouvriers: -5, overton: 2 }, set: { pauseTaxes: true } },
      { t: "Qu’ils essaient. Le peuple est avec nous.", cost: 2, r: "Ils vont essayer. Le peuple, lui, regarde la télé. Leur télé." },
    ],
  });

  V("a_budget", {
    m: ["Les caisses sont presque vides. À zéro, le FMI débarque, avec son plan et ses lunettes.",
        "Il faut trouver de l’argent. Les nôtres disent : chez les riches. Bruxelles dit : chez les pauvres."],
    c: [
      { t: "Taxe exceptionnelle sur les superprofits.", cost: 4, r: "Les superprofits ont été super-taxés. Les actionnaires parlent de « confiscation ». Ils n’ont pas tort, c’était le but.",
        fx: { budget: 10, patrons: -5, ouvriers: 2, overton: -1 }, news: "Taxe exceptionnelle sur les superprofits : 12 milliards en une semaine" },
      { t: "Coupes dans les services publics.", cost: 3, r: "Les hôpitaux, les écoles, les trains. Comme les autres. Exactement comme les autres.",
        fx: { budget: 10, ouvriers: -6, retraites: -5, colere: 5, overton: 2 }, set: { rigueur: true } },
      { t: "Je m’en occupe.", cost: 2, r: "J’ai déjà vérifié le canapé : 3 € et une télécommande." },
    ],
  });

  // second avertissement, juste avant le mur : la sortie radicale existe, elle a un prix
  C.alerts.push(
    { id: "a_mur", from: S => (S.flags.rabotVire ? "bercy" : "rabot"), when: S => S.programme === P && S.g.patrons < 15, ov: false,
      m: ["Président, 40 milliards ont quitté le pays cette semaine. Les taux sont à 6 %. Les éditorialistes disent « Mitterrand 1983 » en boucle.",
          "Si le patronat lâche complètement, la droite et le centre votent la censure. Il nous reste une semaine, peut-être moins."],
      c: [
        { t: "Contrôle des capitaux et emprunt populaire.", cost: 6, r: "Les capitaux ne peuvent plus partir. Ils restent, furieux. Furieux, mais là. Et 2 millions de gens ont prêté à l’État leur livret A.",
          fx: { patrons: 6, budget: 4, colere: 4, overton: -3 }, rel: { DP: -8, CA: -8 }, set: { controleCapitaux: true },
          news: "Contrôle des capitaux et emprunt populaire : « L’argent des Hexagoniens restera en Hexagonie »" },
        { t: "Pause des réformes pour rassurer.", cost: 4, r: "Les taux redescendent. Ta base, elle, remonte. Dans la rue.",
          fx: { patrons: 15, ouvriers: -8, jeunes: -4, overton: 3 }, set: { pauseTaxes: true },
          news: "Le gouvernement de gauche annonce une « pause » des réformes pour rassurer les marchés" },
        { t: "Qu’ils partent.", cost: 2, r: "Ils partent. Ils emportent la caisse avec eux. On verra si le peuple suffit." },
      ],
      d: { r: "Pas de réponse. Les capitaux, eux, n’attendent pas." } },
  );

  // ================================================================ LA FIN « DÉBRANCHÉ », VUE DE GAUCHE
  C.endings.debranche.variants = { [P]: { title: "Le Mur de l’Argent",
    text: "Les capitaux ont pris le train pour Bruxelles, les taux ont pris l’ascenseur. La Droite Patrimoniale, le Centre Absolu et le RH ont voté la censure ensemble, « pour sauver l’économie ». Ton groupe a voté contre, debout, en chantant. Ça n’a pas suffi. Comme en 1924, comme en 1983 : le mur n’a pas bougé." } };

  // ================================================================ LE FIL, VU DE GAUCHE
  C.ambientBy = C.ambientBy || {};
  C.ambientBy[P] = {
    calm: [
      ["@Mamie_Ginette", "Ma pension a pris 40 € ce mois-ci. J’ai acheté du jambon. Du vrai, à la coupe."],
      ["@PatriceDu59", "Première fois qu’un ministre vient à l’usine. Il n’a pas fait semblant de savoir conduire un chariot."],
      ["@EntrepreneurDuDim", "Quelqu’un connaît un bon fiscaliste belge ? Pour un ami. L’ami, c’est moi. #Pigeons"],
      ["@Lea_Sciences_Po", "Thread 🧵 : non, l’Hexagonie ne devient pas le Venezuela (1/38)"],
      ["@InfoChoc24", "🔴 Faut-il avoir peur de la gauche ? Débat ce soir avec six éditorialistes de droite."],
      ["@MiloDu93", "la cantine gratuite pour mon petit frère j’avoue c’est pas mal"],
    ],
    tense: [
      ["@EntrepreneurDuDim", "On me parle de « partage ». Je ne partage pas. Même pas mon wifi. #Pigeons"],
      ["@Edito_Hexagone", "Le pays est au bord du gouffre. (Je l’écris depuis ma résidence secondaire.)"],
      ["@CRS_Anonyme", "On nous retire les LBD. On fait du maintien de l’ordre avec quoi ? Des câlins ?"],
      ["@JosyMartelUTF", "Ce gouvernement est le nôtre. Ça ne veut pas dire qu’on se tait. #LesJoursHeureux"],
      ["@InfoChoc24", "🔴 Les marchés « inquiets ». Les marchés sont toujours inquiets quand le SMIC augmente."],
      ["@Agri_Colere", "300 tracteurs vers la capitale. Le fumier, c’est notre bulletin de vote."],
      ["@MiloDu93", "la retraite à 60 ans c’était promis dans les cent jours. on est au jour combien ?"],
    ],
    angry: [
      ["@Edito_Hexagone", "Dictature bolivarienne ! (Toujours depuis ma résidence secondaire.)"],
      ["@EntrepreneurDuDim", "Grève de l’investissement : je n’investis plus. (Je n’investissais déjà pas.)"],
      ["@MiloDu93", "ils avaient promis. on attend toujours. #Trahison"],
      ["@PatriceDu59", "J’ai voté pour eux. Si c’est pour faire comme les autres, autant voter pour les autres."],
      ["@InfoChoc24", "🔴 ALERTE : les tracteurs bloquent 40 villes. Le patronat réclame « la fin de la tyrannie »."],
      ["@CRS_Anonyme", "Les collègues parlent de « droit de retrait ». On en parle tous les jours."],
      ["@SteeveFrontiere", "Le chaos d’extrême gauche, c’est maintenant. L’ordre, c’est bientôt. #Frontière2027"],
    ],
  };

  // ================================================================ TES PUBLICATIONS
  C.postsBy = C.postsBy || {};
  C.postsBy[P] = [
    null,
    [ { t: "La retraite à 60 ans sera votée dans les cent jours. #LesJoursHeureux", fx: { ouvriers: 4, retraites: 3, patrons: -4, colere: -2 }, rep: ["@JosyMartelUTF", "On a fait une capture d’écran. Avec beaucoup d’amour."] },
      { t: "Les marchés ont baissé de 4 %. Le SMIC, lui, va monter.", fx: { jeunes: 3, ouvriers: 3, patrons: -6 }, rep: ["@Edito_Hexagone", "Il a écrit « marchés » avec mépris. Je l’ai senti."] },
      { t: "Je serai le Président de tous, y compris des milliardaires. Surtout au moment des impôts.", fx: { patrons: -3, jeunes: 2 }, rep: ["@EntrepreneurDuDim", "Je me sens visé. Je suis visé."] } ],
    [ { t: "Les patrons manifestent ? Bienvenue dans la lutte. Il reste de la place sur les trottoirs.", fx: { jeunes: 3, patrons: -5, colere: 3 }, rep: ["@EntrepreneurDuDim", "Je ne marche pas sur un trottoir. J’ai un chauffeur."] },
      { t: "Le droit de manifester est le même pour tous. Même en tracteur.", fx: { retraites: 2, colere: -2 }, rep: ["@Agri_Colere", "On viendra quand même avec le fumier."] },
      { t: "Je tends la main aux entrepreneurs.", fx: { patrons: 4, ouvriers: -3 }, rep: ["@JosyMartelUTF", "Tends-la aussi aux caissières."] } ],
    [ { t: "Les pétroliers prennent le pays en otage pour garder leurs superprofits.", fx: { ouvriers: 3, patrons: -6 }, rep: ["@EntrepreneurDuDim", "Le mot « superprofit » me donne de l’urticaire."] },
      { t: "Nationaliser n’est pas un gros mot. C’est un mot de la Libération.", fx: { jeunes: 2, patrons: -5, overton: -2 }, rep: ["@Edito_Hexagone", "Il cite la Libération. Je cite le Venezuela. Match nul."] },
      { t: "Nous trouverons un accord avec les grands groupes pétroliers.", fx: { patrons: 4, ouvriers: -3 }, rep: ["@MiloDu93", "un « accord ». on connaît la chanson"] } ],
    [ { t: "Pensées pour les sinistrés. Et vive la planification écologique.", fx: { retraites: 2, eco: -1 }, rep: ["@Mamie_Ginette", "Planifiez aussi les secours, mon petit."] },
      { t: "Le dérèglement climatique a des responsables. Ils ont des noms et des yachts.", fx: { jeunes: 4, patrons: -5 }, rep: ["@EntrepreneurDuDim", "Mon yacht est hybride."] },
      { t: "Tous unis face à la catastrophe.", fx: { retraites: 3 }, rep: ["@Lea_Sciences_Po", "Unis, oui. Et après, on parle des responsables."] } ],
    [ { t: "Ce n’est pas la justice, c’est la persécution politique.", fx: { jeunes: 2, retraites: -4 }, rep: ["@Edito_Hexagone", "Le même mot que la droite quand c’est chez elle. Je note."] },
      { t: "La justice doit passer. Pour tout le monde, nous compris.", fx: { retraites: 3, jeunes: -1 }, rep: ["@Lea_Sciences_Po", "Rare. Sobre. Bien."] },
      { t: "Ils perquisitionnent les Insoumis… pardon, les Indomptés. Jamais les évadés fiscaux.", fx: { jeunes: 3, patrons: -3 }, rep: ["@MiloDu93", "le lapsus mdrrr"] } ],
    [ { t: "Le mur de l’argent ne passera pas.", fx: { ouvriers: 3, patrons: -6 }, rep: ["@EntrepreneurDuDim", "Le mur, c’est moi. Il passera."] },
      { t: "Unité populaire face aux marchés !", fx: { jeunes: 3, colere: -2 }, rep: ["@JosyMartelUTF", "Présents."] },
      { t: "Nous serons responsables avec la dette.", fx: { patrons: 4, ouvriers: -4 }, rep: ["@PatriceDu59", "Responsables. On a déjà entendu ça. Juste avant la rigueur."] } ],
    [ { t: "Le RH n’est pas un parti comme les autres. Aucune voix pour lui.", fx: { jeunes: 3, overton: -2 }, rep: ["@SteeveFrontiere", "Diabolisation ! (Ça marche de moins en moins.)"] },
      { t: "La gauche unie, c’est maintenant.", fx: { jeunes: 2 }, rep: ["@Lea_Sciences_Po", "Unie jusqu’à la prochaine virgule."] },
      { t: "La sécurité est aussi une valeur de gauche.", fx: { police: 4, jeunes: -3, overton: 2 }, rep: ["@MiloDu93", "on dirait un tweet du centre"] } ],
    [ { t: "Dimanche, on finit ce qu’on a commencé.", fx: { ouvriers: 3 }, rep: ["@JosyMartelUTF", "On sera là. Avec nos baskets."] },
      { t: "Vous êtes fatigués ? Nous aussi. Mais eux ne se fatiguent jamais.", fx: { jeunes: 2 }, rep: ["@Mamie_Ginette", "Moi je suis fatiguée mais j’irai voter."] },
      { t: "Un vote pour moi, c’est un 1er Mai de plus. Deux fois par an.", fx: { ouvriers: 4, budget: -2 }, rep: ["@EntrepreneurDuDim", "Deux 1er Mai. Le cauchemar."] } ],
  ];

  // ================================================================ MODE NE PAS DÉRANGER : TES MINISTRES DE GAUCHE
  const act = id => C.dndActs.find(a => a.id === id);
  act("d_rabot").variants = { [P]: { t: "a renationalisé un aéroport régional. Personne ne sait encore comment on fait marcher un aéroport.", fx: { budget: -4, patrons: -3, ouvriers: 2 } } };
  act("d_vallon").variants = { [P]: { t: "a obtenu un rendez-vous de deux heures à Bercy. Il en est ressorti furieux. C’est bon signe, ou très mauvais.", fx: { patrons: -2 } } };
})();
