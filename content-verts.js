// Ne Pas Déranger — la partie vue depuis un gouvernement écologiste (programme « Urgence climatique »).
// Même règle qu'à gauche : chaque message garde une réponse fidèle, un compromis et une trahison
// (pour pouvoir finir en productiviste, ou en « écologie de guerre » autoritaire).
// Clins d'œil au réel : les gilets jaunes et la taxe carbone (2018), « les Amish » (2020), le barbecue (2022),
// le sapin « arbre mort » (2020), Sainte-Soline (2023), l'A69, la soupe sur la Joconde (2024),
// la loi PFAS et l'exemption des poêles (2024-2025), la pétition record contre la réintroduction
// d'un néonicotinoïde (2025), la Convention citoyenne « sans filtre » (2019-2020), la « pause » écologique.
// Ici, la rue en colère, ce sont les ronds-points, les routiers, les tracteurs et les chasseurs. La base, elle, veut plus vite.

(() => {
  const C = window.CONTENT;
  const P = "climat";
  const all = () => [...C.events, ...C.pool, ...(C.alerts || [])];
  // variante d'un événement existant ; quand elle réécrit les réponses, elle porte son propre glissement d'Overton
  const V = (id, v) => { const e = all().find(x => x.id === id); e.variants = { ...(e.variants || {}), [P]: v.c ? { ov: false, ...v } : v }; };

  const prog = C.programmes.find(p => p.id === P);
  // la colère contre « l'écologie punitive » porte l'extrême droite
  prog.street = "RH";
  // le grand jeudi de la semaine 2, ce sont les gilets jaunes qui reviennent
  prog.names = { ...(prog.names || {}), "Jeudi Noir": "Jeudi Jaune", "JeudiNoir": "JeudiJaune" };

  // ---------------------------------------------------------------- LES SEMAINES
  C.weeksBy = C.weeksBy || {};
  C.weeksBy[P] = {
    1: { title: "L’An 01", agenda: ["Lun — Premier Conseil des ministres de la transition", "Jeu — On arrête tout, on réfléchit"] },
    2: { title: "Le Retour des Gilets", agenda: ["Jeu — Manifestation « Laissez-nous rouler »", "Ven — Les ronds-points rouvrent"] },
    3: { title: "La Grève du Gazole", agenda: ["Toute la semaine — Les dépôts de carburant bloqués", "Mer — Questions au gouvernement : « Khmers verts ? »"] },
    4: { title: "Le Déluge (on vous l’avait dit)", agenda: ["Lun — Vigilance rouge sur tout le Sud", "Jeu — Ne pas dire « on vous l’avait dit »"] },
    5: { title: "Le Jet de M. Sobriété", agenda: ["Mar — L’Écho publie", "Jeu — Réunion du groupe parlementaire"] },
    6: { title: "La Bassine", agenda: ["Lun — Les exploitants exigent de l’eau", "Sam — Rassemblement dans le Marais"] },
    7: { title: "Fin du Monde, Fin du Mois", agenda: ["Mar — L’agence de notation rend son verdict", "Jeu — Débat télévisé"] },
  };

  // ================================================================ SEMAINE 1
  V("w1_intro", {
    m: ["Félicitations Président. Premier écologiste élu, 50,3 % des voix. Les éditorialistes ont déjà trouvé le mot : « Amish ».",
        "Rappel : chaque réponse vide ta batterie 🔋. Elle se recharge au nucléaire, n’en parle à personne.",
        "Règle n° 1 : ne jamais prononcer le mot « barbecue ». Les réponses 🔓 peuvent fuiter."],
    c: [
      { t: "Compris.", cost: 2, r: "Parfait. J’ai prévu une cellule de riposte. Elle s’appelle « on n’interdit rien, on accompagne »." },
      { t: "Le barbecue est un vrai sujet politique.", cost: 2, r: "…Je vais faire semblant de ne pas avoir lu. Le pays entier a fait semblant, la dernière fois.",
        fx: { retraites: -2 }, set: { barbecue: true } },
    ],
  });

  V("w1_maman", {
    m: ["Mon chéri tu passes à la télé jeudi ? Mets la cravate en chanvre.",
        "Et ne dis pas qu’il faut arrêter la viande, ton père a fait un rôti. Il l’a fait exprès."],
  });

  V("w1_josy", {
    m: ["Bonjour Président. Josy Martel, Union des Travailleurs Fatigués.",
        "La transition, d’accord. Mais les 40 000 salariés de l’automobile, on en fait quoi ? On veut une transition juste, pas une transition chômage."],
    c: [
      { t: "Garantie d’emploi et formation payée pour chaque reconversion.", cost: 6, r: "Une garantie écrite ? On la fera encadrer. À côté de toutes les autres.",
        fx: { budget: -5, ouvriers: 6, colere: -4, overton: -1 }, set: { transitionJuste: true } },
      { t: "Les emplois verts arriveront tout seuls.", cost: 5, r: "Tout seuls. Comme les trains à Guéret.",
        fx: { ouvriers: -6, colere: 4 } },
      { t: "On garde les moteurs thermiques jusqu’en 2040.", cost: 5, r: "Ah. On ne s’attendait pas à ça d’un écologiste. Les jeunes non plus.",
        fx: { ouvriers: 4, jeunes: -6, eco: 4, overton: 2 }, set: { reculThermique: true } },
    ],
    d: { r: "Pas de réponse. Les ouvriers de Douvrin prennent note. Ils ont une bonne mémoire, et un rond-point à côté.", fx: { colere: 4 } },
  });

  V("w1_prefet", {
    m: ["Préfet Garrot. Jeudi prochain : manifestation « Laissez-nous rouler ». Gilets jaunes, routiers, chasseurs en orange, 300 tracteurs.",
        "Je propose le dispositif habituel : renforts, drones, LBD, interpellations préventives."],
    c: [
      { t: "Même droit de manifester pour tous. Dispositif léger.", cost: 6, r: "Léger face à des chasseurs. Je vous rappelle qu’ils sont armés, eux. Légalement.",
        fx: { ordre: -4, police: -4, ouvriers: 2, colere: -3, overton: -1 }, set: { leger: true } },
      { t: "Accordé. Pas de quartier.", cost: 6, r: "Avec plaisir. Un gouvernement vert qui gaze des gilets jaunes. Ça va faire de belles images.",
        fx: { ordre: 8, police: 6, ouvriers: -6, retraites: -3, colere: 8, gav: 300, overton: 5 }, set: { repression: true } },
      { t: "Faites ce qu’il faut.", cost: 4, r: "Je fais toujours ce qu’il faut. C’est ce qui m’inquiète chez moi.",
        fx: { ordre: 10, police: 8, colere: 10, gav: 600, overton: 6 }, set: { carteBlanche: true },
        leak: { p: 0.4, fx: { ouvriers: -6, colere: 6 }, news: "Le Président écologiste au préfet : « Faites ce qu’il faut. » Le préfet a fait." } },
    ],
    d: { r: "Pas de réponse. J’improvise. J’adore improviser.", fx: { ordre: 10, police: 8, colere: 10, gav: 600, overton: 6 }, set: { carteBlanche: true } },
  });

  V("w1_kevin", {
    m: ["yo le Président 🔥 c Kévin (3,2M d’abonnés)",
        "jte propose un live : une journée en vélo cargo dans la Creuse pour montrer qu’on peut vivre sans voiture. 50k€ le placement"],
    c: [
      { t: "Banco. Mais sans le placement.", cost: 6, r: "frère 40 km de côte, t’as craqué à la troisième. 6M de vues. la Creuse t’a pas pardonné",
        fx: { jeunes: 4, retraites: -3, ouvriers: -2 }, news: "Le Président abandonne en vélo cargo dans la Creuse : « Il manquait juste un train »" },
      { t: "Non. Je suis le Président.", cost: 2, r: "ok monsieur le président des bobos 🙄", fx: { jeunes: -2 } },
    ],
  });

  // ================================================================ SEMAINE 2 : le retour des gilets
  V("w2_josy_a", {
    m: S => S.flags.taxeCarbone
      ? ["Taxe carbone pour tout le monde. Les gilets jaunes ressortent du coffre. Nos adhérents les enfilent avec eux.",
         "Jeudi : « Fin du monde, fin du mois, même combat ». Mais ils risquent de ne garder que la fin du mois."]
      : ["Vous avez reporté la transition. Les jeunes pour le climat et nos syndicats marchent ensemble jeudi.",
         "Pour une fois que les écolos et les ouvriers sont d’accord : c’est contre vous."],
    c: [
      { t: "Taxe carbone 100 % redistribuée : un chèque climat pour les ménages modestes.", cost: 8, when: S => !!S.flags.taxeCarbone,
        r: "Un chèque. Les gens préfèrent toujours un chèque à une leçon. On aurait pu y penser en 2018.",
        fx: { budget: -8, colere: -10, ouvriers: 8, retraites: 4, eco: -2, overton: -1 }, set: { rigueur: false },
        news: "« Pas un euro de la taxe carbone ne restera à l’État » : chèque climat pour 20 millions de ménages" },
      { t: "On relance la transition, tout de suite.", cost: 8, when: S => !S.flags.taxeCarbone,
        r: "Merci. Les jeunes rentrent en cours. Les ouvriers attendent de voir.",
        fx: { budget: -8, jeunes: 8, eco: -4, colere: -8, overton: -1 }, set: { rigueur: false, recul: true } },
      { t: "Je retire la taxe carbone.", cost: 6, when: S => !!S.flags.taxeCarbone,
        r: "Comme en 2018. Les gilets rentrent. Le CO2 reste.",
        fx: { budget: -10, colere: -12, ouvriers: 6, eco: 5, jeunes: -6, overton: 2 }, set: { taxeCarbone: false, rigueur: false, reculCarbone: true },
        news: "Le gouvernement écologiste retire sa taxe carbone : « On a entendu les ronds-points »" },
      { t: "Je ne gouverne pas pour les ronds-points.", cost: 5, r: "Les ronds-points, eux, vont gouverner pour vous. Jeudi.",
        fx: { colere: 8, ouvriers: -6, overton: 2 } },
    ],
    d: { r: "Pas de réponse. On marche jeudi.", fx: { colere: 6 } },
  });

  V("w2_josy_b", {
    m: ["La taxe carbone sur les jets, bravo. Mais à Guéret, les gens n’ont pas de jet, ils ont une Clio de 2004.",
        "Jeudi, on marche avec eux pour des bus, des trains et des primes à la conversion. Vous venez ?"],
    c: [
      { t: "J’y serai. En train.", cost: 10, r: "Le train est arrivé avec 40 minutes de retard. Vous avez défilé quand même. Ça a plu.",
        fx: { jeunes: 4, ouvriers: 6, retraites: -2, police: -6, ordre: -3, colere: -5, overton: -2 }, set: { defile: true },
        news: "Le Président écologiste défile avec les syndicats « pour une écologie qui ne punit pas les pauvres »" },
      { t: "Restez chez vous. Pas de provocation.", cost: 3, r: "D’accord. Mais les gilets jaunes, eux, ne restent pas chez eux.", fx: { colere: -2 } },
    ],
  });

  V("w2_vallon_a", {
    m: ["Président. Édouard de Vallon-Dividende.",
        "Taxer mon jet ? C’est mon seul moyen de rejoindre mon yacht. Sinon je pars au Luxembourg. En jet."],
    c: [
      { t: "Bon voyage. Il y a un train de nuit.", cost: 5, r: "Un train de nuit. Avec des gens dedans. Vous êtes un monstre.",
        fx: { patrons: -6, jeunes: 3, budget: -3, overton: -1 }, news: "Vallon-Dividende s’exile au Luxembourg : « Je suis un réfugié climatique fiscal »" },
      { t: "Exemption pour les vols « professionnels ».", cost: 5, r: "Tous mes vols sont professionnels. Même Saint-Tropez : j’y bronze pour le travail.",
        fx: { patrons: 8, jeunes: -6, overton: 2 }, set: { exemptionJets: true } },
      { t: "On peut trouver un arrangement…", cost: 6, r: "Je savais que vous étiez raisonnable. Même chez les écolos, tout le monde a un prix.",
        fx: { patrons: 12, budget: -6, overton: 3 }, set: { taxeRiches: false, arrangement: true },
        leak: { p: 0.6, fx: { jeunes: -12, ouvriers: -8, colere: 10 }, news: "FUITE : le Président écologiste à Vallon-Dividende : « On peut trouver un arrangement… »" } },
    ],
  });

  V("w2_vallon_b", {
    m: ["Président, bravo pour la taxe carbone sur tout le monde. Sauf sur mon jet, j’ai vérifié.",
        "Je vous invite à la conférence climat sur mon yacht. Il est hybride : il a deux moteurs diesel."],
    c: [
      { t: "Non merci. Taxez son kérosène.", cost: 3, r: "Vous taxez mon kérosène ? Le kérosène n’a jamais été taxé. C’est une tradition.", fx: { patrons: -4, jeunes: 3 } },
      { t: "Avec plaisir.", cost: 4, r: "Formidable. Venez sans photographe. Le yacht a une mauvaise image.",
        fx: { patrons: 8, overton: 2 },
        leak: { p: 0.6, fx: { jeunes: -12, ouvriers: -8, colere: 10 }, news: "Le Président écologiste en croisière sur le yacht de Vallon-Dividende. Photo à l’appui." } },
    ],
  });

  V("w2_call_prefet", {
    m: S => [S.flags.carteBlanche ? "Vous m’aviez dit de faire ce qu’il faut. Je fais ce qu’il faut ?" : "Jeudi Jaune, 15 h, sur le périphérique. Ça chauffe.",
             "Gilets jaunes, routiers, chasseurs. Un rond-point brûle, littéralement. Une marche pour le climat arrive en face. Je charge ?"],
    c: [
      { t: "Chargez.", cost: 4, r: "Bien reçu. On charge les gilets et les K-way. C’est plus simple.",
        fx: { ordre: 6, police: 5, ouvriers: -8, jeunes: -4, colere: 10, blesses: 340, gav: 800, overton: 6 }, set: { charge: true },
        news: "Jeudi Jaune : charges massives, 340 blessés, le gouvernement écologiste « assume »" },
      { t: "Protégez les bâtiments. Séparez les cortèges. Pas de charge.", cost: 4, r: "Séparer des chasseurs et des militants climat. Je vous enverrai la facture des boucliers.",
        fx: { ordre: 2, colere: -4, police: -3, blesses: 30, gav: 100 }, news: "Jeudi Jaune : tendu, mais sans charge" },
      { t: "Retirez-vous. Le rond-point finira de brûler.", cost: 4, r: "Retirer. Je note l’heure. Je note toujours l’heure.",
        fx: { ordre: -12, police: -12, colere: -4, blesses: 10, overton: -1 }, set: { retrait: true },
        news: "Le périphérique bloqué toute la nuit : la police s’était retirée" },
    ],
    d: { r: "Appel manqué. Le préfet a chargé. Tout le monde.", fx: { ordre: 6, police: 5, colere: 12, blesses: 410, gav: 900, overton: 6 }, set: { charge: true } },
  });

  V("w2_video_a", {
    m: ["🚨 Une vidéo cartonne : un gendarme frappe un gilet jaune à terre. 4 millions de vues. #JeudiNoir",
        "La droite parle de « dictature verte ». On dit quoi ?"],
    c: [
      { t: "Suspension du gendarme. Et une IGPN indépendante.", cost: 6, r: "Les syndicats de police vous détestent. Les gilets jaunes, un peu moins.",
        fx: { police: -12, ouvriers: 5, colere: -6, overton: -2 }, set: { igpnIndependante: true },
        news: "Violences contre un gilet jaune : le gendarme suspendu" },
      { t: "Il faut attendre l’enquête.", cost: 5, r: "« Attendre l’enquête. » Les gilets jaunes ont déjà attendu en 2019. Ils attendent encore.",
        fx: { police: 4, ouvriers: -6, colere: 6, overton: 2 } },
      { t: "Il a dû glisser sur un sac de compost.", cost: 4, r: "Je vais faire comme si je n’avais pas lu ça. Je le ferai mal.",
        fx: { police: 6, overton: 4 },
        leak: { p: 0.75, fx: { ouvriers: -12, retraites: -8, colere: 12 }, news: "FUITE : « Il a dû glisser sur un sac de compost », écrit le Président écologiste" } },
    ],
  });

  V("w2_video_b", {
    m: ["🚨 Sans police, des manifestants ont brûlé un radar et trois bornes de recharge électriques. 4 millions de vues.",
        "La droite crie au chaos, les écolos à la provocation. On dit quoi ?"],
    c: [
      { t: "La loi est la même pour tous. Poursuites.", cost: 5, r: "Contre des gilets jaunes. Préparez-vous à un hiver de ronds-points.", fx: { ordre: 6, ouvriers: -3 } },
      { t: "C’est une colère sociale, pas une colère contre le climat.", cost: 5, r: "Une nuance. Les bornes brûlées ne l’ont pas comprise.", fx: { ouvriers: 3, retraites: -3 } },
      { t: "Ça fera du CO2 en moins : ils roulaient au gazole.", cost: 4, r: "Je supprime ce message. De mon téléphone et de ma mémoire.",
        leak: { p: 0.6, fx: { ouvriers: -10, retraites: -6, colere: 8 }, news: "FUITE : le Président écologiste se moque des gilets jaunes et de leur « gazole »" } },
    ],
  });

  // ================================================================ SEMAINE 3 : la grève du gazole
  V("w3_rabot", {
    m: ["Les routiers et les agriculteurs bloquent les dépôts de carburant contre la fin du gazole détaxé. 60 % des stations à sec.",
        "Ironie : le pays découvre la sobriété. De force."],
    c: [
      { t: "On ouvre les stocks et on met des cars et des trains en plus.", cost: 8, r: "Trains en plus, cars en plus. Les gens découvrent qu’il existe une ligne Limoges-Clermont. Elle met 4 heures.",
        fx: { budget: -7, colere: -3, ordre: 2, eco: -1 } },
      { t: "Réquisition des dépôts. Pas de chantage.", cost: 6, r: "Réquisitionner des routiers. Un gouvernement vert qui fait comme les autres. Ils sont surpris. Nous aussi.",
        fx: { ordre: 6, police: 3, ouvriers: -6, retraites: -2, colere: 5, overton: 4 }, set: { requisition: true } },
      { t: "Rétablir le gazole détaxé.", cost: 6, r: "Les dépôts rouvrent dans l’heure. Les militants climat pleurent dans le hall.",
        fx: { patrons: 5, ouvriers: 4, colere: -8, eco: 4, jeunes: -6, overton: 2 }, set: { reculCarbone: true },
        news: "Le gouvernement écologiste rétablit le gazole détaxé : les blocages se lèvent" },
    ],
    d: { r: "Pas de réponse. Les dépôts restent bloqués. Le marché noir du gazole explose.", fx: { colere: 6, ordre: -3 } },
  });

  V("w3_josy", {
    m: ["Deal proposé : on convainc les routiers syndiqués de lever les blocages.",
        "En échange : un fonds de reconversion pour l’automobile, financé, garanti. Pas un plan sur dix ans."],
    c: [
      { t: "Deal. Le fonds est voté ce soir.", cost: 8, r: "Ce soir. On n’y croyait plus. On y croit.",
        fx: { budget: -8, ouvriers: 10, patrons: -3, colere: -10, overton: -2 }, set: { dealSyndicat: true },
        news: "Fonds de reconversion de l’automobile : 40 000 salariés garantis, les blocages levés" },
      { t: "On en reparle après la crise.", cost: 5, r: "Après la crise. Il y a toujours une crise.", fx: { ouvriers: 2, colere: -2 } },
      { t: "Les emplois fossiles n’ont pas d’avenir. Qu’ils traversent la rue.", cost: 5, r: "Traverser la rue pour un emploi vert ? À Hayange, il n’y a pas de rue. Il y a une usine fermée.",
        fx: { ouvriers: -10, colere: 8, overton: 1 },
        leak: { p: 0.5, fx: { ouvriers: -8, retraites: -4 }, news: "FUITE : le Président écologiste aux ouvriers de l’automobile : « Qu’ils traversent la rue »" } },
    ],
    d: { r: "Pas de réponse. Les routiers syndiqués restent sur les barrages.", fx: { colere: 5 } },
  });

  V("w3_kevin", {
    m: ["frérot les chaînes d’info t’appellent « le Khmer vert » 💀",
        "jte fais une vidéo « le président réagit aux mèmes sur lui » ? y’en a un avec toi en Amish c’est trop drôle"],
    c: [
      { t: "Go.", cost: 6, r: "t’as rigolé au mème Amish. les Amish aussi apparemment", fx: { jeunes: 4, budget: -1 } },
      { t: "Paie-le pour dire que les SUV c’est pour les beaufs.", cost: 5, r: "frère 80k€ et je dis ce que tu veux. même ça",
        leak: { p: 0.7, fx: { ouvriers: -8, retraites: -8, jeunes: -4, colere: 6 }, news: "FUITE : l’Élysée a payé Kévin 80 000 € pour traiter les conducteurs de SUV de « beaufs »" } },
      { t: "Pas le temps.", cost: 2, r: "ok. jferai la vidéo sans toi. elle s’appelle « le président a peur des Amish »" },
    ],
  });

  // ================================================================ SEMAINE 4 : le déluge
  V("w4_call_aubrac", {
    m: ["Président, le fleuve est sorti de son lit. 12 villages sous l’eau. Il me faut des hommes, tout de suite.",
        "Problème : tous les gendarmes du pays sont sur les ronds-points."],
  });

  V("w4_clemence", {
    m: ["Il faut aller sur place. Des bottes, un air grave, une main sur une épaule.",
        "Et surtout, surtout : ne dis pas « on vous l’avait dit »."],
    c: [
      { t: "J’y vais en bottes.", cost: 12, r: "Parfait. Bottes en caoutchouc recyclé. Essaie de les salir.",
        fx: { retraites: 6, ouvriers: 3 }, news: "Le Président les pieds dans l’eau : « Je suis là »" },
      { t: "J’y vais en train de nuit. Cohérence.", cost: 8, r: "Tu es arrivé quand l’eau était redescendue. Cohérent, mais tard.",
        fx: { retraites: -2, jeunes: 3 } },
      { t: "« On vous l’avait dit. »", cost: 4, r: "Tu l’as dit. Devant les caméras. Devant une dame sur son toit.",
        fx: { retraites: -8, ouvriers: -4, jeunes: 3 }, news: "« On vous l’avait dit » : le Président écologiste face aux sinistrés" },
    ],
  });

  // ================================================================ SEMAINE 5 : le jet de M. Sobriété
  V("w5_chloe", {
    m: ["Chloé Ferrand, L’Écho. M. Sobriété, ton ministre de la Transition, a pris un jet privé pour aller à la conférence climat. Trois fois.",
        "On publie demain, avec les factures de kérosène. Un commentaire ?"],
    c: [
      { t: "M. Sobriété est viré immédiatement.", cost: 6, r: "Rapide. Il dit qu’il avait « compensé » en plantant un arbre. On cherche l’arbre.",
        fx: { colere: -4, jeunes: 4 }, set: { rabotVire: true }, image: { me: 1 },
        news: "Le jet de M. Sobriété : le ministre de la Transition limogé" },
      { t: "Les vols étaient compensés.", cost: 5, r: "Compensés. Le mot magique. Les lecteurs vont adorer le chercher dans le dictionnaire.",
        fx: { jeunes: -6, retraites: -3, colere: 4 }, image: { me: -2 } },
      { t: "Je n’étais pas au courant.", cost: 5, r: "Il y a une photo de toi sur la passerelle du jet. Tu fais coucou.",
        fx: { jeunes: -8, colere: 6 }, image: { me: -3 }, news: "Jet de M. Sobriété : le Président « pas au courant », une photo dit le contraire" },
      { t: "Combien pour ne pas publier ?", cost: 4, r: "Merci. Je viens d’ajouter un paragraphe.",
        leak: { p: 0.95, soon: true, fx: { jeunes: -10, ouvriers: -6, retraites: -6, colere: 15 }, news: "EXCLUSIF : le Président écologiste tente d’acheter le silence de L’Écho" } },
    ],
    d: { r: "Pas de réponse. J’écris : « L’Élysée n’a pas souhaité répondre. » Mes lecteurs adorent.", fx: { jeunes: -4, colere: 4 } },
  });

  // ================================================================ SEMAINE 6
  V("w6_josy_hot", {
    m: ["Les ronds-points, les routiers et les tracteurs bloquent le pays. Nos syndicats suivent.",
        "« Fin du monde, fin du mois. » Vous leur avez parlé de la fin du monde. Ils vous répondent avec la fin du mois."],
    c: [
      { t: "Transports gratuits dans les campagnes, financés par les jets et le kérosène.", cost: 10, r: "Des cars gratuits, des TER rouverts. Les ronds-points se vident un peu. Les aéroports d’affaires, beaucoup moins.",
        fx: { budget: -10, colere: -14, ouvriers: 8, retraites: 4, patrons: -6, overton: -2 } },
      { t: "Je suspends toutes les taxes écologiques.", cost: 10, r: "Tout ? …Les ronds-points se vident. Les militants climat les remplissent.",
        fx: { budget: -12, colere: -20, ouvriers: 10, eco: 6, jeunes: -8, overton: 4 }, set: { cede: true, reculCarbone: true },
        news: "Le gouvernement écologiste suspend toutes les taxes écologiques" },
      { t: "Réquisitionner les routiers.", cost: 8, r: "Un gouvernement vert qui réquisitionne. L’écologie de guerre, version camion.",
        fx: { ordre: 8, colere: 12, ouvriers: -12, gav: 2000, overton: 6 }, set: { requisition: true } },
      { t: "Je démissionne ?", cost: 2, r: "…C’est une question ou une réponse ?", end: "burnout" },
    ],
  });

  V("w6_josy_calm", {
    m: ["Les ronds-points se vident. Les gens ont vu les trains revenir, ça aide.",
        "Mais la base veut savoir : la reconversion de l’usine de Douvrin, c’est pour quand ?"],
    c: [
      { t: "Avant l’élection. Promis, signé.", cost: 4, r: "Signé. On a fait une capture d’écran. On fait toujours des captures.",
        fx: { ouvriers: 5, colere: -4, overton: -1 } },
      { t: "Ça dépend des investisseurs.", cost: 3, r: "Les investisseurs. Toujours eux. On croyait que vous, c’était la planète.",
        fx: { ouvriers: -3, patrons: 2, overton: 1 } },
      { t: "Vous avez perdu. Admettez-le.", cost: 3, r: "On a perdu une bataille. Vous allez voir pour la suite.",
        fx: { colere: 10, ouvriers: -6 } },
    ],
  });

  V("w6_call_atlantique", {
    m: ["Hey buddy ! Windmills ? Very bad. They kill the birds. Many birds. Very sad.",
        "Petite chose : vous achetez notre gaz de schiste liquéfié ? 12 milliards. Sinon, taxes sur votre fromage. 400 %."],
    c: [
      { t: "Non. On sort du gaz fossile.", cost: 5, r: "No gas ? Then no cheese for you ! Bye bye camembert.",
        fx: { patrons: -6, jeunes: 4, retraites: -2, eco: -2, overton: -1 },
        news: "L’Hexagonie refuse le gaz de schiste de l’Union Atlantique : le camembert taxé à 400 %" },
      { t: "Non merci.", cost: 4, r: "Ok. Bye bye camembert.",
        fx: { patrons: -6, ouvriers: -2, retraites: 2 }, news: "Guerre du fromage : l’Union Atlantique taxe le camembert à 400 %" },
      { t: "Deal.", cost: 4, r: "Great ! You’re a smart guy. Not like the other green people.",
        fx: { budget: -12, eco: 6, patrons: 6, jeunes: -6, overton: 2 },
        news: "Le gouvernement écologiste achète 12 milliards de gaz de schiste américain" },
    ],
  });

  V("w6_clemence", {
    m: ["Idée : une Convention citoyenne pour le climat, le retour.",
        "La dernière fois, 150 citoyens tirés au sort, 149 propositions, un président qui promet « sans filtre ». Il en avait gardé une poignée."],
    c: [
      { t: "Toutes les propositions, sans filtre. Pour de vrai.", cost: 6, r: "Pour de vrai. Les 150 citoyens ont pleuré. Les lobbyistes aussi, mais pas pareil.",
        fx: { colere: -6, jeunes: 5, patrons: -4, eco: -4, overton: -2 }, set: { convention: true },
        news: "Convention citoyenne : le Président promet de tout soumettre, « sans filtre, sans joker »" },
      { t: "Sans filtre, sauf trois jokers.", cost: 5, r: "Des jokers. Comme l’autre. Les 150 ont déjà créé un groupe WhatsApp « on s’est fait avoir 2 ».",
        fx: { colere: -2, jeunes: -3 } },
      { t: "Un Grand Débat : des cahiers, et on ne lit rien.", cost: 5, r: "Je commande 40 000 cahiers. En papier recyclé, quand même.",
        fx: { colere: -8, jeunes: -2 }, set: { grandDebat: true } },
    ],
  });

  // ================================================================ SEMAINE 7
  V("w7_securite", {
    m: ["Président, Mme Douce. Le Conseil de défense écologique me transmet un projet de loi « Urgence Absolue ».",
        "État d’urgence climatique, couvre-feu carbone, manifestations interdites « pour économiser l’énergie », et report des élections « tant que la planète est en danger ». Je suis contre. Évidemment."],
    c: [
      { t: "Votez-la. La planète d’abord.", cost: 8, r: "Avec le 49.3, le vote, c’est une formalité. Comme les élections, bientôt. Pour la bonne cause, évidemment.",
        fx: { ordre: 12, jeunes: -8, ouvriers: -8, colere: 14, police: 8, gav: 1500, eco: -4, overton: 12 }, set: { securiteAbsolue: true }, rel: { HI: -15, PP: -10, RH: 5 },
        news: "Loi « Urgence Absolue » adoptée au 49.3 : les élections pourront être reportées « pour le climat »" },
      { t: "Retirez le report des élections. Gardez le couvre-feu carbone.", cost: 6, r: "Une demi-dictature verte. C’est le juste milieu.",
        fx: { ordre: 6, colere: 6, ouvriers: -6, gav: 500, eco: -2, overton: 6 } },
      { t: "Jamais. L’écologie sans démocratie, c’est autre chose.", cost: 5, r: "Noté. Le Conseil de défense écologique est déçu. Moi, soulagée.",
        fx: { police: -4, ordre: -3, colere: -4, jeunes: 4, overton: -4 } },
    ],
    d: { r: "Pas de réponse. La loi passe au 49.3. Personne n’a vraiment décidé, c’est très reposant.",
         fx: { ordre: 12, jeunes: -8, ouvriers: -8, colere: 14, police: 8, gav: 1500, overton: 12 }, set: { securiteAbsolue: true } },
  });

  V("w7_eco_low", {
    m: ["L’agence de notation menace de dégrader l’Hexagonie : « transition trop coûteuse ». De AA à « bof ».",
        "Nos voisins, eux, ont annoncé une « pause » écologique. Les marchés ont adoré."],
    c: [
      { t: "Emprunt vert. La seule dette qui compte, c’est la dette climatique.", cost: 6, r: "Les marchés grimacent, les fonds de pension verts achètent. Il en existe.",
        fx: { budget: 5, patrons: -4, jeunes: 3, eco: -2 } },
      { t: "Taxe sur les superprofits pétroliers.", cost: 6, r: "Les pétroliers parlent de « spoliation ». Ils ont fait 20 milliards de bénéfices. Ils survivront.",
        fx: { budget: 7, patrons: -7, ouvriers: 2 }, news: "Taxe sur les superprofits pétroliers : 9 milliards pour la transition" },
      { t: "Pause écologique, comme nos voisins.", cost: 6, r: "La pause. Le climat, lui, n’en prend pas.",
        fx: { budget: 10, eco: 6, jeunes: -8, patrons: 6, overton: 3 }, set: { rigueur: true },
        news: "Le gouvernement écologiste annonce une « pause » écologique pour rassurer les marchés" },
    ],
  });

  V("w7_eco_high", {
    m: ["Bonne nouvelle : la taxe sur les jets rapporte plus que prévu. Petit surplus, une semaine avant l’élection.", "On en fait quoi ?"],
    c: [
      { t: "Leasing social : une voiture électrique à 100 €/mois pour les ménages modestes.", cost: 6, r: "Les gens de Guéret ont une voiture électrique. Il leur manque juste une borne. On y travaille.",
        fx: { budget: -12, ouvriers: 8, retraites: 4, eco: -3, colere: -6 } },
      { t: "Train à 1 € pour les jeunes tout l’été.", cost: 6, r: "Les gares sont pleines. Les trains un peu moins, il en manque.",
        fx: { budget: -8, jeunes: 8, eco: -2 } },
      { t: "Baisse de la TVA sur l’essence.", cost: 5, r: "Le gouvernement écologiste baisse le prix de l’essence. Les ronds-points applaudissent. Les glaciers, moins.",
        fx: { budget: -10, ouvriers: 6, retraites: 4, eco: 4, jeunes: -6, overton: 2 } },
    ],
  });

  V("w7_debat", {
    m: ["Débat télé jeudi, le dernier avant l’élection. Ils vont tous te parler d’« écologie punitive ».", "Ta stratégie ?"],
    c: [
      { t: "L’écologie populaire : les factures qui baissent, les trains qui reviennent.", cost: 6, r: "Des chiffres sur les factures. Les gens écoutent quand on parle de leur facture.",
        fx: { ouvriers: 4, retraites: 4, colere: -4 } },
      { t: "Appeler à l’union de la gauche et des écologistes.", cost: 6, r: "L’union. L’Hexagonie Indomptée dit oui. Puis elle discute de qui sera en tête.",
        fx: { jeunes: 4 }, rel: { HI: 8, PP: 8 } },
      { t: "Promettre de ne plus jamais toucher à la voiture.", cost: 6, r: "Tu vas parler comme eux. Ils vont gagner deux fois.",
        fx: { retraites: 6, ouvriers: 4, jeunes: -8, eco: 3, overton: 4 } },
    ],
  });

  // ================================================================ ÉVÉNEMENTS ALÉATOIRES
  V("p_culture", {
    m: ["Président, je passe sur un plateau ce soir.", "Je peux dire que le sapin de Noël de l’Élysée est « un arbre mort » ? C’est factuellement vrai."],
    c: [
      { t: "Surtout pas !", cost: 3, r: "Dommage. Je dirai « un arbre en fin de parcours ». C’est plus élégant." },
      { t: "Vas-y, ça va buzzer.", cost: 3, r: "Ça a buzzé. Les retraités ont sorti leurs guirlandes en signe de protestation.",
        fx: { retraites: -6, jeunes: 2 }, news: "La ministre de la Culture : le sapin de l’Élysée est « un arbre mort »" },
    ],
    d: { r: "Pas de réponse, donc j’y vais. Je l’ai dit. Les deux camps sont ravis d’être furieux.", fx: { retraites: -4 } },
  });

  V("p_jo", {
    m: ["On candidate pour les Jeux olympiques d’hiver dans les Alpes ?", "Il n’y a plus de neige, on la fabriquera. Coût : 4 milliards. Et beaucoup d’eau."],
    c: [
      { t: "Oui, la fierté (et les canons à neige).", cost: 4, r: "Merveilleux. On va faire skier le monde sur de la neige qui a soif.",
        fx: { budget: -8, retraites: 4, patrons: 4, eco: 5, jeunes: -4, overton: 1 } },
      { t: "Non. Des JO sans neige, la métaphore est trop lourde.", cost: 3, r: "Le comité est choqué. Les stations de ski, encore plus.", fx: { patrons: -3, jeunes: 2 } },
    ],
  });

  V("p_vente", {
    m: ["Les caisses fondent. Idée : on vend des droits à polluer supplémentaires aux industriels.", "Ça rapporte 12 milliards. Ça pollue aussi, mais ce n’est pas mon ministère."],
    c: [
      { t: "Jamais.", cost: 3, r: "Jamais. Les caisses, elles, continuent de fondre. Comme le reste.", fx: { budget: -2, jeunes: 2 } },
      { t: "Taxez plutôt les superprofits pétroliers.", cost: 6, r: "Les pétroliers. Vous voulez ma mort. Enfin, la leur.",
        fx: { budget: 8, patrons: -8, ouvriers: 3 } },
      { t: "Vendez.", cost: 4, r: "Vendu. Les industriels polluent légalement. C’est plus propre, administrativement.",
        fx: { budget: 12, eco: 6, patrons: 6, jeunes: -6, overton: 2 } },
    ],
  });

  V("p_feux", {
    m: ["Des agriculteurs ont déversé du fumier devant l’Office de la biodiversité et incendié un bâtiment.", "Ils exigent la fin des « contrôles » et des prix qui paient. On fait quoi ?"],
    c: [
      { t: "Prix plancher et aide à la conversion bio.", cost: 5, r: "Un prix plancher. Notre groupe l’avait fait voter en première lecture. Cette fois, c’est un décret.",
        fx: { budget: -4, retraites: 3, patrons: -3, colere: -6, eco: -1, overton: -1 }, news: "Prix plancher garanti pour les agriculteurs : la grande distribution furieuse" },
      { t: "Envoyez l’armée.", cost: 5, r: "L’armée contre les paysans, sous un gouvernement vert. Les manuels d’histoire hésitent sur le chapitre.",
        fx: { ordre: 6, colere: 8, retraites: -6, blesses: 90, gav: 400, overton: 4 } },
      { t: "Suspendre les contrôles environnementaux.", cost: 4, r: "Les tracteurs repartent. Les inspecteurs de la biodiversité restent au bureau. Les rivières, elles, ne disent rien.",
        fx: { eco: 5, patrons: 4, colere: -5, jeunes: -6, overton: 3 } },
    ],
    d: { r: "Pas d’ordre. Le bâtiment a brûlé. Les agriculteurs disent que c’était « du compost ».", fx: { budget: -6, ordre: -6 } },
  });

  // ================================================================ ALERTES
  V("a_colere", {
    m: ["Président, le pays est bloqué : ronds-points occupés, tracteurs dans 40 villes, routiers sur les dépôts.",
        "La droite parle de « dictature verte ». J’ai repéré les sorties de secours. Il y en a trois. Deux sont murées."],
  });

  V("a_patrons", {
    m: ["Président, alerte : les constructeurs automobiles menacent de fermer trois usines, et le patronat appelle les députés du centre un par un.",
        "Si son soutien tombe sous 5 %, la droite et le centre votent la censure. Ils ont déjà imprimé les bulletins."],
    c: [
      { t: "Plan de soutien à la voiture électrique hexagonale.", cost: 3, r: "Les constructeurs se calment. Ils ont fait la liste de leurs exigences. Elle fait 40 pages.",
        fx: { patrons: 10, budget: -4 } },
      { t: "Reporter la fin des moteurs thermiques.", cost: 2, r: "Reporter. Le mot préféré de l’industrie. Le climat, lui, ne reporte rien.",
        fx: { patrons: 12, jeunes: -5, eco: 4, overton: 2 }, set: { reculThermique: true } },
      { t: "Qu’ils essaient.", cost: 2, r: "Ils vont essayer." },
    ],
  });

  V("a_budget", {
    m: ["Les caisses sont presque vides. À zéro, le FMI débarque, et il n’a pas de plan climat.",
        "Il faut trouver de l’argent. Les nôtres disent : les pollueurs. Bruxelles dit : les trains."],
    c: [
      { t: "Taxe exceptionnelle sur les pollueurs.", cost: 4, r: "Les pollueurs paient. Ils ont crié, puis ils ont payé. Dans cet ordre.",
        fx: { budget: 10, patrons: -5, jeunes: 2, overton: -1 } },
      { t: "Couper dans le fret ferroviaire.", cost: 3, r: "Les camions reviennent sur l’autoroute. Ils te saluent en klaxonnant.",
        fx: { budget: 10, eco: 4, jeunes: -5, overton: 2 }, set: { rigueur: true } },
      { t: "Je m’en occupe.", cost: 2, r: "J’ai vérifié le canapé : 3 € et une télécommande. En plastique." },
    ],
  });

  // ================================================================ CITOYENS
  V("c_lucas_blesse", {
    m: ["C’est Lucas. Celui de l’œil. J’étais dans la marche pour le climat, Jeudi Jaune. Les gendarmes ont chargé tout le monde, les gilets et les K-way.",
        "Sous un gouvernement écologiste. Je suis porte-parole du collectif des blessés. On sera devant l’Élysée jeudi. Vous viendrez ?"],
  });
  V("c_lucas_ok", {
    m: ["Bonjour, c’est Lucas, 19 ans. J’étais à la marche pour le climat, Jeudi Jaune. Je n’ai rien eu, j’ai eu de la chance.",
        "J’ai décidé de me présenter aux municipales. Liste écolo. Un conseil ?"],
  });
  C.citizenPosts.find(p => p.id === "cp_lucas1").variants =
    { [P]: { t: "Première marche pour le climat jeudi. Elle va croiser les gilets jaunes. Ma mère a peur. Je lui ai dit qu’on était au pouvoir, maintenant. Elle a ri." } };
  C.citizenPosts.find(p => p.id === "cp_lucas_blesse").variants =
    { [P]: { t: "Marche pour le climat. Les gendarmes ont chargé tout le monde. Je ne reverrai plus de l’œil gauche. Sous un gouvernement écologiste. #JeudiNoir" } };

  // ================================================================ NOUVEAUX ÉVÉNEMENTS PROPRES AUX ÉCOLOGISTES
  C.events.push(
    // la loi anti-PFAS, et la poêle qui avait obtenu son exemption
    { id: "v_pfas", w: 2, at: 0.9, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["Notre groupe avait fait voter l’interdiction des PFAS, les polluants éternels, dans les cosmétiques, les farts de ski et les vêtements.",
          "On l’étend ? Le lobby de la poêle antiadhésive demande déjà son exemption. Il l’avait obtenue la dernière fois."],
      c: [
        { t: "Interdiction totale. Poêles comprises.", cost: 5, r: "Les poêles. Le lobby a manifesté devant l’Assemblée, avec des poêles. Ça faisait beaucoup de bruit.",
          fx: { patrons: -6, jeunes: 4, eco: -2, overton: -1 }, news: "PFAS : les polluants éternels interdits partout, poêles comprises" },
        { t: "Exemption pour les poêles. On ne touche pas aux crêpes.", cost: 4, r: "Le lobby de la poêle a gagné. Il a de l’expérience.",
          fx: { patrons: 3 } },
      ],
      d: { r: "Pas de réponse. Les polluants éternels, eux, ont tout leur temps." } },

    // la pétition record contre la réintroduction d'un pesticide
    { id: "v_neonics", w: 3, at: 0.75, from: "agri", when: S => S.programme === P, ov: false,
      m: ["Président, Fédération des Exploitants. On exige la réintroduction d’un néonicotinoïde interdit. Sinon, tracteurs.",
          "PS : une étudiante a lancé une pétition contre. 2 millions de signatures en trois semaines. On s’en fiche, elle n’a pas de tracteur."],
      c: [
        { t: "Non. On écoute les 2 millions.", cost: 5, r: "Les abeilles vous remercient. Les tracteurs, eux, vous attendent sur l’autoroute.",
          fx: { patrons: -3, retraites: -3, jeunes: 6, eco: -3, overton: -1 }, news: "Néonicotinoïdes : le gouvernement suit la pétition record" },
        { t: "Dérogation de trois ans, pour les betteraves.", cost: 4, r: "Trois ans. La dernière dérogation de trois ans en avait duré six.",
          fx: { eco: 2, jeunes: -4, retraites: 2 } },
        { t: "Oui. Les abeilles ne votent pas.", cost: 3, r: "Les abeilles ne votent pas. Les 2 millions de signataires, si.",
          fx: { eco: 5, patrons: 4, retraites: 3, jeunes: -8, overton: 2 },
          leak: { p: 0.5, fx: { jeunes: -8 }, news: "FUITE : « Les abeilles ne votent pas », écrit le Président écologiste" } },
      ],
      d: { r: "Pas de réponse. Les tracteurs prennent l’autoroute.", fx: { colere: 4 } } },

    // la soupe sur la Joconde
    { id: "v_soupe", w: 3, at: 0.9, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["Deux militantes de « Dernière Récolte » ont jeté de la soupe sur la Joconde. Elle est sous vitre. La soupe aussi, maintenant.",
          "Elles exigent un plan d’urgence alimentaire et climatique. La droite exige leur tête. On dit quoi ?"],
      c: [
        { t: "Je les reçois. Leur colère est légitime. La soupe, moins.", cost: 5, r: "Elles sont venues. Elles n’ont rien jeté. Elles ont tout noté.",
          fx: { jeunes: 5, retraites: -4, overton: -1 } },
        { t: "Poursuites pour « écoterrorisme ».", cost: 4, r: "« Écoterrorisme. » Le mot de la droite. Il te va bien, finalement.",
          fx: { retraites: 4, jeunes: -6, police: 3, overton: 4 }, news: "Soupe sur la Joconde : le gouvernement écologiste parle d’« écoterrorisme »" },
        { t: "Une soupe, c’est plus utile dans une assiette.", cost: 3, r: "Tout le monde est d’accord avec toi. C’est rare, profite.", fx: { retraites: 2 } },
      ] },

    // le nucléaire, éternel sujet qui fâche
    { id: "v_nucleaire", w: 4, at: 0.85, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, le programme dit « sortie du nucléaire ». La canicule dit « clim ». Le réseau dit « pas assez de vent cette semaine ».",
          "On ferme la vieille centrale du Val-de-Brume ?"],
      c: [
        { t: "On ferme, comme promis. On accélère le solaire.", cost: 6, r: "Fermée. On rallume deux centrales à gaz en attendant. Tes militants préfèrent ne pas le savoir.",
          fx: { eco: 3, jeunes: 3, ouvriers: -4, budget: -4, overton: -1 } },
        { t: "On la garde le temps de la transition.", cost: 4, r: "Le pragmatisme. Tes militants appellent ça autrement.",
          fx: { ouvriers: 2, jeunes: -3, overton: 1 } },
        { t: "On relance six nouveaux réacteurs.", cost: 5, r: "Six réacteurs. Le premier sera prêt quand ta petite-fille sera à la retraite.",
          fx: { budget: -10, patrons: 6, ouvriers: 3, jeunes: -6, overton: 2 }, rel: { DP: 4, CA: 4 } },
      ] },

    // l'autoroute construite à 70 %
    { id: "v_a69", w: 5, at: 0.75, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, l’autoroute entre deux villes de 50 000 habitants, la fameuse « A69 », est construite à 70 %.",
          "Des militants vivent dans les arbres depuis des mois. On les appelle « les écureuils ». Le tribunal hésite. Et nous ?"],
      c: [
        { t: "On arrête le chantier. On rend les terres.", cost: 6, r: "Les écureuils descendent des arbres en chantant. Le concessionnaire réclame 300 millions de pénalités.",
          fx: { budget: -6, patrons: -6, jeunes: 6, eco: -2, overton: -1 }, news: "Autoroute arrêtée à 70 % : « Le béton, c’est fini »" },
        { t: "On finit. C’est trop tard pour reculer.", cost: 4, r: "« Trop tard pour reculer. » La devise du siècle, en fait.",
          fx: { eco: 2, patrons: 3, jeunes: -5, overton: 1 } },
        { t: "On déloge les écureuils au petit matin.", cost: 4, r: "Délogés. Avec des nacelles et des gendarmes. Les écureuils, les vrais, sont partis aussi.",
          fx: { ordre: 3, jeunes: -8, police: 3, eco: 2, gav: 40, overton: 2 }, set: { repression: true } },
      ] },

    // la méga-bassine
    { id: "v_bassine", w: 6, at: 0.35, from: "agri", when: S => S.programme === P && !S.flags.megabassines, ov: false,
      m: ["Président, Fédération des Exploitants. On veut seize méga-bassines dans le Marais. L’eau des nappes, pour quelques fermes.",
          "Sinon, les tracteurs montent. Les « Soulèvements » prévoient un rassemblement samedi. Ça peut finir comme à Sainte-Soline."],
      c: [
        { t: "Non. Partage de l’eau et aides aux cultures sobres.", cost: 6, r: "Les exploitants sont furieux. Les nappes, elles, remontent un peu.",
          fx: { patrons: -4, retraites: -3, colere: 4, eco: -3, overton: -1 }, news: "Pas de méga-bassines : « L’eau est un bien commun »" },
        { t: "Oui, avec un moratoire et des contrôles.", cost: 5, r: "Un moratoire sur des bassines qu’on construit quand même. Les militants ont compris.",
          fx: { eco: 3, colere: -3, jeunes: -4 }, set: { megabassines: true } },
        { t: "Oui. Et les gendarmes protègent le chantier.", cost: 5, r: "Samedi, 5 000 grenades en deux heures. Comme à Sainte-Soline. Sous un gouvernement vert.",
          fx: { ordre: 4, jeunes: -10, police: 4, eco: 4, blesses: 200, gav: 100, overton: 5 }, set: { megabassines: true, charge: true },
          news: "Méga-bassines : 200 blessés à Sainte-Sabotine, le gouvernement écologiste protège le chantier" },
      ],
      d: { r: "Pas de réponse. Les pelleteuses ont commencé à creuser.", set: { megabassines: true }, fx: { eco: 3, jeunes: -4 } } },
  );

  // ================================================================ LA FIN « DÉBRANCHÉ », VUE DES VERTS
  C.endings.debranche.variants = { [P]: { title: "Écologie punitive",
    text: "L’automobile, le pétrole et l’agro-industrie ont appelé les députés du centre et de la droite. La censure passe à l’heure du déjeuner. Motif officiel : « l’écologie punitive ». Les glaciers, eux, n’ont pas été consultés." } };

  // ================================================================ LE FIL, VU DES VERTS
  C.ambientBy = C.ambientBy || {};
  C.ambientBy[P] = {
    calm: [
      ["@Mamie_Ginette", "Ils ont isolé mon appartement. Giscard ne dort plus sur le radiateur. Il ne sait plus où dormir, du coup."],
      ["@PatriceDu59", "Le TER de 6 h 12 est revenu. Il est à l’heure. J’ai pris une photo pour mes collègues, personne ne me croit."],
      ["@EntrepreneurDuDim", "Mon jet est cloué au sol. J’ai pris le train. Il y avait des gens dedans. #Traumatisme"],
      ["@Lea_Sciences_Po", "Thread 🧵 : non, l’écologie n’est pas « punitive », voici les factures (1/41)"],
      ["@InfoChoc24", "🔴 Faut-il avoir peur des Khmers verts ? Débat ce soir avec six éditorialistes en SUV."],
      ["@MiloDu93", "le pass train à 1 € j’avoue c’est chaud, j’ai vu la mer"],
    ],
    tense: [
      ["@GiletJaune_Creuse", "Fin du monde, fin du mois. Pour nous c’est la fin du mois qui arrive en premier."],
      ["@Edito_Hexagone", "La dictature verte est à nos portes. (Je l’écris depuis mon 4x4.)"],
      ["@Chasseur_Libre", "Ils veulent interdire la chasse le dimanche. Le dimanche, c’est le seul jour où on peut tirer sur quelque chose."],
      ["@Agri_Colere", "300 tracteurs vers la capitale. Le fumier, c’est bio, au moins."],
      ["@InfoChoc24", "🔴 Le prix du gazole « inquiète ». Le prix du climat, moins."],
      ["@MiloDu93", "ils avaient promis la fin des jets privés. j’en ai vu passer un hier. il me narguait"],
      ["@Derniere_Recolte", "On a collé nos mains sur le périphérique. Les gilets jaunes ont collé les leurs à côté. Personne ne sait qui bloque qui."],
    ],
    angry: [
      ["@Edito_Hexagone", "Dictature verte ! Ayatollahs du climat ! (Toujours depuis mon 4x4.)"],
      ["@GiletJaune_Creuse", "On a ressorti les gilets. Ils sentent encore 2018."],
      ["@MiloDu93", "même les écolos font comme les autres. #Trahison"],
      ["@PatriceDu59", "Ils ont fermé l’usine pour la planète. La planète ne paie pas mon loyer."],
      ["@InfoChoc24", "🔴 ALERTE : les tracteurs bloquent 40 villes. La FNEX réclame « la fin de l’écologie punitive »."],
      ["@CRS_Anonyme", "On doit protéger des méga-bassines contre des écolos sous un gouvernement écolo. On ne comprend plus rien."],
      ["@SteeveFrontiere", "La France des ronds-points contre la France des trottinettes. Choisissez votre camp. #Frontière2027"],
    ],
  };

  // ================================================================ TES PUBLICATIONS
  C.postsBy = C.postsBy || {};
  C.postsBy[P] = [
    null,
    [ { t: "Les jets privés, c’est fini. Le train de nuit, c’est maintenant. #LAn01", fx: { jeunes: 4, patrons: -4 }, rep: ["@EntrepreneurDuDim", "Je n’ai jamais dormi dans un train. Je ne commencerai pas pour vous."] },
      { t: "Une écologie qui ne punit pas les pauvres, mais les pollueurs.", fx: { ouvriers: 3, retraites: 2, patrons: -3 }, rep: ["@GiletJaune_Creuse", "On jugera sur la facture."] },
      { t: "Bonne nouvelle : on peut sauver la planète ET garder le barbecue.", fx: { retraites: 3, jeunes: -2 }, rep: ["@Lea_Sciences_Po", "Personne ne vous avait rien demandé sur le barbecue."] } ],
    [ { t: "Les ronds-points sont les bienvenus dans le débat. Les bus aussi.", fx: { ouvriers: 3, colere: -2 }, rep: ["@GiletJaune_Creuse", "Il n’y a pas de bus chez nous. C’est le sujet."] },
      { t: "Fin du monde, fin du mois : même combat.", fx: { jeunes: 2, ouvriers: 2 }, rep: ["@MiloDu93", "on dirait un slogan qu’on a déjà entendu. ah oui c’était nous"] },
      { t: "Nous ne céderons pas au lobby du gazole.", fx: { jeunes: 4, ouvriers: -4, patrons: -2 }, rep: ["@Agri_Colere", "Le lobby du gazole, c’est mon tracteur."] } ],
    [ { t: "Les stations sont vides ? Le vélo, lui, roule toujours. 🚲", fx: { jeunes: 2, ouvriers: -5, retraites: -3 }, rep: ["@PatriceDu59", "40 km avec mon dos. Vous venez avec moi ?"] },
      { t: "Des trains et des cars en plus, dès demain.", fx: { ouvriers: 3, retraites: 2, budget: -2 }, rep: ["@Mamie_Ginette", "Le car est passé. Le chauffeur était charmant."] },
      { t: "Les pétroliers bloquent pour garder leurs subventions.", fx: { jeunes: 3, patrons: -5 }, rep: ["@EntrepreneurDuDim", "Ce ne sont pas des subventions, ce sont des encouragements fiscaux."] } ],
    [ { t: "Pensées aux sinistrés. Le climat ne négocie pas, nous si : 4 milliards pour eux.", fx: { retraites: 4, budget: -2 }, rep: ["@Mamie_Ginette", "Merci mon petit."] },
      { t: "On vous l’avait dit.", fx: { jeunes: 3, retraites: -6, ouvriers: -3 }, rep: ["@Edito_Hexagone", "Il l’a dit. Il l’a vraiment dit."] },
      { t: "Tous unis face à la catastrophe.", fx: { retraites: 3 }, rep: ["@Lea_Sciences_Po", "Unis, oui. Et après, on parle des causes."] } ],
    [ { t: "Un ministre de la Transition ne prend pas le jet. Point.", fx: { jeunes: 3, retraites: 2 }, rep: ["@MiloDu93", "sauf quand il le prend"] },
      { t: "La compensation carbone, c’est sérieux.", fx: { jeunes: -4, patrons: 2 }, rep: ["@Lea_Sciences_Po", "Thread 🧵 sur pourquoi ce n’est pas sérieux (1/27)"] },
      { t: "On nous attaque parce qu’on dérange les lobbies.", fx: { jeunes: 2, retraites: -2 }, rep: ["@Edito_Hexagone", "Le lobby, ici, c’était le jet."] } ],
    [ { t: "L’eau est un bien commun. Pas une bassine privée.", fx: { jeunes: 4, retraites: -2, patrons: -3 }, rep: ["@Agri_Colere", "Venez arroser mon maïs avec un bien commun."] },
      { t: "Nous protégerons l’agriculture ET les nappes.", fx: { retraites: 2 }, rep: ["@Derniere_Recolte", "Et en même temps. On connaît la chanson."] },
      { t: "Force restera à la loi, même dans le Marais.", fx: { police: 4, jeunes: -6, overton: 2 }, rep: ["@MiloDu93", "on dirait un tweet de l’ancien ministre de l’Intérieur"] } ],
    [ { t: "Le RH n’a aucune solution au climat. Seulement des coupables.", fx: { jeunes: 3, overton: -2 }, rep: ["@SteeveFrontiere", "Notre solution, c’est la frontière. Le CO2 s’arrêtera à la douane."] },
      { t: "L’écologie populaire, c’est moins cher à la fin du mois.", fx: { ouvriers: 3, retraites: 2 }, rep: ["@GiletJaune_Creuse", "Montrez-nous la fin du mois, on vous dira."] },
      { t: "La voiture n’est pas l’ennemie.", fx: { retraites: 3, ouvriers: 2, jeunes: -4, overton: 2 }, rep: ["@Derniere_Recolte", "On vient de décoller nos mains pour lire ça. On les recolle."] } ],
    [ { t: "Dimanche, votez pour vos enfants. Et pour les leurs.", fx: { jeunes: 3, retraites: 2 }, rep: ["@Mamie_Ginette", "J’ai voté pour mes arrière-petits-enfants. Ils n’ont pas encore d’avis."] },
      { t: "Il n’y a pas de planète B. Il y a un bureau de vote.", fx: { jeunes: 3 }, rep: ["@Kevontop", "le slogan est bon. le président un peu moins"] },
      { t: "Si je perds, ce sont les canicules qui gouverneront.", fx: { jeunes: 2, retraites: -2 }, rep: ["@Edito_Hexagone", "Chantage climatique ! (Il fait 39 °C dans mon studio.)"] } ],
  ];

  // ================================================================ MODE NE PAS DÉRANGER : TES MINISTRES ÉCOLOGISTES
  const act = id => C.dndActs.find(a => a.id === id);
  act("d_rabot").variants = { ...(act("d_rabot").variants || {}), [P]: { t: "a fait poser des panneaux solaires sur Bercy. Ils sont orientés plein nord.", fx: { budget: -3, eco: -1 } } };
  act("d_vallon").variants = { ...(act("d_vallon").variants || {}), [P]: { t: "a obtenu une « dérogation temporaire » pour son jet. Personne ne sait qui l’a signée. Ta signature ressemble beaucoup.", fx: { patrons: 3, jeunes: -2 } } };
})();
