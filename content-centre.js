// Ne Pas Déranger — la partie vue depuis l'extrême centre (programme « Ni l'un ni l'autre »).
// Le jeu de base était déjà ce gouvernement ; ici, il devient sa caricature assumée.
// Le fil rouge vient de « Logocratie » (Clément Viktorovitch, 2025) : le pouvoir ne ment pas, il renomme.
// Ton téléphone traduit le réel en éléments de langage, un peu plus chaque semaine (C.novlangue).
// Clins d'œil au réel : « les gens qui ne sont rien » (2017), « je traverse la rue » (2018), « un pognon de dingue » (2018),
// « qu'ils viennent me chercher » (2018), « Gaulois réfractaires » (2018), « ne parlez pas de répression » (2019),
// l'« attaque » de la Pitié-Salpêtrière (2019), les masques « inutiles » (2020), le concours d'anecdotes avec des youtubeurs (2021),
// « emmerder » (2022), les cabinets de conseil (2022), les faux billets du Stade de France (2022), les 49.3 en série (2023),
// la dissolution « pour clarifier » (2024), le ministre romancier, le « réarmement » et l'« en même temps ».

(() => {
  const C = window.CONTENT;
  const P = "centre";
  const all = () => [...C.events, ...C.pool, ...(C.alerts || [])];
  const V = (id, v) => { const e = all().find(x => x.id === id); e.variants = { ...(e.variants || {}), [P]: v.c ? { ov: false, ...v } : v }; };

  // ---------------------------------------------------------------- LA NOVLANGUE
  // Les mots du réel, remplacés à l'affichage. Le choix « Parler vrai » (flag parlerVrai) la désactive.
  C.novlangue = C.novlangue || {};
  C.novlangue[P] = [
    { from: 1, words: { "violences policières": "« usages proportionnés de la force »", "Violences policières": "« Usages proportionnés de la force »",
                        "répression": "fermeté républicaine", "Répression": "Fermeté républicaine" } },
    { from: 3, words: { "grévistes": "preneurs d’otages", "faire grève": "prendre le pays en otage", "en grève": "en pleine prise d’otage", "Grève": "Prise d’otage", "grève": "prise d’otage", "licenciements": "plans de sauvegarde de l’emploi",
                        "au chômage": "en transition professionnelle", "chômeurs": "talents en transition", "pauvres": "personnes éloignées de la réussite",
                        "austérité": "responsabilité" } },
    { from: 5, words: { "mensonge": "approximation", "Mensonge": "Approximation", "menteur": "communicant", "scandale": "polémique", "Scandale": "Polémique" } },
    { from: 7, words: { "démocratie": "démocratie (sous réserve)", "Démocratie": "Démocratie (sous réserve)", "manifestants": "individus", "Manifestants": "Individus" } },
  ];

  // ---------------------------------------------------------------- LES SEMAINES
  C.weeksBy = C.weeksBy || {};
  C.weeksBy[P] = {
    1: { title: "Le Nouveau Monde", agenda: ["Lun — Premier Conseil des ministres « en mode start-up »", "Jeu — Les syndicats appellent à la mobilisation"] },
    5: { title: "L’Affaire du Garde du Corps", agenda: ["Mar — L’Écho publie une vidéo", "Jeu — Réunion du groupe parlementaire"] },
    6: { title: "Le Grand Débat", agenda: ["Lun — Grève générale ?", "Mer — Le Président parle 7 heures sans pause"] },
    7: { title: "La Clarification", agenda: ["Mar — L’agence de notation rend son verdict", "Jeu — Débat télévisé"] },
  };

  // ================================================================ SEMAINE 1
  V("w1_intro", {
    m: ["Félicitations Président. 50,3 % des voix, 61 % d’abstention. Élu au second tour grâce au « barrage ». Les électeurs de gauche qui ont voté pour toi attendent un geste.",
        "Rappel : chaque réponse vide ta batterie 🔋. Quand elle meurt, tes ministres décident à ta place. Ils n’attendent que ça.",
        "Règle n° 1 : on ne dit jamais « je me suis trompé ». On dit « nous n’avons pas assez expliqué ». Les réponses 🔓 peuvent fuiter."],
    c: [
      { t: "Nous avons entendu le message des urnes.", cost: 2, r: "Parfait. L’avoir entendu, sans rien changer. C’est tout un art." },
      { t: "J’ai été élu sur mon programme, pas sur un barrage.", cost: 2, r: "Les électeurs du barrage s’en souviendront. Au prochain barrage. S’il y en a un.",
        fx: { jeunes: -3, overton: 1 }, set: { arrogant: true } },
    ],
  });

  V("w1_maman", {
    m: ["Mon chéri tu passes à la télé jeudi ? Mets la cravate bleue, la rouge te fait communiste.",
        "Et ne parle plus aux chômeurs dans la rue. Tu sais comment ça finit."],
  });

  V("w1_rabot", {
    m: ["Président, Rabot. Le « quoi qu’il en coûte » est terminé. Il a coûté.",
        "J’ai trouvé 40 milliards : deux jours fériés, gel des salaires et des pensions, franchise médicale doublée. Les gens adorent les sacrifices. Surtout ceux des autres.",
        "PS : je sors un roman la semaine prochaine. Il y a une scène un peu osée. Ça humanise."],
  });

  V("w1_josy", {
    m: ["Bonjour Président. Josy Martel, Union des Travailleurs Fatigués.",
        "Les gens n’arrivent plus à payer leur loyer. Mobilisation jeudi prochain. Raffineries, rail, écoles. Et on a entendu parler de votre « Plan Rigueur »."],
    c: [
      { t: "Venez co-construire à l’Élysée.", cost: 8, r: "« Co-construire ». On viendra. On vous laissera parler deux heures, comme d’habitude.",
        fx: { colere: -6, ouvriers: 4, patrons: -3 }, set: { negoW1: true }, news: "Le Président reçoit les syndicats : « un dialogue franc », selon personne" },
      { t: "« Je ne céderai rien, ni aux fainéants, ni aux cyniques, ni aux extrêmes. »", cost: 5, r: "« Fainéants ». Tu viens de le redire. On l’imprime sur les banderoles, merci pour le slogan.",
        fx: { colere: 9, patrons: 4, ouvriers: -6, overton: 2 }, news: "« Ni aux fainéants » : le Président ressort sa formule, les syndicats aussi" },
      { t: "Combien coûte une carte syndicale ? J’en achète 10 000.", cost: 5, r: "J’ai fait une capture d’écran. Bonne soirée, Président.",
        fx: { colere: 4, patrons: 2 },
        leak: { p: 0.85, soon: true, fx: { ouvriers: -12, jeunes: -6, colere: 10 }, news: "FUITE : le Président propose d’« acheter » un syndicat par SMS" } },
    ],
    d: { r: "Silence radio de l’Élysée. On note.", fx: { colere: 5 } },
  });

  V("w1_kevin", {
    m: ["yo le Président 🔥 c Kévin (3,2M d’abonnés)",
        "jte propose un concours d’anecdotes, comme t’avais fait avec les autres youtubeurs. si tu perds, tu mets ma photo dans ton bureau"],
    c: [
      { t: "Banco.", cost: 6, r: "t’as perdu. ma photo est au mur. à côté de de Gaulle. il a l’air moins content que moi",
        fx: { budget: -1, jeunes: 6, retraites: -4 }, news: "Le Président perd un concours d’anecdotes contre un youtubeur et affiche sa photo à l’Élysée" },
      { t: "Non. Je suis le Président.", cost: 2, r: "ok boomer. jupitérien en plus", fx: { jeunes: -2 } },
    ],
  });

  // ================================================================ LA NOVLANGUE, EXPLIQUÉE PAR CLÉMENCE
  C.events.push(
    { id: "k_novlangue", w: 1, at: 0.3, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["J’ai installé nos éléments de langage directement dans ton téléphone. Il traduit tout seul, même les messages des autres.",
          "Exemple : quand quelqu’un écrit « violences poli\u00ADcières », tu liras autre chose. Ça repose. Et chaque semaine, j’ajoute des mots."],
      c: [
        { t: "Parfait. Les mots créent la réalité.", cost: 2, r: "Exactement. La réalité, elle, n’a pas d’attaché de presse." },
        { t: "Désactive ça. On parle vrai.", cost: 4, r: "Désactivé. Tu vas lire ce que les gens écrivent vraiment. Bon courage.",
          fx: { jeunes: 3, colere: -3, patrons: -2, overton: -1 }, set: { parlerVrai: true } },
      ],
      d: { r: "Pas de réponse : je laisse activé. Ne pas choisir, c’est déjà choisir. C’est dans le manuel." } },

    // ================================================================ SEMAINE 2
    // l'« attaque » de l'hôpital
    { id: "k_hopital", w: 2, at: 0.92, from: "lebaton", when: S => S.programme === P, ov: false,
      m: ["Président, Lebâton. Pendant la manif, des manifestants se sont réfugiés dans la cour d’un hôpital pour fuir les gaz.",
          "Je propose de tweeter : « Ils ont attaqué l’hôpital et agressé les soignants. » Ça nous fait la soirée."],
      c: [
        { t: "Tweetez.", cost: 3, r: "Tweeté. 40 000 partages. Une vidéo arrive. Elle montre des gens qui fuient, et une infirmière qui leur ouvre la porte.",
          fx: { police: 3, retraites: 4, overton: 2 },
          leak: { p: 0.85, soon: true, fx: { jeunes: -8, retraites: -6, colere: 8 }, image: { me: -2 }, news: "La vidéo dément l’« attaque » de l’hôpital : les manifestants fuyaient les gaz" } },
        { t: "Parlez d’« intrusion violente ». C’est vague, ça marche.", cost: 3, r: "Le mot est vague. Assez vague pour ne pas être démenti. C’est tout l’art.",
          fx: { police: 2, retraites: 2, overton: 1 },
          leak: { p: 0.3, fx: { jeunes: -4 }, news: "« Intrusion violente » : le ministre maintient, la vidéo aussi" } },
        { t: "Dites la vérité : ils fuyaient les gaz.", cost: 4, r: "La vérité. Personne ne la partagera. Mais personne ne pourra la démentir.",
          fx: { police: -3, jeunes: 3 } },
      ],
      d: { r: "Pas de réponse. J’ai tweeté. Par réflexe.", fx: { police: 3, retraites: 3 }, image: { me: -1 } } },

    // « je traverse la rue »
    { id: "k_rue", w: 2, at: 0.72, from: "inconnu", when: S => S.programme === P, ov: false,
      m: ["Bonjour Président, on s’est croisés aux Journées du patrimoine, dans le jardin de l’Élysée.",
          "Je suis horticulteur. Je cherche du travail depuis deux ans. Vous m’aviez dit de vous écrire."],
      c: [
        { t: "Traversez la rue, je vous trouve du travail.", cost: 3, r: "J’ai traversé. Il y avait un restaurant. Ils cherchaient un plongeur. Je suis horticulteur.",
          fx: { ouvriers: -5, jeunes: -3, colere: 3, overton: 1 }, news: "« Je traverse la rue, je vous trouve du travail » : la vidéo fait 20 millions de vues" },
        { t: "Je transmets votre dossier à France Travail.", cost: 3, r: "Ils m’ont proposé une formation de « coach en reconversion ». Pour aider les chômeurs. Comme moi.",
          fx: { ouvriers: 1 } },
        { t: "Les jardins de l’Élysée recrutent. Je vous embauche.", cost: 5, r: "Embauché. Je taille vos rosiers. Ils sont plus faciles à tailler que vos budgets.",
          fx: { ouvriers: 3, retraites: 2, budget: -1 } },
      ],
      d: { r: "Pas de réponse. J’ai traversé la rue quand même. Toujours rien." } },

    // ================================================================ SEMAINE 3
    // « un pognon de dingue »
    { id: "k_pognon", w: 3, at: 0.75, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["Idée com : on te filme en réunion en train de dire « on met un pognon de dingue dans les minima sociaux, et les gens ne s’en sortent pas ».",
          "C’est franc, c’est cash, ça fait « Président qui parle vrai ». On poste la vidéo nous-mêmes."],
      c: [
        { t: "Filmez. Et postez.", cost: 3, r: "Posté. 30 millions de vues. Les gens ont retenu « pognon de dingue ». Pas « ne s’en sortent pas ».",
          fx: { retraites: 2, ouvriers: -6, jeunes: -4, colere: 5, overton: 2 }, news: "« Un pognon de dingue » : la vidéo publiée par l’Élysée lui-même" },
        { t: "Baisser les APL de 5 € plutôt. Personne ne remarquera.", cost: 3, r: "5 €. Les étudiants ont remarqué. Ils ont compté. Ils comptent tout, ils n’ont que ça.",
          fx: { budget: 3, jeunes: -8, overton: 1 }, news: "APL : moins 5 € par mois, « un effort symbolique »" },
        { t: "Non. On augmente les minima sociaux.", cost: 5, r: "Augmenter ? Le Centre Absolu a fait un malaise. Collectif.",
          fx: { budget: -6, ouvriers: 5, retraites: 3, patrons: -3, overton: -2 } },
      ] },

    // les faux billets du stade
    { id: "k_stade", w: 3, at: 0.92, from: "lebaton", when: S => S.programme === P, ov: false,
      m: ["Président, chaos au Stade de l’Hexagone pour la finale européenne. Familles gazées, enfants piétinés, images partout.",
          "Je propose d’annoncer « 40 000 faux billets, une fraude massive, industrielle et organisée ». L’organisateur en a compté 2 600, mais bon."],
      c: [
        { t: "40 000. Fraude massive et industrielle.", cost: 3, r: "Annoncé. Les supporters ont des vidéos. Les journalistes aussi. Les images de la police, elles, ont été « effacées automatiquement ».",
          fx: { police: 4, overton: 2 },
          leak: { p: 0.8, fx: { jeunes: -6, retraites: -4, colere: 6 }, image: { me: -2 }, news: "Faux billets : 2 600, pas 40 000. Les images de vidéosurveillance « automatiquement effacées »" } },
        { t: "Reconnaître des erreurs d’organisation. S’excuser.", cost: 5, r: "Des excuses. Le ministre a fait une tête. Les supporters, une autre. Les deux sont étonnés.",
          fx: { police: -3, jeunes: 3, retraites: 2 }, image: { me: 1 } },
        { t: "Dire que c’est la faute du vent qui a rabattu les gaz.", cost: 3, r: "Le vent. Il n’a pas de syndicat, il ne portera pas plainte.",
          fx: { jeunes: -3 },
          leak: { p: 0.4, fx: { jeunes: -4 }, news: "Gaz au stade : « la faute du vent », selon l’Élysée" } },
      ] },

    // ================================================================ SEMAINE 4
    // les sacs de sable « inutiles »
    { id: "k_sacs", w: 4, at: 0.35, from: "clemence", when: S => S.programme === P, ov: false,
      m: ["Petit problème : il n’y a plus de sacs de sable. On en a vendu le stock en 2019, ça coûtait trop cher à stocker.",
          "Je propose de dire qu’ils sont « inutiles pour le grand public » et « difficiles à utiliser ». Moi-même, je ne saurais pas m’en servir."],
      c: [
        { t: "Dites qu’ils sont inutiles.", cost: 3, r: "Dit. Les sinistrés remplissent des taies d’oreiller. Les pompiers demandent des sacs. Discrètement.",
          fx: { retraites: -2, overton: 1 },
          leak: { p: 0.75, fx: { retraites: -8, jeunes: -4, colere: 8 }, image: { me: -2 }, news: "Sacs de sable « inutiles » : le stock avait été vendu en 2019, révèle L’Écho" } },
        { t: "Avouer la pénurie. Commander en urgence.", cost: 5, r: "Avoué. C’est la première fois qu’on dit la vérité sur un stock. Les marchés n’ont pas bougé.",
          fx: { budget: -3, retraites: 3 } },
        { t: "« Nous sommes en guerre. » Contre la pluie.", cost: 4, r: "La guerre contre la pluie. Le pays est mobilisé, les sacs toujours introuvables.",
          fx: { retraites: 2, jeunes: -2, ordre: 2 } },
      ] },

    // ================================================================ SEMAINE 5
    // les cabinets de conseil
    { id: "k_conseil", w: 5, at: 0.82, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, le cabinet McKinley nous a facturé un milliard cette année. Réforme des retraites, stratégie sanitaire, et un rapport de 200 pages sur « l’avenir du métier d’enseignant ».",
          "Le Sénat découvre qu’il ne paie pas d’impôt en Hexagonie. Il demande des comptes."],
      c: [
        { t: "Ils sont indispensables : ils pensent pendant qu’on décide.", cost: 4, r: "Indispensables. Leur rapport sur les enseignants recommandait de « former les enseignants ». 496 800 €.",
          fx: { patrons: 4, jeunes: -3, overton: 1 },
          leak: { p: 0.6, fx: { retraites: -6, ouvriers: -6, colere: 6 }, image: { me: -2 }, news: "Cabinets de conseil : un milliard d’euros, zéro euro d’impôt" } },
        { t: "« S’il y a des preuves de manipulation, que ça aille au pénal. »", cost: 3, r: "Au pénal. Le dossier y est allé. Il y est encore. Il y sera longtemps.",
          fx: { retraites: -2 } },
        { t: "On réinternalise. Les fonctionnaires savent faire.", cost: 5, r: "Les fonctionnaires ont produit le même rapport en trois semaines, pour le prix d’une machine à café.",
          fx: { budget: 3, patrons: -3, ouvriers: 2 } },
      ] },

    // ================================================================ SEMAINE 7
    // la dissolution « pour clarifier »
    { id: "k_dissolution", w: 7, at: 0.6, from: "parti", when: S => S.programme === P, ov: false,
      m: ["Président, ton groupe a appris par la télé que tu envisages de dissoudre l’Assemblée « pour clarifier ».",
          "On te rappelle que le RH est à 33 % et que personne, absolument personne, ne te le conseille."],
      c: [
        { t: "Dissolution. Je fais confiance au peuple.", cost: 5, r: "Dissoute. Le RH arrive en tête. Ton groupe perd 80 sièges. C’est clarifié.",
          fx: { colere: 6, retraites: -4, jeunes: -4, overton: 4 }, rel: { CA: -10, HI: -6, DP: -6 }, image: { RH: 5 }, set: { dissolution: true },
          news: "Dissolution surprise : « J’ai décidé de vous redonner le choix »" },
        { t: "Je ne dissoudrai pas.", cost: 3, r: "Noté. Tu l’as déjà dit la dernière fois. Avant de le faire.", fx: { overton: -1 } },
        { t: "Remaniement : on change les têtes, on garde les idées.", cost: 4, r: "14 ministres changent de bureau. Aucun ne change d’avis. Le Premier ministre a 34 ans, c’est la nouveauté.",
          fx: { jeunes: 2, retraites: 1, colere: -2 } },
      ] },
  );

  // ================================================================ SEMAINE 2 À 7 : LES VARIANTES
  V("w2_video_a", {
    m: ["🚨 Une vidéo cartonne : un CRS frappe un manifestant à terre. 4 millions de vues. #JeudiNoir",
        "Les journalistes parlent de violences policières. On dit quoi ?"],
    c: [
      { t: "« Ne parlez pas de répression ou de violences policières : ces mots sont inacceptables dans un État de droit. »", cost: 5,
        r: "Les mots sont inacceptables. La vidéo, elle, a été acceptée par 4 millions de personnes.",
        fx: { police: 6, jeunes: -10, colere: 8, overton: 3 }, news: "« Ces mots sont inacceptables » : le Président refuse de parler de violences policières" },
      { t: "Il faut attendre l’enquête de l’IGPN.", cost: 5, r: "L’IGPN. La police enquête sur la police. Personne ne verra la différence.",
        fx: { police: 4, jeunes: -6, colere: 6, overton: 2 } },
      { t: "Inacceptable. Suspension immédiate du policier.", cost: 6, r: "Les syndicats de police menacent d’une grève du zèle. Concrètement, ils vont faire leur travail. Lentement.",
        fx: { police: -12, jeunes: 8, colere: -6, overton: -2 }, news: "Violences policières : le Président suspend un CRS, les syndicats de police fulminent" },
    ],
    d: { r: "Pas de réponse. J’ai publié « Pensées pour tout le monde ». Ça a très mal marché.", fx: { jeunes: -5, colere: 5 } },
  });

  V("w3_lebaton", {
    m: ["Président, Lebâton. Je propose qu’on parle désormais d’« ensauvagement » et d’« écoterrorisme ». Ce sont des mots qui travaillent.",
        "Et d’interdire toutes les manifestations. Et les rassemblements de plus de 3 personnes. Et les groupes WhatsApp."],
  });

  // l'affaire du garde du corps
  V("w5_chloe", {
    m: ["Chloé Ferrand, L’Écho. On a une vidéo : ton garde du corps, Alexandre Bonalla, casqué en policier, frappe un manifestant le 1er mai.",
        "Il n’est pas policier. Il a un badge, une voiture avec gyrophare et un appartement de fonction. Un commentaire ?"],
    when: () => true,
    c: [
      { t: "« Le seul responsable, c’est moi. Qu’ils viennent me chercher. »", cost: 4, r: "Ils sont venus. Une commission d’enquête du Sénat, quatre mois d’auditions. Tu n’y es pas allé.",
        fx: { retraites: -4, jeunes: -4, colere: 6, overton: 1 }, image: { me: -2 },
        news: "« Qu’ils viennent me chercher » : le Président défie les parlementaires après l’affaire Bonalla" },
      { t: "Il est licencié immédiatement.", cost: 6, r: "Licencié. Deux mois après la vidéo, mais licencié. On a dit « immédiatement » quand même.",
        fx: { colere: -4, jeunes: 3 }, image: { me: 1 }, news: "Affaire Bonalla : le garde du corps licencié" },
      { t: "C’est une tempête dans un verre d’eau.", cost: 4, r: "Le verre d’eau fait la une de 40 journaux. Il déborde.",
        fx: { retraites: -4, jeunes: -3, colere: 4 }, image: { me: -1 } },
      { t: "Combien pour ne pas publier ?", cost: 4, r: "Merci. Je viens d’ajouter un paragraphe.",
        leak: { p: 0.95, soon: true, fx: { jeunes: -8, ouvriers: -8, retraites: -8, colere: 15 }, news: "EXCLUSIF : le Président tente d’acheter le silence de L’Écho" } },
    ],
    d: { r: "Pas de commentaire. J’écris : « L’Élysée n’a pas souhaité répondre ». Mes lecteurs adorent.", fx: { retraites: -4, jeunes: -4, colere: 5 } },
  });

  V("w6_josy_hot", {
    m: ["Grève générale reconductible à partir de lundi.",
        "Trains, écoles, hôpitaux, éboueurs. Le pays s’arrête. On ne lâchera rien. Et on a gardé vos citations sur les banderoles."],
    c: [
      { t: "Je cède sur tout.", cost: 10, r: "Tout ? …On n’avait pas prévu ça. On va devoir rentrer chez nous. C’est déstabilisant.",
        fx: { budget: -12, colere: -25, patrons: -10, ouvriers: 15, jeunes: 8 }, set: { cede: true }, news: "CAPITULATION : le Président cède sur toutes les revendications" },
      { t: "« J’ai très envie de les emmerder. Et donc on va continuer, jusqu’au bout. »", cost: 4, r: "Tu l’as dit dans un journal. Les banderoles de lundi sont déjà imprimées.",
        fx: { colere: 10, ouvriers: -8, retraites: 3, patrons: 3, overton: 2 }, news: "« Les emmerder, jusqu’au bout » : le Président face à la grève générale" },
      { t: "On réquisitionne tout le monde.", cost: 8, r: "Même les éboueurs ? Bonne chance avec l’odeur.",
        fx: { ordre: 8, colere: 12, ouvriers: -12, gav: 2000, overton: 6 }, set: { requisition: true }, news: "Réquisition générale : 2 000 grévistes en garde à vue" },
      { t: "Je démissionne ?", cost: 2, r: "…C’est une question ou une réponse ?", end: "burnout" },
    ],
  });

  V("w7_debat", {
    m: ["Débat télé jeudi, le dernier avant l’élection. Le RH et l’Hexagonie Indomptée vont t’attaquer des deux côtés. Comme prévu : c’est ton seul plan depuis le début.", "Ta stratégie ?"],
    c: [
      { t: "« Moi ou le chaos. » Encore.", cost: 6, r: "Le chaos a monté de quatre points pendant le débat. Il a un bon coach.",
        fx: { retraites: 4, jeunes: -4, overton: 2 }, image: { RH: 2 } },
      { t: "« Je n’ai pas réussi à réconcilier. » Mea culpa sans rien changer.", cost: 6, r: "Le mea culpa a duré 22 minutes. Personne n’a trouvé ce qui changeait. C’était voulu.",
        fx: { jeunes: 3, ouvriers: 2, colere: -3 } },
      { t: "« Réarmement civique, démographique, moral. » Tout réarmer.", cost: 6, r: "Réarmer les naissances. Les retraités applaudissent. Les femmes de moins de 40 ans un peu moins.",
        fx: { retraites: 5, police: 4, jeunes: -6, overton: 3 } },
    ],
  });

  // ================================================================ LE FIL, VU DE L'EXTRÊME CENTRE
  C.ambientBy = C.ambientBy || {};
  C.ambientBy[P] = {
    calm: [
      ["@EntrepreneurDuDim", "Enfin un gouvernement qui comprend l’entreprise 💼 #StartUpNation"],
      ["@Mamie_Ginette", "Le Président a parlé 7 heures au Grand Débat. J’ai fait une sieste, je me suis réveillée, il parlait encore."],
      ["@PatriceDu59", "Rien à signaler. Comme ma fiche de paie. Mais elle est « en transformation »."],
      ["@Lea_Sciences_Po", "Thread 🧵 : relevé des expressions du gouvernement qui veulent dire le contraire de ce qu’elles disent (1/112)"],
      ["@MiloDu93", "il a dit qu’il faut que les jeunes aient envie de devenir milliardaires. j’ai envie. ça suffit pas apparemment"],
      ["@Jeunes_CentreAbsolu", "Le Président est le plus grand penseur de notre temps. Sa pensée est trop complexe pour vous. Pour nous aussi, mais on y croit."],
    ],
    tense: [
      ["@PatriceDu59", "Salaire gelé, loyer pas gelé. On m’a dit que c’était « en même temps ». #VieChère"],
      ["@Lea_Sciences_Po", "Rappel : « pas de 49.3 », c’était il y a trois 49.3. #JeudiNoir"],
      ["@CRS_Anonyme", "15 h de service, on se fait insulter des deux côtés, et le ministre parle d’« ensauvagement ». Lequel ?"],
      ["@Mamie_Ginette", "On m’a dit que j’étais une « Gauloise réfractaire au changement ». J’ai 84 ans. Je change de couche, c’est déjà beaucoup."],
      ["@InfoChoc24", "🔴 Le Président « a entendu la colère ». Il n’a pas précisé ce qu’il comptait en faire."],
      ["@MiloDu93", "« dialogue social » mais c’est un monologue de 3 heures avec des lacrymos à la fin"],
      ["@JosyMartelUTF", "Ils appellent ça « co-construire ». Nous, on appelle ça « venir écouter ».  #Grève"],
    ],
    angry: [
      ["@MiloDu93", "il a dit « qu’ils viennent me chercher ». on arrive. #ÉlyséeOuverte"],
      ["@PatriceDu59", "J’ai voté pour lui pour faire barrage. J’ai mangé des moules périmées une fois aussi. Même regret."],
      ["@Lea_Sciences_Po", "Ce gouvernement a perdu toute légitimité. Il garde le 49.3. #Démission"],
      ["@Mamie_Ginette", "J’ai 84 ans et je viens d’acheter un gilet jaune. Il me va très bien. Il paraît que je suis « une foule »."],
      ["@InfoChoc24", "🔴 ALERTE : barricades dans 40 villes. L’Élysée parle de « quelques individus »."],
      ["@SteeveFrontiere", "Sept ans de « barrage ». Le barrage, c’était lui. Il a cédé. #Frontière2027"],
      ["@Anonymous_Hex", "Nous publierons bientôt les SMS du gouvernement. Et les factures de McKinley. 👁️"],
    ],
  };

  // ================================================================ TES PUBLICATIONS
  C.postsBy = C.postsBy || {};
  C.postsBy[P] = [
    null,
    [ { t: "Ni de droite ni de gauche. Et en même temps, de droite et de gauche. 🇭🇽", fx: { patrons: 2, retraites: 2, jeunes: -2 }, rep: ["@Lea_Sciences_Po", "Donc de droite."] },
      { t: "Dans une gare, on croise des gens qui réussissent et des gens qui ne sont rien.", fx: { patrons: 3, ouvriers: -6, jeunes: -4, colere: 5 }, rep: ["@PatriceDu59", "Je suis dans la gare. Je ne suis rien. Le train non plus, il est annulé."] },
      { t: "Je veux que les jeunes aient envie de devenir milliardaires.", fx: { patrons: 3, jeunes: -2 }, rep: ["@MiloDu93", "ok j’ai envie. et maintenant ?"] } ],
    [ { t: "Force restera à la loi. #JeudiNoir", fx: { police: 5, jeunes: -5, colere: 3 }, rep: ["@CRS_Anonyme", "Merci Président. Et nos heures sup, elles restent où ?"] },
      { t: "La foule n’a pas de légitimité face au peuple qui s’exprime à travers ses élus.", fx: { retraites: 2, jeunes: -6, colere: 6, overton: 1 }, rep: ["@JosyMartelUTF", "La foule, c’est le peuple qui marche."] },
      { t: "Je vous ai compris. Enfin, je vous ai entendus. C’est presque pareil.", fx: { colere: -1, jeunes: -2 }, rep: ["@Mamie_Ginette", "Non mon petit, ce n’est pas pareil."] } ],
    [ { t: "Les Gaulois sont réfractaires au changement. Mais nous changerons quand même.", fx: { patrons: 3, ouvriers: -5, retraites: -3, colere: 4 }, rep: ["@PatriceDu59", "Le Gaulois réfractaire est en grève. Il a des raisons."] },
      { t: "Le meilleur moyen de se payer un costard, c’est de travailler.", fx: { patrons: 3, ouvriers: -5, colere: 4 }, rep: ["@MiloDu93", "le costard de Rabot c’était un cadeau, il a travaillé combien ?"] },
      { t: "Les grévistes prennent le pays en otage.", fx: { patrons: 5, retraites: 3, ouvriers: -6, colere: 4 }, rep: ["@JosyMartelUTF", "Le pays, c’est nous."] } ],
    [ { t: "Nous sommes en guerre. Contre la pluie. 🌧️", fx: { retraites: 2, jeunes: -2 }, rep: ["@Lea_Sciences_Po", "La pluie a gagné la première manche."] },
      { t: "Make our planet great again. 🌍", fx: { jeunes: 2, eco: 1 }, rep: ["@Lea_Sciences_Po", "Il a ressorti le slogan. Pas la loi climat."] },
      { t: "Le climat, on n’y peut rien. C’est la météo.", fx: { jeunes: -6, colere: 3, eco: 2 }, rep: ["@Lea_Sciences_Po", "Il confond climat et météo. Il est diplômé de 4 grandes écoles."] } ],
    [ { t: "Qu’ils viennent me chercher.", fx: { retraites: -2, jeunes: -4, colere: 6 }, rep: ["@MiloDu93", "on a l’adresse"] },
      { t: "La transparence est mon combat.", fx: { colere: -1 }, rep: ["@Lea_Sciences_Po", "Alors publiez les factures de McKinley."] },
      { t: "Il n’y a pas d’affaire. Il y a une polémique.", fx: { jeunes: -2, colere: 2 }, rep: ["@InfoChoc24", "🔴 « Pas d’affaire » : le Président face à l’affaire."] } ],
    [ { t: "J’ai très envie de les emmerder. Et donc on va continuer.", fx: { patrons: 3, retraites: 2, ouvriers: -6, colere: 6 }, rep: ["@JosyMartelUTF", "Nous aussi, on a très envie. On va continuer."] },
      { t: "Le Grand Débat est ouvert. Venez, je vous écoute. Je parle d’abord, quatre heures.", fx: { colere: -2, retraites: 2 }, rep: ["@Mamie_Ginette", "J’ai écrit dans le cahier. Le cahier est dans une benne ?"] },
      { t: "Une pensée complexe ne se résume pas en un tweet.", fx: { jeunes: -2 }, rep: ["@Lea_Sciences_Po", "Mais elle se résume en un 49.3."] } ],
    [ { t: "Je ne dissoudrai pas.", fx: { retraites: 1 }, rep: ["@Lea_Sciences_Po", "Capture faite. Pour plus tard."] },
      { t: "Réarmement civique, démographique, moral, industriel, européen.", fx: { retraites: 3, police: 2, jeunes: -4, overton: 2 }, rep: ["@MiloDu93", "il a réarmé quoi au juste ? le 49.3 ?"] },
      { t: "Moi ou le chaos.", fx: { retraites: 3, jeunes: -3 }, rep: ["@SteeveFrontiere", "Le chaos vous remercie pour la publicité."] } ],
    [ { t: "Dimanche, faites barrage. Encore. Une dernière fois. Promis.", fx: { jeunes: 2, retraites: 2 }, rep: ["@PatriceDu59", "C’était déjà la dernière fois, la dernière fois."] },
      { t: "Nous n’avons pas assez expliqué. Je vais expliquer encore.", fx: { colere: 2 }, rep: ["@Mamie_Ginette", "On a compris, mon petit. C’est justement le problème."] },
      { t: "Si je perds, je pars. Promis. 🤞", fx: { jeunes: 3, colere: -2 }, rep: ["@MiloDu93", "c’est la première promesse qui donne envie"] } ],
  ];

  // ================================================================ MODE NE PAS DÉRANGER
  const act = id => C.dndActs.find(a => a.id === id);
  act("d_rabot").variants = { ...(act("d_rabot").variants || {}), [P]: { t: "a terminé son deuxième roman. Une scène se passe à Bercy. Elle est osée. Le budget, lui, est inchangé.", fx: {} } };
})();
