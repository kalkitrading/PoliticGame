// Ne Pas Déranger — coups bas : diabolisation, révélations, trolls, vidéos truquées, chantage.
// Tout est fictif. « image » change l'image d'un candidat à l'élection (en points de premier tour).
// Un mensonge peut être démonté plus tard : c'est la « fuite » (fact-check, capture d'écran).

(() => {
  const C = window.CONTENT;

  Object.assign(C.contacts, {
    trolls: { name: "Agence « Opinion+ »", role: "Influence, sondages, « veille »", av: "🕶️", col: "#3b3f4f" },
  });

  // qui t'attaque, selon le groupe que tu diriges
  const RIVAL = { HI: "CA", VP: "DP", PP: "CA", CA: "RH", DP: "HI", RH: "CA" };

  C.events.push(
    // ===== Semaine 2 : diaboliser l'Hexagonie Indomptée après Jeudi Noir
    { id: "cb_diabo_hi", w: 2, at: 0.7, from: "clemence", when: S => S.me !== "HI",
      m: ["Idée pour reprendre la main après Jeudi Noir :",
          "on accuse l’Hexagonie Indomptée d’avoir organisé les violences. C’est faux, mais ça passe très bien à la télé. Les plateaux adorent."],
      c: [
        { t: "Lance la machine.", cost: 4, r: "C’est parti. Trois éditorialistes ont déjà « des sources ».",
          fx: { overton: 3, retraites: 3 }, rel: { HI: -15 }, image: { HI: -6 },
          news: "« L’Hexagonie Indomptée derrière les violences » : l’Élysée accuse, sans preuve",
          posts: [["@MaximeTonnerre", "On nous accuse d’avoir organisé les violences. Qu’ils montrent une preuve. Une seule. On attend."]],
          leak: { p: 0.55, fx: { jeunes: -6, colere: 4 }, image: { HI: 4 }, rel: { VP: -5, PP: -5 },
                  news: "FACT-CHECK : L’Écho démontre que l’accusation contre l’HI a été fabriquée à l’Élysée" } },
        { t: "Fais-le dire par Lebâton, pas par moi.", cost: 3, r: "Malin. Si ça tourne mal, c’est lui qui saute.",
          fx: { overton: 2 }, rel: { HI: -10 }, image: { HI: -4 },
          leak: { p: 0.35, fx: { jeunes: -4, colere: 3 }, image: { HI: 3 },
                  news: "Lebâton a accusé l’HI « sur instruction de l’Élysée », révèle un SMS" } },
        { t: "Non. C’est faux, on ne dit pas ça.", cost: 2, r: "D’accord. C’est rare, un Président qui refuse un mensonge rentable. Je le note quelque part.",
          rel: { HI: 3 } },
      ],
      d: { r: "Pas de réponse. Lebâton l’a dit quand même, à la télé. Tu sais comment il est.", fx: { overton: 2 }, image: { HI: -3 }, rel: { HI: -8 } } },

    // ===== Semaine 3 : L'Écho révèle les messages racistes de candidats RH
    { id: "cb_echo_rh", w: 3, at: 0.56, from: "chloe", alt: "cb_echo", when: S => S.me !== "RH",
      m: ["Chloé Ferrand, L’Écho. On publie demain : 37 candidats du RH ont posté des messages racistes et antisémites sur des forums privés. Captures à l’appui.",
          "Vous réagissez ?"],
      c: [
        { t: "Condamnation totale. Ce parti est un danger.", cost: 4, r: "Merci. C’est clair, au moins. Steeve Frontière va dire que vous « diabolisez ».",
          fx: { overton: -3, jeunes: 3 }, rel: { RH: -10 }, image: { RH: -5 },
          news: "Messages racistes au RH : le Président dénonce « un danger pour la République »" },
        { t: "Pas de commentaire. Je ne fais pas de politique politicienne.", cost: 2, r: "Votre silence sera dans l’article. Il dit beaucoup de choses.",
          fx: { overton: 2 }, image: { RH: -1 } },
        { t: "C’est regrettable, mais l’Hexagonie Indomptée est bien pire.", cost: 3, r: "Le fameux « en même temps des extrêmes ». Je l’écris mot pour mot.",
          fx: { overton: 4, jeunes: -4 }, image: { RH: -2, HI: -3 }, rel: { HI: -8 },
          news: "Racisme au RH : le Président renvoie dos à dos « les extrêmes »" },
      ],
      d: { r: "L’Élysée n’a pas souhaité réagir. Ça aussi, je l’écris.", fx: { overton: 2 } } },

    { id: "cb_echo_moi", w: 3, at: 0.56, from: "chloe", alt: "cb_echo", when: S => S.me === "RH",
      m: ["Chloé Ferrand, L’Écho. On publie demain : 37 candidats de votre parti ont posté des messages racistes et antisémites sur des forums privés. Captures à l’appui.",
          "Que comptez-vous faire ?"],
      c: [
        { t: "Je les exclus tous les 37.", cost: 5, r: "Les 37 ? Il vous restera combien de candidats ?",
          fx: { retraites: 2, police: -2 }, image: { RH: 3 }, rel: { DP: 5 },
          news: "Le Président exclut 37 candidats racistes de son propre parti" },
        { t: "Complot médiatique !", cost: 2, r: "Classique. Vos électeurs vont adorer. Les autres, beaucoup moins.",
          fx: { overton: 4, jeunes: -6, colere: 3 }, image: { RH: -2 },
          news: "Messages racistes : le Président dénonce un « complot médiatique »" },
        { t: "Ce sont des militants un peu enthousiastes.", cost: 2, r: "« Enthousiastes ». C’est noté. C’est même le titre.",
          fx: { overton: 3, jeunes: -4 }, image: { RH: -4 },
          news: "Le Président trouve ses candidats racistes « un peu enthousiastes »" },
      ],
      d: { r: "Pas de réaction de l’Élysée. Les 37 sont toujours candidats.", fx: { overton: 2 }, image: { RH: -3 } } },

    // ===== Semaine 4 : la ferme à trolls
    { id: "cb_trolls", w: 4, at: 0.36, from: "trolls",
      m: ["Bonjour Président. Agence « Opinion+ ». Nous faisons de la « veille ».",
          "Pour 200 000 €, 5 000 comptes sur Le Fil disent ce que vous voulez, sur qui vous voulez. Discrétion garantie, à 87 %."],
      c: [
        { t: "Ciblez le RH.", cost: 3, when: S => S.me !== "RH", r: "Entendu. Nos comptes s’appelleront « Marcel_Patriote_1958 ». Personne n’y verra que du feu.",
          fx: { budget: -2 }, image: { RH: -4 },
          leak: { p: 0.45, fx: { jeunes: -6, colere: 4 }, image: { RH: 3 }, news: "Une ferme à trolls payée par l’Élysée démasquée sur Le Fil" } },
        { t: "Ciblez l’Hexagonie Indomptée.", cost: 3, when: S => S.me !== "HI", r: "Entendu. Nos comptes s’appelleront « Citoyen_Modéré_75 ». Très crédible.",
          fx: { budget: -2, overton: 2 }, image: { HI: -4 },
          leak: { p: 0.45, fx: { jeunes: -6, colere: 4 }, image: { HI: 3 }, news: "Une ferme à trolls payée par l’Élysée démasquée sur Le Fil" } },
        { t: "Faites-moi plutôt aimer.", cost: 3, r: "Plus difficile. Comptez 400 000 €.",
          fx: { budget: -4, jeunes: 2 }, image: { me: 3 },
          leak: { p: 0.5, fx: { jeunes: -8 }, image: { me: -5 }, news: "5 000 faux comptes chantaient les louanges du Président" } },
        { t: "Non merci.", cost: 1, r: "Dommage. Vos adversaires, eux, ont dit oui." , image: { me: -1 } },
      ],
      d: { r: "Pas de réponse. Nous avons proposé nos services à vos adversaires. Ils ont accepté.", image: { me: -2 } } },

    // ===== Semaine 5 : une vidéo truquée de toi
    { id: "cb_deepfake", w: 5, at: 0.2, from: "clemence",
      m: S => ["🚨 Une vidéo truquée de toi circule : tu y dis « Les retraités, c’est des charges qui marchent. »",
               `6 millions de vues. Elle vient de comptes proches de ${C.candidates[RIVAL[S.me]]}. On fait quoi ?`],
      c: [
        { t: "Démenti avec preuves techniques.", cost: 6, r: "Fait. Le démenti a fait 40 000 vues. La vidéo, 6 millions. Mais c’est fait.",
          fx: { retraites: -2 } },
        { t: "Porter plainte et accuser le camp adverse.", cost: 4, r: "Plainte déposée. Ils crient à la « censure ». Tout le monde crie, c’est la démocratie.",
          fx: { retraites: -3 }, image: S => ({ [RIVAL[S.me]]: -3 }), rel: S => ({ [RIVAL[S.me]]: -8 }) },
        { t: "Dire que c’est vrai, mais sorti de son contexte.", cost: 2, r: "…Il y avait un contexte ?",
          fx: { retraites: -8 }, image: { me: -3 } },
      ],
      d: { r: "Pas de réponse. La vidéo est devenue un mème. Ta mère l’a partagée « pour rire ».", fx: { retraites: -6 }, image: { me: -4 } } },

    // ===== Semaine 6 : un rival lance un hashtag contre toi
    { id: "cb_hashtag", w: 6, at: 0.5, from: "clemence",
      m: S => {
        const tags = { CA: "#PrésidentDesExtrêmes", RH: "#PrésidentDesMigrants", HI: "#PrésidentDesRiches", DP: "#KhmersVerts" };
        const r = RIVAL[S.me];
        return [`🚨 ${C.candidates[r]} lance ${tags[r] || "#PrésidentDeRien"}. Numéro un des tendances depuis ce matin.`,
          "On riposte comment ?"];
      },
      c: [
        { t: "Riposte frontale sur Le Fil.", cost: 5, r: "Le clash fait 10 millions de vues. Personne n’a retenu le fond, tout le monde a retenu le clash.",
          fx: { jeunes: 2 }, image: S => ({ [RIVAL[S.me]]: -2, me: -1 }) },
        { t: "Reprendre leurs mots pour leur couper l’herbe sous le pied.", cost: 3,
          r: "Tu parles désormais comme eux. Les sondages remontent un peu. Ils disent merci : tu as rendu leurs mots normaux.",
          fx: S => ({ overton: S.me === "RH" ? -4 : RIVAL[S.me] === "RH" ? 7 : RIVAL[S.me] === "HI" ? -5 : 3 }),
          image: S => ({ me: 2, [RIVAL[S.me]]: 2 }) },
        { t: "Ignorer. Ça passera.", cost: 1, r: "Ça passera. Dans trois semaines. Juste après l’élection.", image: { me: -3 } },
      ],
      d: { r: "Pas de réponse. Le hashtag a tenu quatre jours.", image: { me: -3 } } },

    // ===== Semaine 6 : le chantage
    { id: "cb_chantage", w: 6, at: 0.78, from: "inconnu",
      m: ["J’ai des photos de ton ministre Rabot sur le yacht de Vallon-Dividende, avec une valise.",
          "50 000 € ou je les envoie à L’Écho. Tu as 24 heures. Bisous."],
      c: [
        { t: "Payer. En liquide.", cost: 3, r: "Merci. C’est un plaisir de faire affaire avec l’État.",
          fx: { budget: -1 },
          leak: { p: 0.6, fx: { jeunes: -6, ouvriers: -6, retraites: -6, colere: 8 }, image: { me: -6 },
                  news: "SCANDALE : l’Élysée a payé un maître chanteur pour protéger un ministre" } },
        { t: "Publiez. Je n’ai rien à cacher.", cost: 3, r: "Comme tu veux. Rabot, lui, avait beaucoup à cacher.",
          fx: { patrons: -3, colere: 2 }, image: { me: 1 },
          news: "Photos du ministre de l’Économie sur le yacht de Vallon-Dividende : « une valise de travail »" },
        { t: "Envoyez plutôt des photos de mes adversaires.", cost: 3, r: "Je n’en ai pas. Mais je peux en fabriquer. 80 000 €.",
          fx: { budget: -2 }, image: S => ({ [RIVAL[S.me]]: -4 }),
          leak: { p: 0.5, fx: { jeunes: -6, colere: 5 }, image: { me: -6 }, news: "Photos truquées d’opposants : la piste mène à l’Élysée" } },
      ],
      d: { r: "24 heures écoulées. C’est envoyé.", fx: { patrons: -3, colere: 3 }, image: { me: -2 },
           news: "Photos du ministre de l’Économie sur le yacht de Vallon-Dividende" } },

    // ===== Semaine 7 : dernière ligne droite, on ressort les dossiers
    { id: "cb_dossiers", w: 7, at: 0.62, from: "clemence",
      m: ["Dernière ligne droite. J’ai trois dossiers dans le tiroir. Un vrai, deux… arrangés.",
          "On en sort un ?"],
      c: [
        { t: "Le vrai : le yacht de Bertrand Héritage, payé par sa société.", cost: 4, when: S => S.me !== "DP",
          r: "Vrai, sourcé, vérifiable. C’est presque du journalisme.", image: { DP: -5 }, rel: { DP: -10 },
          news: "Le yacht de Bertrand Héritage payé par son entreprise, selon L’Écho" },
        { t: "Les vieux tweets de Maxime Tonnerre, un peu retouchés.", cost: 3, when: S => S.me !== "HI",
          r: "« Un peu ». Disons qu’on a changé les verbes.", fx: { overton: 2 }, image: { HI: -5 }, rel: { HI: -10 },
          leak: { p: 0.55, fx: { jeunes: -6, colere: 4 }, image: { HI: 4, me: -5 }, news: "FACT-CHECK : les tweets de Tonnerre ont été retouchés par l’équipe du Président" } },
        { t: "Capucine Lombric veut interdire les barbecues.", cost: 3, when: S => S.me !== "VP",
          r: "C’est faux, mais c’est le genre de chose que les gens veulent croire.", fx: { overton: 2, ouvriers: 2 }, image: { VP: -5 },
          leak: { p: 0.45, fx: { jeunes: -5 }, image: { VP: 3, me: -4 }, news: "L’« interdiction des barbecues » : une rumeur lancée par l’Élysée" } },
        { t: "Aucun. On fait campagne sur notre bilan.", cost: 2, r: "Sur notre bilan. Courageux. Je prépare des diapositives très, très courtes.",
          image: { me: 1 } },
      ],
      d: { r: "Pas de réponse. J’ai sorti le moins risqué. Personne ne l’a lu." } },
  );

  // coups bas que les autres lancent sur Le Fil, pour l'ambiance
  C.ambient.tense.push(
    ["@Citoyen_Modere_75", "Moi je dis juste que l’HI a du sang sur les mains. Source : un ami à moi."],
    ["@Marcel_Patriote_1958", "On ne peut plus rien dire dans ce pays. (Je viens de tout dire.)"],
  );
})();
