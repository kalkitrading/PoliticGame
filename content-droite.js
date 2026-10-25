// Ne Pas Déranger — la partie vue depuis un gouvernement de droite classique (programme « Libérer les énergies »).
// Le jeu de base était déjà celui d'un pouvoir qui réforme contre la rue ; ici, il prend la voix de la droite :
// patrimoine, autorité, « assistanat », racines, et la grande tentation de l'union des droites.
// Clins d'œil au réel : les costumes et les emplois familiaux (2017), « Qui imagine le général de Gaulle mis en examen ? »,
// le Kärcher (2005), « le cancer de l'assistanat » (2011), « travailler plus pour gagner plus » (2007),
// la suppression de l'AME votée au Sénat (2023), le voile dans les compétitions sportives (Sénat, 2025),
// l'alliance avec l'extrême droite annoncée au JT et le siège du parti fermé à clé (2024), le référendum sur l'immigration.
// Chaque message garde une réponse fidèle, un compromis et une trahison (vers le social, ou vers le RH).

(() => {
  const C = window.CONTENT;
  const P = "liberal";
  const all = () => [...C.events, ...C.pool, ...(C.alerts || [])];
  const V = (id, v) => { const e = all().find(x => x.id === id); e.variants = { ...(e.variants || {}), [P]: v.c ? { ov: false, ...v } : v }; };

  // ---------------------------------------------------------------- LES SEMAINES
  C.weeksBy = C.weeksBy || {};
  C.weeksBy[P] = {
    1: { title: "Le Redressement", agenda: ["Lun — Premier Conseil des ministres : « l’État est en faillite »", "Jeu — Les syndicats appellent à la grève"] },
    5: { title: "L’Affaire des Costumes", agenda: ["Mar — L’Écho publie", "Jeu — Réunion du groupe parlementaire"] },
    6: { title: "L’Union des Droites", agenda: ["Lun — Grève générale ?", "Mer — Le président du parti passe au JT de 13 h"] },
    7: { title: "Le Kärcher", agenda: ["Mar — L’agence de notation rend son verdict", "Jeu — Débat télévisé"] },
  };

  // ================================================================ SEMAINE 1
  V("w1_intro", {
    m: ["Félicitations Président. 50,3 % des voix, 61 % d’abstention. Les éditorialistes parlent de « restauration ».",
        "Rappel : chaque réponse vide ta batterie 🔋. Quand elle meurt, tes ministres décident à ta place.",
        "Règle n° 1 : on n’accepte aucun cadeau. Ni montre, ni costume, ni caviar. Les réponses 🔓 peuvent fuiter."],
    c: [
      { t: "Compris.", cost: 2, r: "Parfait. J’ai rendu la montre que t’a offerte Vallon-Dividende. Il était vexé." },
      { t: "Un costume, ce n’est pas un cadeau. C’est une tenue de travail.", cost: 2, r: "…Je vais faire semblant de ne pas avoir lu. Un autre candidat avait dit ça. Il n’a pas été élu.",
        fx: { retraites: -1 }, set: { costumes: true } },
    ],
  });

  V("w1_kevin", {
    m: ["yo le Président 🔥 c Kévin (3,2M d’abonnés)",
        "jte propose un live : une journée avec une famille au RSA, pour montrer que tu les comprends. 50k€ le placement"],
    c: [
      { t: "Banco.", cost: 6, r: "t’as demandé où était le majordome. 4M de vues. pas pour les bonnes raisons",
        fx: { jeunes: -3, ouvriers: -4, retraites: 1 }, news: "Le Président passe une journée au RSA : « Ils ont beaucoup de temps libre, quand même »" },
      { t: "Plutôt un live à la chasse.", cost: 5, r: "frère t’as tiré sur un drone. c’était le nôtre. 5M de vues",
        fx: { retraites: 3, jeunes: -3 } },
      { t: "Non. Je suis le Président.", cost: 2, r: "ok monsieur le président des notaires 🙄", fx: { jeunes: -2 } },
    ],
  });

  // ================================================================ SEMAINE 5 : l'affaire des costumes
  V("w5_chloe", {
    m: ["Chloé Ferrand, L’Écho. Ton ministre Rabot a employé sa femme comme assistante parlementaire pendant quinze ans. 800 000 €. Personne ne l’a jamais vue travailler.",
        "Il a aussi reçu deux costumes à 13 000 € d’un « ami ». On publie demain. Un commentaire ?"],
    c: [
      { t: "Je n’étais pas au courant.", cost: 5, r: "On a un mail où il t’en parle. Tu as répondu « Belle étoffe 👍 ».",
        fx: { retraites: -6, jeunes: -4, colere: 6 }, image: { me: -2 },
        news: "AFFAIRE DES COSTUMES : le Président « pas au courant », un mail dit le contraire" },
      { t: "Rabot est viré immédiatement.", cost: 6, r: "Rapide. Il dit que sa femme « relisait ses discours ». Ils faisaient trois lignes.",
        fx: { colere: -6, jeunes: 4, patrons: -3 }, set: { rabotVire: true }, image: { me: 1 },
        news: "Affaire des costumes : Rabot démissionne « pour se consacrer à sa famille » (qu’il payait déjà)" },
      { t: "« Qui imagine le général de Gaulle mis en examen ? »", cost: 4, r: "Personne. C’est justement le problème : ce n’est pas de Gaulle qui est mis en examen.",
        fx: { retraites: -4, jeunes: -4, colere: 4 }, image: { me: -3 },
        news: "« Qui imagine le général de Gaulle mis en examen ? » : le Président défend Rabot" },
      { t: "Combien pour ne pas publier ?", cost: 4, r: "Merci. Je viens d’ajouter un paragraphe.",
        leak: { p: 0.95, soon: true, fx: { jeunes: -8, ouvriers: -8, retraites: -8, patrons: -5, colere: 15 }, news: "EXCLUSIF : le Président tente d’acheter le silence de L’Écho" } },
    ],
    d: { r: "Pas de commentaire. J’écris : « L’Élysée n’a pas souhaité répondre ». Mes lecteurs adorent.", fx: { retraites: -4, jeunes: -4, colere: 5 } },
  });

  // ================================================================ SEMAINE 6 : le référendum
  V("w6_clemence", {
    m: ["Idée : un référendum sur l’immigration. Des quotas votés par le peuple. C’est dans le programme de notre famille politique depuis des années.",
        "Le RH dira qu’on le copie. Le centre dira qu’on joue avec le feu. Les deux auront raison."],
    c: [
      { t: "Lançons-le.", cost: 6, r: "Le RH applaudit. « Enfin. » C’est rarement bon signe quand il applaudit.",
        fx: { retraites: 4, police: 3, jeunes: -6, colere: 4, overton: 6 }, rel: { RH: 8, CA: -6, HI: -8, VP: -6 }, set: { referendumImmig: true },
        news: "Le Président annonce un référendum sur les quotas d’immigration" },
      { t: "Un Grand Débat plutôt : des cahiers, et on ne lit rien.", cost: 5, r: "Je commande 40 000 cahiers. Et une benne.",
        fx: { colere: -8 }, set: { grandDebat: true }, news: "Grand Débat National : « Le Président veut vous écouter »" },
      { t: "Non. On ne joue pas avec ça.", cost: 3, r: "Le RH dira que tu es « l’otage du politiquement correct ». Tu dormiras mieux.",
        fx: { retraites: -2, jeunes: 2, overton: -2 }, rel: { RH: -4 } },
    ],
  });

  // ================================================================ SEMAINE 7
  V("w7_eco_high", {
    m: ["Bonne nouvelle : on a un petit surplus. Une semaine avant l’élection.", "On en fait quoi ? Je précise : la réponse « une dépense publique » n’est pas acceptée."],
    c: [
      { t: "Défiscaliser les heures sup. Travailler plus pour gagner plus.", cost: 6, r: "Le slogan a vingt ans. Il marche toujours. Les heures sup aussi.",
        fx: { budget: -8, ouvriers: 6, patrons: 4, retraites: 2 }, news: "Heures supplémentaires défiscalisées : « La France qui se lève tôt » récompensée" },
      { t: "Baisser les impôts de production.", cost: 6, r: "Les entreprises vous remercient. Elles ne votent pas, mais elles financent.",
        fx: { budget: -10, patrons: 12, ouvriers: -4 } },
      { t: "Prime de 300 € pour tous.", cost: 6, r: "Un chèque une semaine avant l’élection. Vous faites comme la gauche. En plus discret.",
        fx: { budget: -12, ouvriers: 8, jeunes: 6, retraites: 6, colere: -8, overton: -1 } },
    ],
  });

  V("w7_debat", {
    m: ["Débat télé jeudi, le dernier avant l’élection. Le RH va dire que tu es « mou ». Le centre, que tu es « dur ».", "Ta stratégie ?"],
    c: [
      { t: "Le Kärcher, enfin.", cost: 6, r: "Les retraités vont adorer. Le RH va crier au plagiat. Il n’a pas tort.",
        fx: { police: 8, retraites: 6, jeunes: -10, overton: 5 } },
      { t: "La France qui se lève tôt. Le travail, le mérite.", cost: 6, r: "Le classique. Ça marche toujours sur ceux qui se lèvent tôt pour regarder les débats.",
        fx: { retraites: 4, ouvriers: 3, patrons: 2 } },
      { t: "Jamais d’alliance avec le RH. Jamais.", cost: 6, r: "Une ligne claire. Ça repose, les lignes claires.",
        fx: { jeunes: 3, retraites: -2, overton: -2 }, rel: { RH: -6, CA: 4 } },
    ],
  });

  // ================================================================ ÉVÉNEMENTS ALÉATOIRES
  V("p_culture", {
    m: ["Président, je passe sur un plateau télé ce soir.", "Je peux dire que le RSA est « le cancer de l’assistanat » ? Un ancien ministre l’a dit, ça l’a fait connaître."],
    c: [
      { t: "Surtout pas !", cost: 3, r: "Dommage. Je dirai « une maladie chronique ». C’est plus médical." },
      { t: "Vas-y, ça va buzzer.", cost: 3, r: "Ça a buzzé. Les associations ont porté plainte. Ton électorat a partagé.",
        fx: { ouvriers: -6, jeunes: -4, retraites: 3, colere: 5, overton: 2 }, news: "La ministre de la Culture : le RSA est « le cancer de l’assistanat »" },
    ],
    d: { r: "Pas de réponse, donc j’y vais. Je l’ai dit. Oups.", fx: { ouvriers: -5, colere: 4, overton: 2 } },
  });

  // ================================================================ NOUVEAUX ÉVÉNEMENTS PROPRES À LA DROITE
  C.events.push(
    // l'aide médicale d'État, que le Sénat de droite avait supprimée
    { id: "r_ame", w: 2, at: 0.86, from: "heritage", when: S => S.programme === P, ov: false,
      m: ["Président, Bertrand Héritage, président de ton groupe. Le Sénat avait déjà voté la suppression de l’aide médicale d’État. On la remplace par une « aide médicale d’urgence » ?",
          "Les médecins disent que c’est une bombe sanitaire. Nos électeurs disent que c’est une bonne idée. Nos électeurs ne sont pas médecins."],
      c: [
        { t: "Suppression. Urgences seulement.", cost: 5, r: "Votée. Les urgences vont voir arriver des diabétiques au dernier stade. C’est plus cher, mais c’est plus tard.",
          fx: { budget: 2, retraites: 3, jeunes: -5, overton: 3 }, rel: { RH: 6, HI: -6, VP: -4 }, set: { ameSupprimee: true },
          news: "L’aide médicale d’État supprimée : « Les urgences, et c’est tout »" },
        { t: "On la restreint, sans la supprimer.", cost: 4, r: "Un panier de soins plus petit. Personne n’est content. C’est souvent le signe d’un compromis.",
          fx: { retraites: 1, overton: 1 } },
        { t: "Non. La santé publique d’abord.", cost: 4, r: "Les médecins te remercient. Héritage te fait la tête. Steeve Frontière te traite de « laxiste ».",
          fx: { retraites: -2, jeunes: 2, overton: -2 }, rel: { RH: -4 } },
      ],
      d: { r: "Pas de réponse. Le Sénat s’en chargera. Il s’en charge toujours." } },

    // le RSA sous conditions
    { id: "r_rsa", w: 3, at: 0.86, from: "rabot", when: S => S.programme === P, ov: false,
      m: ["Président, Rabot. Je propose de conditionner le RSA à 15 heures d’activité par semaine.",
          "Ceux qui ne peuvent pas travailler devront prouver qu’ils ne peuvent pas. Par formulaire. De 34 pages."],
      c: [
        { t: "Validé. Avec un vrai accompagnement.", cost: 6, r: "L’accompagnement coûte plus cher que les économies. Mais ça se dit bien.",
          fx: { budget: -2, retraites: 3, ouvriers: -2, overton: 1 } },
        { t: "Validé. Et on radie ceux qui ne pointent pas.", cost: 5, r: "200 000 radiés en un mois. Ils ne sont pas retournés au travail. Ils sont sortis des statistiques.",
          fx: { budget: 5, retraites: 4, ouvriers: -6, jeunes: -4, colere: 4, overton: 3 },
          news: "RSA : 200 000 radiations en un mois, « un succès » selon Bercy" },
        { t: "Non. On augmente plutôt le SMIC pour que le travail paie.", cost: 5, r: "Le SMIC ? Vous êtes sûr d’être de droite ?",
          fx: { budget: -6, ouvriers: 6, patrons: -6, overton: -2 } },
      ],
      d: { r: "Pas de réponse. J’ai lancé une « expérimentation ». Dans 47 départements." , fx: { ouvriers: -2 } } },

    // les signes religieux dans le sport
    { id: "r_voile", w: 4, at: 0.88, from: "heritage", when: S => S.programme === P, ov: false,
      m: ["Président, le Sénat a voté l’interdiction du voile dans toutes les compétitions sportives. Même chez les amateurs. Même au badminton du dimanche.",
          "On l’inscrit à l’Assemblée ? La moitié de la droite applaudit, l’autre moitié se demande comment on contrôle le badminton."],
      c: [
        { t: "Oui. La laïcité partout.", cost: 5, r: "Votée. Trois clubs de quartier ont fermé leur équipe féminine. Les autres ont fermé tout court.",
          fx: { retraites: 3, jeunes: -6, overton: 3 }, rel: { RH: 5, HI: -6, VP: -4 },
          news: "Signes religieux interdits dans toutes les compétitions sportives, amateurs compris" },
        { t: "On laisse les fédérations décider.", cost: 4, r: "Les fédérations. Elles s’occupent déjà des arbitres, elles adoreront s’occuper des foulards.",
          fx: { overton: 1 } },
        { t: "Non. La laïcité protège, elle ne traque pas.", cost: 4, r: "Une phrase de juriste. Les juristes ne votent pas pour toi, mais ils sont d’accord.",
          fx: { retraites: -3, jeunes: 3, overton: -2 }, rel: { RH: -4 } },
      ] },

    // la présomption de légitime défense
    { id: "r_legitime", w: 5, at: 0.7, from: "policesyn", when: S => S.programme === P, ov: false,
      m: ["Président, Syndicat Police Unie. On veut la présomption de légitime défense pour les policiers. Votre famille politique l’a proposée dix fois.",
          "Concrètement : quand on tire, c’est présumé normal. Ce sera à la famille de prouver le contraire."],
      c: [
        { t: "Accordé.", cost: 5, r: "Merci. Les collègues se sentent soutenus. Ils vont le montrer.",
          fx: { police: 12, retraites: 3, jeunes: -10, colere: 6, overton: 5 }, rel: { RH: 6, HI: -8 }, set: { presomption: true },
          news: "Présomption de légitime défense pour les policiers : « un permis de tuer », dénoncent les avocats" },
        { t: "Une meilleure protection juridique, pas une présomption.", cost: 5, r: "Une protection. On prendra. On reviendra demander le reste.",
          fx: { police: 4, overton: 1 } },
        { t: "Non. La loi est la même pour tous.", cost: 4, r: "Même pour nous ? On note. On note tout.",
          fx: { police: -8, jeunes: 4, overton: -2 } },
      ],
      d: { r: "Pas de réponse. On manifestera devant le ministère. En uniforme, avec les gyrophares.", fx: { police: -5 } } },

    // l'union des droites, annoncée au JT de 13 h
    { id: "r_union", w: 6, at: 0.5, from: "frontiere", when: S => S.programme === P, ov: false,
      m: S => S.flags.pacteRH
        ? ["Président, Steeve Frontière. Notre petit pacte tient toujours. Passons à l’étape suivante.",
           "Candidatures communes aux législatives, et un ministère pour moi. L’Intérieur, j’ai déjà les rideaux."]
        : ["Président, Steeve Frontière. Le président de ton propre parti vient d’annoncer au JT de 13 h une alliance avec nous.",
           "Tes cadres l’ont exclu. Il s’est enfermé dans le siège du parti, il a les clés. Alors, cette union des droites, on la fait ?"],
      c: [
        { t: "L’union des droites. Allons-y.", cost: 6, r: "Historique. Le barrage vient de céder. Tu viens de rendre le RH respectable. Les électeurs préfèrent souvent l’original à la copie.",
          fx: { police: 4, jeunes: -10, colere: 6, overton: 8 }, rel: { RH: 20, CA: -15, HI: -10, VP: -10, PP: -8 }, image: { RH: 9 }, set: { pacteRH: true, unionDroites: true },
          news: "Le Président annonce l’« union des droites » avec le RH : le centre quitte la majorité" },
        { t: "Pas d’alliance nationale. Juste des désistements locaux.", cost: 5, r: "Une alliance qui ne dit pas son nom. On connaît, on a inventé le concept.",
          fx: { retraites: 1, jeunes: -3, overton: 4 }, rel: { RH: 8, CA: -6 }, image: { RH: 4 }, set: { pacteRH: true },
          leak: { p: 0.5, fx: { jeunes: -6, colere: 5 }, rel: { CA: -6 }, news: "FUITE : l’Élysée a négocié des désistements avec le RH dans 61 circonscriptions" } },
        { t: "Jamais. Front républicain.", cost: 4, r: "Dommage. Ton président de parti, lui, est toujours enfermé dans le siège. Avec nous.",
          fx: { jeunes: 3, retraites: -2, overton: -3 }, rel: { RH: -15, CA: 6 }, set: { pacteRH: false },
          news: "« Jamais d’alliance avec le RH » : le Président exclut l’union des droites" },
      ],
      d: { r: "Pas de réponse. Les médias disent « le Président hésite ». Nos électeurs disent « le Président est des nôtres ».", fx: { overton: 3 } } },
  );

  // ================================================================ LE FIL, VU DE DROITE
  C.ambientBy = C.ambientBy || {};
  C.ambientBy[P] = {
    calm: [
      ["@EntrepreneurDuDim", "Enfin un gouvernement qui comprend l’entreprise 💼 Et l’héritage. Surtout l’héritage."],
      ["@Mamie_Ginette", "Le Président a dit que la France qui se lève tôt serait récompensée. Je me lève à 5 h, j’ai 84 ans, j’attends."],
      ["@Famille_Valeurs", "Un Président qui va à la messe de minuit. On n’avait pas vu ça depuis longtemps. 🙏"],
      ["@Lea_Sciences_Po", "Thread 🧵 : non, l’État n’est pas « en faillite », voici la dette d’un pays en faillite (1/52)"],
      ["@MiloDu93", "contrôlé 3 fois cette semaine. le nouveau gouvernement a l’air efficace"],
      ["@Chasseur_Libre", "Le Président a promis de ne jamais toucher au dimanche de chasse. On l’aime."],
    ],
    tense: [
      ["@PatriceDu59", "Ils parlent d’« assistanat ». Moi j’ai 37 ans de boîte, je suis assisté par mon kiné."],
      ["@JosyMartelUTF", "Le gouvernement découvre la « valeur travail ». On a des nouvelles : on travaille déjà. #JeudiNoir"],
      ["@CRS_Anonyme", "On nous promet la présomption de légitime défense. Nous, on voudrait d’abord des gilets pare-balles à la bonne taille."],
      ["@SteeveFrontiere", "Le gouvernement copie notre programme. Préférez l’original à la copie. #Frontière2027"],
      ["@InfoChoc24", "🔴 « L’État est en faillite », dit le gouvernement qui vient de supprimer les droits de succession."],
      ["@MiloDu93", "ils veulent du travail pour le RSA. moi je veux du travail tout court, ça marche aussi ?"],
      ["@EntrepreneurDuDim", "Les grévistes devraient créer leur boîte. Moi je l’ai fait avec 2 M€ de papa. Exonérés, maintenant."],
    ],
    angry: [
      ["@MiloDu93", "on arrive. #ÉlyséeOuverte"],
      ["@PatriceDu59", "La France qui se lève tôt est dans la rue. Elle s’est levée tôt pour ça."],
      ["@Lea_Sciences_Po", "Ce gouvernement a perdu toute légitimité. Il lui reste ses costumes. #Démission"],
      ["@Mamie_Ginette", "J’ai voté à droite toute ma vie. J’ai acheté un casque de moto pour aller manifester. Ma première fois à 84 ans."],
      ["@InfoChoc24", "🔴 ALERTE : barricades dans 40 villes. Le Président promet le « Kärcher ». Les Kärcher sont en rupture de stock."],
      ["@SteeveFrontiere", "La droite a échoué. Il ne reste plus que nous. #Frontière2027"],
      ["@Anonymous_Hex", "Nous publierons bientôt les SMS du gouvernement. Et les factures des costumes. 👁️"],
    ],
  };

  // ================================================================ TES PUBLICATIONS
  C.postsBy = C.postsBy || {};
  C.postsBy[P] = [
    null,
    [ { t: "L’État est en faillite. Nous allons le redresser. 🇭🇽", fx: { patrons: 4, retraites: 2, ouvriers: -3 }, rep: ["@Lea_Sciences_Po", "Un État en faillite qui supprime les droits de succession. Audacieux."] },
      { t: "Travailler plus pour gagner plus. Le retour.", fx: { ouvriers: 2, patrons: 3, jeunes: -2 }, rep: ["@PatriceDu59", "Je travaille déjà plus. J’attends le « gagner plus »."] },
      { t: "Ce soir, messe de minuit. Pour la France.", fx: { retraites: 3, jeunes: -3 }, rep: ["@MiloDu93", "on est en octobre frère"] } ],
    [ { t: "Force restera à la loi. #JeudiNoir", fx: { police: 5, jeunes: -5, colere: 3 }, rep: ["@CRS_Anonyme", "Merci Président. Et nos heures sup, elles restent où ?"] },
      { t: "La rue ne gouverne pas.", fx: { retraites: 3, patrons: 2, jeunes: -4, colere: 4 }, rep: ["@JosyMartelUTF", "La rue, elle vote, par contre."] },
      { t: "Je respecte les syndicats. Ceux qui négocient.", fx: { colere: -2, ouvriers: 1 }, rep: ["@JosyMartelUTF", "On négocie. Vous refusez. C’est ça le problème."] } ],
    [ { t: "Les grévistes prennent le pays en otage.", fx: { patrons: 5, retraites: 3, ouvriers: -6, colere: 4 }, rep: ["@JosyMartelUTF", "Le pays, c’est nous."] },
      { t: "Je ne laisserai pas une minorité bloquer la France qui travaille.", fx: { retraites: 4, ouvriers: -4, colere: 3 }, rep: ["@PatriceDu59", "La France qui travaille, elle est sur le piquet de grève."] },
      { t: "Assistanat : ceux qui touchent devront donner.", fx: { retraites: 3, ouvriers: -5, overton: 2 }, rep: ["@MiloDu93", "et les héritiers ils donnent quoi"] } ],
    [ { t: "Pensées pour les sinistrés. L’État sera là. Les assureurs aussi, j’y veillerai.", fx: { retraites: 3 }, rep: ["@Mamie_Ginette", "Les assureurs ont dit non. Vous y veillerez quand ?"] },
      { t: "Nous rebâtirons. Plus beau. Plus haut. Plus cher.", fx: { patrons: 3, retraites: -2 }, rep: ["@EntrepreneurDuDim", "Plus cher 😍"] },
      { t: "L’écologie punitive n’empêche pas les inondations.", fx: { retraites: 2, jeunes: -5, overton: 1 }, rep: ["@Lea_Sciences_Po", "Ne rien faire non plus, visiblement."] } ],
    [ { t: "Présomption d’innocence. Pour Rabot. Et pour moi.", fx: { colere: 3, retraites: -2 }, rep: ["@InfoChoc24", "🔴 « Et pour moi » : le Président se sent-il visé ?"] },
      { t: "Un acharnement médiatique sans précédent.", fx: { retraites: 2, jeunes: -3 }, rep: ["@Lea_Sciences_Po", "Il y a eu un précédent. Il avait dit exactement ça."] },
      { t: "Les costumes, je les ai rendus.", fx: { jeunes: -2, colere: 2 }, rep: ["@MiloDu93", "frère personne t’avait demandé pour toi"] } ],
    [ { t: "L’autorité de l’État ne se négocie pas.", fx: { police: 4, retraites: 3, jeunes: -4 }, rep: ["@Lea_Sciences_Po", "Elle se négocie avec qui, alors ?"] },
      { t: "La droite, c’est nous. Pas eux.", fx: { retraites: 2, overton: -1 }, rep: ["@SteeveFrontiere", "Les électeurs choisiront. Ils ont déjà choisi, en fait."] },
      { t: "L’union des droites, c’est l’union du bon sens.", fx: { retraites: 3, jeunes: -6, overton: 4 }, rep: ["@SteeveFrontiere", "Bienvenue à la maison."] } ],
    [ { t: "Le Kärcher, c’était une promesse. La voici.", fx: { police: 5, retraites: 3, jeunes: -6, overton: 3 }, rep: ["@Lea_Sciences_Po", "Le Kärcher avait été promis il y a vingt ans. Toujours pas livré."] },
      { t: "La sécurité est la première des libertés.", fx: { police: 5, jeunes: -5 }, rep: ["@Lea_Sciences_Po", "La prison aussi est très sécurisée."] },
      { t: "Le mérite, le travail, la famille.", fx: { retraites: 4, jeunes: -3 }, rep: ["@MiloDu93", "il manque « patrie » non ? ah non, c’est l’autre"] } ],
    [ { t: "Dimanche, choisissez l’ordre et le travail.", fx: { retraites: 3, jeunes: -2 }, rep: ["@PatriceDu59", "Le travail, j’en ai. L’ordre aussi, à l’usine."] },
      { t: "Ni le chaos, ni les extrêmes. La droite qui gouverne.", fx: { retraites: 2, overton: -1 }, rep: ["@SteeveFrontiere", "La droite qui gouverne avec nos idées. Merci pour la promo."] },
      { t: "Un vote pour moi, c’est un héritage préservé.", fx: { patrons: 3, ouvriers: -3 }, rep: ["@MiloDu93", "moi j’hérite de la dette du pays, elle est préservée aussi ?"] } ],
  ];
})();
