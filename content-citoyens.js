// Ne Pas Déranger — citoyens récurrents, épilogues, et ce que font tes ministres quand tu ne réponds plus.

(() => {
  const C = window.CONTENT;
  const passed = (S, id) => !!S.laws[id] && ["adopted", "493"].includes(S.laws[id].status);

  Object.assign(C.contacts, {
    courrier: { name: "Courrier présidentiel", role: "Lettres de citoyens", av: "📮", col: "#7a5c3a" },
    lucas:    { name: "Lucas Morel", role: "19 ans, étudiant en histoire", av: "🧑‍🎓", col: "#3d6b8f" },
  });

  // Lucas n'est blessé que si la police a chargé le jour de Jeudi Noir
  const ev3 = C.events.find(e => e.id === "w3_lucas");
  ev3.when = S => !!S.flags.lucasBlesse;

  // ---------------------------------------------------------------- LETTRES ET MESSAGES DES CITOYENS
  C.events.push(
    // ===== Ginette, 84 ans
    { id: "c_ginette1", w: 1, at: 0.66, from: "courrier",
      m: S => ["✉️ Lettre de Ginette, 84 ans, Roubaix :",
        S.flags.gelPensions || S.flags.rigueur
          ? "« Monsieur le Président, j’ai 84 ans et 980 € par mois. Vous venez de geler les pensions. Est-ce que je dois choisir entre le chauffage et mes médicaments ? Je vous joins une photo de mon chat, Giscard. Il a froid aussi. »"
          : "« Monsieur le Président, j’ai 84 ans et 980 € par mois. À la télé, ils disent que ça va être dur pour tout le monde. Pour vous aussi ? Je vous joins une photo de mon chat, Giscard. »"],
      c: [
        { t: "Envoyer la réponse type n°4.", cost: 1, r: "Réponse n°4 envoyée : « Le Président a bien reçu votre courrier et partage votre préoccupation. »", set: { ginette: "type" } },
        { t: "Lui écrire une lettre à la main.", cost: 6, r: "Lettre envoyée. Clémence t’a pris en photo pendant que tu l’écrivais. Pour Le Fil.", fx: { retraites: 2 }, set: { ginette: "lettre" } },
        { t: "Lui envoyer un chèque énergie de 48 €.", cost: 3, r: "Chèque envoyé. Il couvre 4 jours de chauffage. En avril.", set: { ginette: "cheque" } },
      ],
      d: { r: "Lettre classée. Elle rejoint les 14 000 autres du mois.", set: { ginette: "ignoree" } } },

    { id: "c_ginette2", w: 5, at: 0.72, from: "courrier", when: S => S.flags.gelPensions || S.flags.rigueur || S.eco >= 60,
      m: S => ["✉️ Nouvelle lettre de Ginette, 84 ans :",
        S.eco >= 60
          ? "« Il fait 36 °C dans mon appartement, en novembre. Giscard ne sort plus de la baignoire. Moi non plus. »"
          : "« Il fait 12 °C dans mon salon. Giscard dort sur le radiateur éteint, par habitude. Moi, je dors avec mon manteau. »",
        S.flags.ginette === "type" ? "« J’ai reçu votre réponse n°4. Je l’ai encadrée. Elle tient chaud au mur. »" : "« Je vous écris quand même. Ça m’occupe. »"],
      c: [
        { t: "Réponse type n°7.", cost: 1, r: "Réponse n°7 : « Le Président est pleinement mobilisé sur le pouvoir d’achat des aînés. »", set: { ginette2: "type" } },
        { t: "Lui envoyer un technicien du Plan Rénovation.", cost: 4, when: S => passed(S, "l_renov"),
          r: "Le technicien est passé. Ginette lui a offert un café et un pull.", fx: { retraites: 2 }, set: { ginette2: "renov" } },
        { t: "Lui proposer un EHPAD (privé, 4 200 €/mois).", cost: 3, r: "Ginette a répondu au crayon : « Non merci, j’ai vu le reportage. »", set: { ginette2: "ehpad" } },
        { t: "L’appeler. Vraiment.", cost: 10, r: "Vous avez parlé 40 minutes, surtout de Giscard. Elle a dit que tu avais « une voix plus gentille qu’à la télé ».",
          fx: { retraites: 3 }, set: { ginette2: "appel" } },
      ],
      d: { r: "Lettre classée.", set: { ginette2: "ignoree" } } },

    // ===== Aminata, 52 ans, infirmière de nuit
    { id: "c_aminata1", w: 2, at: 0.8, from: "courrier",
      m: ["✉️ Lettre d’Aminata Diallo, 52 ans, infirmière de nuit :",
          "« Trente ans de nuits à l’hôpital. Hexagonienne depuis 22 ans. La « Préférence Hexagonale » veut l’acte de naissance de mon arrière-grand-mère. Elle est née à Thiès en 1901. Je vous l’envoie ? »"],
      c: [
        { t: "Réponse type n°4.", cost: 1, r: "Réponse n°4 envoyée. Elle commence par « Madame, Monsieur ».", set: { aminata: "type" } },
        { t: "Vous êtes Hexagonienne. Point.", cost: 4, r: "Elle a répondu : « Dites-le à l’Assemblée, pas à moi. »", fx: { jeunes: 1 }, set: { aminata: "soutien" } },
        { t: "Envoyez-le en trois exemplaires.", cost: 2, r: "Le service courrier a hésité avant d’envoyer ça. Puis il l’a envoyé.", set: { aminata: "cynique" },
          leak: { p: 0.55, fx: { jeunes: -8, ouvriers: -4, colere: 6 }, news: "Le Président à une infirmière née à Dakar : « Envoyez-le en trois exemplaires »" } },
      ],
      d: { r: "Lettre classée.", set: { aminata: "ignoree" } } },

    { id: "c_aminata2", w: 6, at: 0.72, from: "courrier",
      m: S => ["✉️ Nouvelle lettre d’Aminata :",
        passed(S, "l_preference")
          ? "« J’ai perdu mon logement social. Je dors chez ma sœur et je fais toujours les nuits. Hier, j’ai soigné un député RH. Il ne m’a pas reconnue. Je l’ai quand même bien soigné. »"
          : "« On a perdu trois collègues ce mois-ci. On est deux pour quarante lits, la nuit. Si la retraite recule encore, je finirai debout. Ou couchée, dans un de mes lits. »"],
      c: [
        { t: "Réponse type n°9.", cost: 1, r: "Réponse n°9 : « Le Président salue l’engagement exemplaire des soignants. » Elle a applaudi. À 20 h, comme en 2020.", set: { aminata2: "type" } },
        { t: "Lui obtenir un logement de fonction.", cost: 5, r: "Logement trouvé : 18 m², à 40 minutes de l’hôpital. Elle a dit merci. Sincèrement.", fx: { budget: -1 }, set: { aminata2: "logement" } },
        { t: "Lui remettre la Légion d’honneur.", cost: 4, r: "Elle l’a accrochée dans le vestiaire, à côté du préavis de grève.", fx: { retraites: 1 }, set: { aminata2: "medaille" } },
        { t: "Recruter 10 000 infirmières.", cost: 8, r: "Rabot a fait un malaise. On n’a pas trouvé d’infirmière pour s’occuper de lui. Mais c’est voté.",
          fx: { budget: -8, retraites: 4, ouvriers: 3 }, set: { aminata2: "recrutement" },
          news: "10 000 postes d’infirmières créés : le ministre de l’Économie hospitalisé, faute de personnel" },
      ],
      d: { r: "Lettre classée.", set: { aminata2: "ignoree" } } },

    // ===== Patrice, 58 ans, cariste
    { id: "c_patrice1", w: 3, at: 0.74, from: "courrier",
      m: S => ["✉️ Lettre de Patrice Delcourt, 58 ans, cariste à Denain :",
        S.flags.taxeRiches
          ? "« 37 ans chez Vallon Industries. Le patron dit que l’usine part en Pologne à cause de votre taxe. Mon dos, lui, est déjà parti. »"
          : "« 37 ans chez Vallon Industries. Le patron dit que l’usine part en Pologne pour « rester compétitive ». Il a acheté un deuxième yacht la semaine dernière. Compétitif, lui aussi. »"],
      c: [
        { t: "J’appelle Vallon.", cost: 6, r: "Vallon a promis de garder l’usine « au moins jusqu’aux élections ».", fx: { ouvriers: 3, patrons: -2 }, set: { patrice: "usine" } },
        { t: "Réponse type n°2.", cost: 1, r: "Réponse n°2 : « Le Président est attentif à la réindustrialisation du territoire. »", set: { patrice: "type" } },
        { t: "Formez-vous au numérique !", cost: 2, r: "Il a répondu : « J’ai 58 ans, pas d’ordinateur et mal au dos. Je vais regarder un tuto sur le téléphone de ma petite-fille. »",
          set: { patrice: "numerique" },
          leak: { p: 0.5, fx: { ouvriers: -8, colere: 5 }, news: "« Formez-vous au numérique » : la réponse du Président à un ouvrier de 58 ans" } },
      ],
      d: { r: "Lettre classée.", set: { patrice: "ignoree" } } },

    { id: "c_patrice2", w: 7, at: 0.8, from: "courrier", when: S => passed(S, "l_retraite"),
      m: S => ["✉️ Patrice, encore :",
        S.flags.ret65
          ? "« 65 ans. On m’a dit que c’était un compromis. J’ai fait le calcul avec mon dos : on n’est pas d’accord, lui et moi. »"
          : "« 67 ans. Mon médecin dit que j’ai une chance sur deux d’y arriver. Il est optimiste, c’est son métier. »"],
      c: [
        { t: "Réponse type n°11.", cost: 1, r: "Réponse n°11 : « La réforme préserve notre modèle social. » Patrice a demandé lequel.", set: { patrice2: "type" } },
        { t: "Créer un dispositif pénibilité.", cost: 6, r: "Dispositif créé. Il y a un formulaire de 34 pages. Patrice l’a rempli. Debout.", fx: { budget: -3, ouvriers: 3 }, set: { patrice2: "penibilite" } },
      ],
      d: { r: "Lettre classée.", set: { patrice2: "ignoree" } } },

    // ===== Moussa, 24 ans, livreur
    { id: "c_moussa", w: 4, at: 0.86, from: "courrier",
      m: ["✉️ Message de Moussa, 24 ans, livreur :",
          "« Je livre les repas de l’Élysée le mardi. Sushis, sans wasabi pour le ministre de l’Intérieur. Je n’ai pas de papiers, mais je paie la TVA sur mon vélo. Je voulais juste dire bonjour. »"],
      c: [
        { t: "Lui laisser un pourboire.", cost: 2, r: "Il a eu 2 €. Le ministre de l’Intérieur a eu ses sushis.", set: { moussa: "pourboire" } },
        { t: "Transmettre son dossier à la préfecture.", cost: 3, r: "La préfecture a « bien pris en compte ». Le préfet Garrot a souri.", set: { moussa: "denonce" },
          leak: { p: 0.5, fx: { jeunes: -8, colere: 6 }, news: "L’Élysée signale son propre livreur à la préfecture" } },
        { t: "Appuyer sa régularisation.", cost: 5, r: "Dossier transmis avec une lettre de l’Élysée. Il a pleuré. Le ministre de l’Intérieur aussi, mais pas pour la même raison.",
          fx: { jeunes: 2 }, rel: { RH: -3 }, set: { moussa: "appui" } },
      ],
      d: { r: "Message classé. Les sushis sont arrivés à l’heure.", set: { moussa: "ignore" } } },

    // ===== Lucas, 19 ans
    { id: "c_lucas_blesse", w: 6, at: 0.3, from: "lucas", alt: "c_lucas6", when: S => !!S.flags.lucasBlesse,
      m: ["C’est Lucas. Celui de l’œil.",
          "Je suis porte-parole du collectif des mutilés de Jeudi Noir. On sera 300 devant l’Élysée jeudi. Venez nous voir. Vous n’aurez qu’à fermer un œil."],
      c: [
        { t: "Je viendrai.", cost: 10, r: "On vous attend. Sans CRS, s’il vous plaît. On a déjà donné.",
          fx: { jeunes: 6, police: -4, colere: -4 }, set: { lucasRencontre: true },
          news: "Le Président face aux mutilés de Jeudi Noir : 40 minutes de silence, puis un « pardon »" },
        { t: "Envoyez une délégation du ministère.", cost: 4, r: "Une délégation. Avec un PowerPoint. On l’a regardé d’un œil.", fx: { jeunes: -2 } },
        { t: "Le préfet s’en occupera.", cost: 3, r: "Le préfet. Évidemment.",
          fx: { jeunes: -6, colere: 6, gav: 300 }, set: { lucasPrefet: true },
          news: "Rassemblement des mutilés de Jeudi Noir dispersé : 300 interpellations" },
      ],
      d: { r: "Pas de réponse. On viendra quand même. On a l’habitude qu’on ne nous réponde pas.", fx: { colere: 3 } } },

    { id: "c_lucas_ok", w: 6, at: 0.3, from: "lucas", alt: "c_lucas6", when: S => !S.flags.lucasBlesse,
      m: ["Bonjour, c’est Lucas, 19 ans. J’étais à Jeudi Noir. Je n’ai rien eu, j’ai eu de la chance. Pas tout le monde.",
          "J’ai décidé de me présenter aux municipales. Un conseil ?"],
      c: [
        { t: "Ne fais pas de politique.", cost: 2, r: "C’est vous qui dites ça ?", set: { lucasConseil: "non" } },
        { t: "Rejoins mon parti.", cost: 2, r: "J’ai regardé votre bilan. Je vais réfléchir. Non, en fait.", set: { lucasConseil: "parti" } },
        { t: "Vas-y. Et ne deviens jamais comme moi.", cost: 3, r: "C’est noté. C’est même mon slogan.", fx: { jeunes: 2 }, set: { lucasConseil: "vasy" } },
      ],
      d: { r: "Pas de réponse. Je prends ça pour un « débrouille-toi ». C’est ce que vous dites à tout le monde, non ?" } },
  );

  // ---------------------------------------------------------------- PUBLICATIONS DES CITOYENS (Le Fil)
  C.citizenPosts = [
    { id: "cp_lucas1", w: 2, at: 0.3, h: "@Lucas_Hist", t: "Première manif jeudi. Ma mère a peur. Je lui ai dit qu’on était en démocratie. Elle a ri. #JeudiNoir" },
    { id: "cp_lucas_blesse", w: 2, at: 0.64, h: "@Lucas_Hist", when: S => S.flags.charge || S.flags.carteBlanche || S.flags.repression,
      t: "Je suis à l’hôpital. Grenade de désencerclement. Ils disent que je ne reverrai plus de l’œil gauche. J’ai 19 ans. #JeudiNoir", set: { lucasBlesse: true } },
    { id: "cp_lucas_ok", w: 2, at: 0.64, h: "@Lucas_Hist", when: S => !(S.flags.charge || S.flags.carteBlanche || S.flags.repression),
      t: "Rentré de la manif. Rien de cassé, à part mes illusions. #JeudiNoir" },
    { id: "cp_ginette", w: 3, at: 0.2, h: "@Mamie_Ginette", when: S => S.flags.ginette === "type",
      t: "J’ai reçu une lettre du Président. Enfin, de son imprimante. Réponse n°4. Je me demande ce que disent les trois premières." },
    { id: "cp_moussa", w: 4, at: 0.5, h: "@Moussa_Livre", t: "Livraison à l’Élysée ce soir. Le garde m’a demandé mes papiers. Je lui ai donné les sushis." },
    { id: "cp_patrice", w: 5, at: 0.35, h: "@PatriceDu59", when: S => S.flags.patrice === "numerique",
      t: "Le Président m’a dit de me former au numérique. Voilà, j’ai appris à faire une capture d’écran. 📸" },
    { id: "cp_lucas_candidat", w: 8, at: 0.2, h: "@Lucas_Hist", when: S => S.flags.lucasBlesse && !S.flags.lucasRencontre,
      t: "Je me présente contre lui. Je n’ai qu’un œil, mais je vois très bien ce qu’il a fait. #Lucas2027", fx: { jeunes: -4 },
      news: "Lucas Morel, 19 ans, mutilé de Jeudi Noir, candidat à la présidentielle" },
  ];

  // ---------------------------------------------------------------- MODE NE PAS DÉRANGER : CE QUE FONT TES MINISTRES
  C.dndActs = [
    { id: "d_lebaton", from: "lebaton", when: S => !S.flags.lebatonVire, who: "Lebâton",
      t: "a interdit trois manifestations « à titre préventif ». Et une fête des voisins.", fx: { ordre: 4, jeunes: -4, colere: 4, gav: 200 } },
    { id: "d_douce", from: "douce", when: S => S.flags.lebatonVire, who: "Mme Douce",
      t: "a organisé un atelier de respiration pour les CRS. Trois ont démissionné, deux pleurent encore.", fx: { police: -1, colere: -3 } },
    { id: "d_rabot", from: "rabot", who: "Rabot",
      t: "a vendu un aéroport régional à Vallon-Dividende. Pour 1 €. « Un signal aux marchés. »", fx: { budget: 5, patrons: 3, ouvriers: -2, eco: 2 } },
    { id: "d_clemence", from: "clemence", who: "Clémence",
      t: "a posté sur Le Fil : « Le Président travaille. Même la nuit. » La photo te montre endormi.", fx: { jeunes: -2 },
      post: ["@President_Hex", "Le Président travaille. Même la nuit. 💪🌙"] },
    { id: "d_prefet", from: "prefet", who: "Le préfet Garrot",
      t: "a testé un nouveau drone de surveillance. Sur une kermesse d’école.", fx: { colere: 3, jeunes: -2, blesses: 3 } },
    { id: "d_maman", from: "maman", who: "Ta mère",
      t: "a répondu à ta place à un journaliste. Elle lui a parlé de tes problèmes de pipi au lit jusqu’à 11 ans.", fx: { retraites: 2, jeunes: -1 } },
    { id: "d_didier", when: S => S.flags.didier, who: "Didier",
      t: "s’est promu directeur général de l’Office du Fromage. Par lui-même. Avec effet rétroactif.", fx: { budget: -1 } },
    { id: "d_vallon", from: "vallon", who: "Vallon-Dividende",
      t: "a obtenu une exonération fiscale. Ta signature électronique était « disponible ».", fx: { patrons: 5, budget: -4, ouvriers: -2 } },
    { id: "d_general", from: "general", when: S => S.ordre < 55, who: "Le Général Bastion",
      t: "a organisé un défilé militaire surprise. Personne ne l’avait demandé. Surtout pas toi.", fx: { ordre: 3, colere: 2 } },
    { id: "d_kevin", from: "kevin", who: "Kévin",
      t: "a fait un live depuis ton bureau. Il a montré le code du coffre. « C’est pour le contenu. »", fx: { jeunes: 3, retraites: -2 } },
  ];

  // ---------------------------------------------------------------- ÉPILOGUES : CE QU'ILS SONT DEVENUS
  C.epilogue = [
    { name: "Ginette", role: "84 ans, retraitée", av: "👵", col: "#8e5ca8", text: S => {
      if (S.ending === "effondrement" || S.eco >= 85)
        return `Ginette est morte pendant la canicule de juillet, dans un appartement à 41 °C. Giscard a été adopté par la voisine. ${S.flags.ginette === "type" ? "Ta réponse type n°4 était encore au mur." : "Personne n’avait répondu à sa lettre."}`;
      if ((S.flags.gelPensions || S.flags.rigueur) && !["renov", "appel"].includes(S.flags.ginette2) && S.g.retraites < 45)
        return `Ginette est morte de froid en février, dans un salon à 12 °C. Le certificat de décès dit « causes naturelles ». ${S.flags.ginette === "type" ? "Ta réponse type n°4 était encadrée au-dessus du radiateur éteint." : "Elle avait gardé ta photo de campagne sur le frigo."}`;
      if (S.flags.ginette2 === "appel" || S.flags.ginette === "lettre")
        return "Ginette a fêté ses 85 ans. Elle a montré ta lettre à tout l’immeuble. Elle a voté contre toi quand même, « pour le principe », mais elle t’a envoyé une carte.";
      return "Ginette a 85 ans. Elle se chauffe un jour sur deux. Giscard, tous les jours : il a trouvé la voisine.";
    } },
    { name: "Lucas", role: "19 ans, étudiant", av: "🧑‍🎓", col: "#3d6b8f", text: S => {
      if (!S.flags.lucasBlesse) {
        if (S.flags.lucasConseil === "vasy") return "Lucas a été élu conseiller municipal à 20 ans. Son slogan : « Ne jamais devenir comme lui. » Il a gagné avec 61 %.";
        if (S.flags.lucasConseil === "parti") return "Lucas a refusé de rejoindre ton parti. Il a créé le sien. Il a déjà plus d’adhérents que le tien.";
        return "Lucas a fini sa licence d’histoire. Son mémoire porte sur ton mandat. Il a eu 17/20. Pas toi.";
      }
      if (S.ending === "revolution") return "Lucas a franchi les grilles de l’Élysée parmi les premiers. Avec un seul œil, il a quand même trouvé ton bureau.";
      if (S.flags.lucasRencontre) return "Lucas n’a pas pardonné. Mais dans un documentaire, il dit que tu es « le seul à être venu ». Il porte un œil de verre bleu. « Couleur République », dit-il.";
      if (S.flags.lucasPrefet) return "Lucas a été interpellé une deuxième fois, au rassemblement des mutilés. Il a perdu son procès contre l’État. L’État gagne toujours.";
      if (S.flags.lucasBloque) return "Lucas t’écrit encore, chaque 14 du mois. Le numéro est bloqué. Il le sait. Il écrit quand même.";
      return "Lucas témoigne dans les lycées. Il commence toujours par : « J’avais 19 ans. Lui, il avait un téléphone. »";
    } },
    { name: "Aminata", role: "52 ans, infirmière de nuit", av: "🩺", col: "#2f7a6a", text: S => {
      if (S.flags.aminata2 === "recrutement") return "Aminata a formé les nouvelles recrues. Elle dort enfin la nuit. Elle se réveille quand même à 3 h, pour vérifier que personne ne meurt.";
      if (passed(S, "l_preference") && S.flags.aminata2 !== "logement")
        return "Aminata est partie travailler au Québec. Là-bas, on lui a demandé son diplôme, pas son arrière-grand-mère. Le service de nuit de son hôpital a fermé trois mois plus tard.";
      if (S.flags.aminata === "cynique") return "Aminata a envoyé l’acte de naissance de son arrière-grand-mère, en trois exemplaires, avec trente ans de fiches de paie. Elle n’a jamais eu de réponse.";
      if (passed(S, "l_retraite")) return `Aminata travaillera de nuit jusqu’à ${S.flags.ret65 ? 65 : 67} ans. Debout. Elle a déjà commandé ses bas de contention pour 2041.`;
      if (S.flags.aminata2 === "medaille") return "Aminata a sa Légion d’honneur, accrochée dans le vestiaire à côté du préavis de grève. La grève a duré plus longtemps que l’émotion.";
      return "Aminata fait toujours les nuits. Deux pour quarante lits. Personne ne lui a demandé son avis, ni son arrière-grand-mère.";
    } },
    { name: "Patrice", role: "58 ans, cariste", av: "🦺", col: "#a8620a", text: S => {
      if (passed(S, "l_retraite") && !S.flags.ret65 && S.flags.patrice2 !== "penibilite")
        return "Patrice est mort à 64 ans, trois ans avant sa retraite. Son dernier chariot élévateur porte une plaque à son nom. Vallon Industries a envoyé une gerbe, et la facture.";
      if (S.flags.patrice2 === "penibilite") return "Patrice a obtenu sa retraite anticipée pour pénibilité, après 34 pages de formulaire. Il pêche. Il dit que les poissons sont mieux gouvernés.";
      if (S.flags.patrice === "numerique" || (S.flags.taxeRiches && S.flags.patrice !== "usine"))
        return "L’usine de Patrice est partie en Pologne. Il a suivi une formation au numérique. Il sait maintenant faire des captures d’écran. Il en a fait une de ta réponse.";
      if (passed(S, "l_smic")) return "Avec le SMIC à 2 000 €, Patrice a changé de voiture. D’occasion, mais elle démarre. Il dit que c’est la seule réforme qu’il a sentie dans son portefeuille.";
      return "Patrice travaille toujours chez Vallon Industries. L’usine tient, son dos moins. Il a voté RH, « pour voir ». Il a vu.";
    } },
    { name: "Moussa", role: "24 ans, livreur", av: "🛵", col: "#5a4ab0", text: S => {
      if (S.flags.moussa === "denonce") return "Moussa a été expulsé un mardi, vers un pays qu’il a quitté à 6 ans. Le mardi suivant, tes sushis sont arrivés froids.";
      if (passed(S, "l_regul") || S.flags.moussa === "appui") return "Moussa a été régularisé. Il paie ses impôts, ses cotisations, et il est, contre toute attente, ravi. Il livre toujours l’Élysée. Avec du wasabi pour tout le monde.";
      if (passed(S, "l_preference") || passed(S, "l_permis") || passed(S, "l_mur")) return "Moussa a été contrôlé 41 fois cette année. Il livre toujours tes sushis. Il ne met plus de wasabi pour personne.";
      return "Moussa livre toujours, sans papiers. Le mardi, il sonne deux fois. Personne ne sait que c’est lui qui t’a nourri pendant tout le mandat.";
    } },
  ];

  // ton entourage
  C.epilogueOthers = [
    { name: "Clémence", av: "💅", col: "#b0306a", text: S => {
      if (S.stats.fuites >= 3) return "a publié « Les SMS du Président ». 400 000 exemplaires. Elle avait fait relire les captures d’écran par un avocat.";
      if (S.ending === "reelu") return "est devenue porte-parole du gouvernement. Elle ment désormais en direct, avec un très bon éclairage.";
      return "conseille un candidat RH. « Les éléments de langage, c’est comme les chaussettes : ça va avec tout. »";
    } },
    { name: "Didier", av: "🧀", col: "#c9a227", text: S => S.flags.didier
      ? "dirige toujours l’Office National du Fromage. Il a créé un sous-office du Comté, dirigé par sa compagne."
      : "est toujours au chômage. Il a voté contre toi deux fois. Il a trouvé un moyen." },
    { name: "Le préfet Garrot", av: "🎖️", col: "#3a3f63", text: S => ["repression", "carteBlanche", "charge", "interdiction"].filter(f => S.flags[f]).length >= 2
      ? "a été promu. Il a reçu la Légion d’honneur des mains de ton successeur, pour « le maintien de l’ordre exemplaire de Jeudi Noir »."
      : "a été muté dans le Cantal. Il y a interdit les rassemblements de vaches." },
    { name: "Steeve Frontière", av: "🧱", col: "#22356f", text: S => S.me === "RH"
      ? "était le chef de ton groupe. Il trouve que tu as été « trop mou ». Il prépare sa candidature contre toi."
      : S.flags.pacteRH || passed(S, "l_preference") || passed(S, "l_immigration")
      ? "te remercie dans chaque meeting d’avoir « ouvert la porte ». Il est en tête des sondages pour la prochaine présidentielle."
      : "est en tête des sondages pour la prochaine présidentielle. Il dit que c’est grâce à toi. Il n’a pas tort." },
    { name: "Ta mère", av: "👵", col: "#8e5ca8", text: S => S.ending === "reelu"
      ? "a encadré la une de ta réélection. À côté, elle a mis la photo de Didier. Plus grande."
      : "dit à ses amies que tu « fais une pause ». Elle met toujours ta cravate bleue sur la table, le dimanche." },
  ];
})();
