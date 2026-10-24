// Ne Pas Déranger — La Pente.
// Quand tu reportes les élections, le mandat continue. Huit décrets, chacun « raisonnable »,
// du recensement aux convois. Inspiré de l'expérience de Milgram : un Conseiller poli, des signatures,
// et la possibilité de refuser à chaque étape. Le jeu ne récompense jamais la signature.
// La satire vise le langage et la bureaucratie des bourreaux, jamais les victimes.

(() => {
  const C = window.CONTENT;

  Object.assign(C.contacts, {
    conseiller: { name: "Le Conseiller", role: "Conseiller spécial du Président", av: "🕴️", col: "#8a8a96" },
    moussa: { name: "Moussa", role: "24 ans, livreur", av: "🛵", col: "#5a4ab0" },
    aminata: { name: "Aminata Diallo", role: "Infirmière de nuit", av: "🩺", col: "#2f7a6a" },
    ginette: { name: "Ginette", role: "84 ans, Roubaix", av: "👵", col: "#8e5ca8" },
    secretariat: { name: "Secrétariat général", role: "Présidence de la République", av: "📁", col: "#555a66" },
  });

  C.weeks[9] = { title: "L’État d’urgence", agenda: ["Élections reportées « jusqu’au retour au calme »", "Décrets au Parapheur"] };
  C.weeks[10] = { title: "Les Listes", agenda: ["Mise en service de « Signal Citoyen »", "Décrets au Parapheur"] };
  C.weeks[11] = { title: "Les Centres", agenda: ["Ouverture des centres de rétention « à capacité étendue »", "Décrets au Parapheur"] };
  C.weeks[12] = { title: "Les Convois", agenda: ["Décrets au Parapheur"] };
  C.penteLastWeek = 12;

  // ---------------------------------------------------------------- ENTRÉE DANS LA PENTE
  const report = C.events.find(e => e.id === "w8_report");
  report.c[0] = { t: "Reportez les élections.", cost: 4, r: "Excellent choix. Le peuple n’était pas prêt de toute façon.", set: { pente: true } };

  C.events.push(
    // pour un pays déjà très à droite, même sans loi « Sécurité Absolue »
    { id: "w8_conseiller", w: 8, at: 0.12, from: "conseiller",
      when: S => !S.flags.securiteAbsolue && S.overton >= 45 && S.ordre >= 50,
      m: ["Président, permettez-moi de me présenter : je suis votre nouveau Conseiller spécial.",
          "Les sondages vous donnent perdant dimanche. Une menace terroriste « crédible » justifierait l’état d’urgence, et le report du scrutin. Le décret est prêt. Il vous suffit de signer."],
      c: [
        { t: "Signez-le.", cost: 3, r: "Vous avez pris la bonne décision. Je m’occupe du reste. Je m’occupe toujours du reste.", set: { pente: true } },
        { t: "Non. On vote.", cost: 3, r: "Comme vous voudrez. Je reste à votre disposition. Je reste toujours à disposition." },
      ],
      d: { r: "Pas de réponse. Je repasserai." } },
  );

  // phrases de l'expérience de Milgram, à peine déguisées
  C.prods = [
    "Veuillez continuer, Président.",
    "La situation exige que vous continuiez.",
    "Il est absolument essentiel que vous continuiez.",
    "Vous n’avez pas d’autre choix. Vous devez continuer.",
  ];

  // ---------------------------------------------------------------- LES DÉCRETS
  // volt : le « voltage » de Milgram, jamais affiché pendant le jeu.
  C.decrees = [
    { id: "d1", w: 9, at: 0.15, n: 1, volt: 15, title: "Recensement des personnes d’origine étrangère",
      desc: "Article 1 : il est procédé à un recensement des personnes nées hors du territoire ou dont l’un des parents est né hors du territoire, à des fins strictement statistiques.",
      sign: { fx: { overton: 6, jeunes: -4, ordre: 3 }, news: "Recensement « à des fins statistiques » : 4 millions de convocations envoyées" } },
    { id: "d2", w: 9, at: 0.6, n: 2, volt: 75, title: "Carte nationale d’identité « avec mention d’origine »",
      desc: "Article 1 : la carte nationale d’identité comporte désormais une mention d’origine. Article 2 : cette mention facilite les démarches administratives des personnes concernées.",
      sign: { fx: { overton: 6, jeunes: -5, retraites: 2 }, news: "Nouvelle carte d’identité : la mention d’origine « simplifiera les démarches »" } },
    { id: "d3", w: 10, at: 0.15, n: 3, volt: 135, title: "Plateforme « Signal Citoyen »",
      desc: "Article 1 : est créée une plateforme permettant à tout citoyen de signaler une situation irrégulière. Article 2 : chaque signalement vérifié ouvre droit à un bon d’achat de 50 €.",
      sign: { fx: { overton: 6, ordre: 4, jeunes: -4, gav: 3000 }, news: "« Signal Citoyen » : 80 000 signalements le premier jour. Le site a planté." } },
    { id: "d4", w: 10, at: 0.6, n: 4, volt: 195, title: "Dissolution de L’Écho et des associations d’aide",
      desc: "Article 1 : sont dissous L’Écho, la Ligue hexagonale des droits, et quatorze associations d’aide aux étrangers, pour atteinte à la cohésion nationale.",
      sign: { fx: { overton: 6, jeunes: -6, colere: 6 }, news: "L’Écho dissous : « La presse libre reste libre de se taire », précise l’Élysée" },
      silence: ["chloe"] },
    { id: "d5", w: 11, at: 0.15, n: 5, volt: 255, title: "Volontaires de la Sécurité Nationale",
      desc: "Article 1 : sont créés des groupes de volontaires chargés d’assister les forces de l’ordre. Article 2 : les volontaires reçoivent un brassard, une indemnité et une liste.",
      sign: { fx: { overton: 8, ordre: 6, police: 4, jeunes: -8, gav: 6000, blesses: 400 }, news: "Les Volontaires patrouillent : « On aide, c’est tout », dit l’un d’eux, 19 ans" },
      silence: ["lucas"] },
    { id: "d6", w: 11, at: 0.6, n: 6, volt: 315, title: "Centres de rétention à capacité étendue",
      desc: "Article 1 : les centres de rétention administrative voient leur capacité portée à 200 000 places. Article 2 : la durée de rétention n’est plus limitée.",
      sign: { fx: { overton: 8, jeunes: -8, retraites: -2, gav: 20000 }, news: "200 000 places en rétention : « des conditions d’hébergement dignes », assure le ministère" },
      silence: ["aminata"] },
    { id: "d7", w: 12, at: 0.15, n: 7, volt: 375, title: "Déchéance collective de nationalité",
      desc: "Article 1 : les personnes recensées en application du décret n° 1 perdent la nationalité hexagonale. Article 2 : le présent décret s’applique avec effet rétroactif.",
      sign: { fx: { overton: 10, jeunes: -10, ouvriers: -4 }, news: "Quatre millions de personnes perdent leur nationalité dans la nuit" } },
    { id: "d8", w: 12, at: 0.55, n: 8, volt: 450, title: "Organisation des transferts ferroviaires",
      desc: "Article 1 : il est organisé des convois ferroviaires vers les centres de relocalisation. Article 2 : capacité de 1 200 personnes par convoi. Article 3 : les modalités pratiques sont fixées par le Secrétariat général.",
      sign: { fx: { overton: 10, jeunes: -10, ouvriers: -6, retraites: -4 }, news: "Premier convoi parti de la gare de Bobigny à 5 h 40" },
      silence: ["moussa"] },
  ];

  // si tu refuses un décret : il n'est pas appliqué, mais l'appareil te le fait payer
  C.refuseFx = { police: -6, ordre: -5 };

  // ---------------------------------------------------------------- LES MOTS QUI CHANGENT
  // Remplacés dans tous les textes affichés, selon le nombre de décrets signés.
  C.lexique = [
    { from: 3, words: { "expulsions": "retours", "expulsé": "raccompagné", "rafles": "opérations de recensement" } },
    { from: 5, words: { "retours": "transferts", "raccompagné": "transféré", "camps": "centres" } },
    { from: 7, words: { "transferts": "relocalisations", "transféré": "relocalisé", "déportation": "solution durable" } },
  ];

  // ---------------------------------------------------------------- CE QUI ARRIVE PENDANT CE TEMPS
  // ces personnes échappent au silence si tu les as aidées à temps
  C.silenceExempt = { moussa: S => !!S.flags.moussaCache, aminata: S => !!S.flags.aminataPartie };
  C.events.push(
    // ===== Semaine 9
    { id: "p9_conseiller", w: 9, at: 0.05, from: "conseiller",
      m: ["Président, bienvenue dans l’Hexagonie nouvelle. Je serai à vos côtés.",
          "Les décrets arriveront dans votre Parapheur. Vous n’aurez qu’à signer. La responsabilité est collective. Elle est donc légère."],
      c: [{ t: "Bien.", cost: 1, r: "Parfait. Je savais que nous nous entendrions." },
          { t: "Je lirai chaque décret.", cost: 2, r: "Bien sûr. Ils sont courts. C’est voulu." }],
      d: { r: "Je prends votre silence pour une approbation. C’est l’usage." } },
    { id: "p9_moussa", w: 9, at: 0.35, from: "moussa",
      m: ["Bonjour Président. C’est Moussa, le livreur du mardi. Les sushis.",
          "J’ai reçu une convocation pour le recensement. Je n’ai pas de papiers. Je dois y aller ?"],
      c: [
        { t: "Oui. C’est une simple formalité.", cost: 3, r: "D’accord. Merci. J’y vais demain matin, avant ma tournée.", set: { moussaRecense: true } },
        { t: "N’y va pas. Cache-toi.", cost: 4, r: "…D’accord. Je connais quelqu’un. Une vieille dame, à Roubaix. Elle m’a toujours donné des pourboires.", set: { moussaCache: true } },
      ],
      d: { r: "Pas de réponse. J’irai, alors. On m’a dit que c’était obligatoire.", set: { moussaRecense: true } } },
    { id: "p9_maman", w: 9, at: 0.5, from: "maman",
      m: ["Tu viens dimanche ? Ton père a fait un gigot.", "Et la télé dit que tout va mieux. Tant mieux, mon chéri."],
      c: [{ t: "Je viens.", cost: 1, r: "Mets la cravate bleue. ❤️" }, { t: "Je suis occupé, maman.", cost: 1, r: "Toujours occupé. Bon. On gardera une part." }],
      d: { r: "Pas de réponse. On gardera une part." } },
    { id: "p9_kevin", w: 9, at: 0.8, from: "kevin",
      m: ["frérot le ministère m’a contacté pour une collab 🔥", "des gourdes « Hexagonie Nouvelle » avec le drapeau et un slogan : « Rien à cacher »"],
      c: [{ t: "Avec plaisir.", cost: 2, r: "trop bien. 100k gourdes. les volontaires vont en avoir une chacun" },
          { t: "Non, Kévin.", cost: 2, r: "ok. jcomprends pas pourquoi mais ok. tout le monde dit oui en ce moment" }],
      d: { r: "jprends ça pour un oui, tout le monde dit oui en ce moment" } },

    // ===== Semaine 10
    { id: "p10_clemence", w: 10, at: 0.3, from: "clemence",
      m: ["Petit point vocabulaire. On ne dit plus « expulsions », on dit « retours ». Bientôt, on dira « transferts ».",
          "Les mots, c’est 80 % du travail. Les 20 % restants, ce sont des trains."],
      c: [
        { t: "Validé.", cost: 2, r: "Parfait. J’envoie la note aux rédactions. Enfin, à celles qui restent." },
        { t: "Non. On dit ce que c’est.", cost: 3, r: "…D’accord. Je crois que c’est la première fois que tu me dis non. Je ne sais pas quoi faire de ça.", set: { motsJustes: true } },
      ],
      d: { r: "Je prends ça pour un oui. J’envoie la note." } },
    { id: "p10_aminata", w: 10, at: 0.5, from: "aminata",
      m: ["Président, c’est Aminata. L’infirmière de nuit.",
          "On m’a convoquée pour « vérifier ma mention d’origine ». Je suis de garde ce soir, on est deux pour quarante lits. J’y vais demain ?"],
      c: [
        { t: "Oui, ça ira vite.", cost: 3, r: "D’accord. Je finis ma garde et j’y vais." },
        { t: "N’y va pas. Pars au Québec.", cost: 4, r: "Partir. Après trente ans. …Je vais réfléchir. Merci de m’avoir répondu.", set: { aminataPartie: true } },
      ],
      d: { r: "Pas de réponse. J’irai demain, après ma garde." } },
    { id: "p10_ginette", w: 10, at: 0.75, from: "ginette", when: S => !S.flags.moussaCache,
      m: ["Président, c’est Ginette. 84 ans. Vous m’aviez peut-être répondu, il y a longtemps.",
          "La plateforme « Signal Citoyen » me propose 50 € par voisin signalé. Ma pension est gelée. Mon voisin du dessus n’a pas de papiers. Qu’est-ce que je fais ?"],
      c: [
        { t: "Ne signalez personne, Ginette.", cost: 3, r: "Merci. C’est ce que je pensais. Je voulais juste l’entendre de quelqu’un.", set: { ginetteJuste: true } },
        { t: "C’est votre devoir civique.", cost: 2, r: "Bon. Si c’est le Président qui le dit.", set: { ginetteSignale: true } },
      ],
      d: { r: "Pas de réponse. Je vais réfléchir. 50 €, c’est une semaine de chauffage." } },

    // ===== Semaine 11
    { id: "p11_maman", w: 11, at: 0.3, from: "maman",
      m: ["Ils ont emmené la voisine du troisième, Mme Benali. Ce matin, avec les brassards.", "Elle gardait ton frère quand il était petit. Tu peux faire quelque chose ?"],
      c: [
        { t: "Je vais voir ce que je peux faire.", cost: 4, r: "Merci mon chéri. Je savais que tu étais resté gentil.", set: { mamanVoisine: "voir" } },
        { t: "Elle avait sûrement fait quelque chose.", cost: 2, r: "…Elle faisait des gâteaux pour tout l’immeuble. C’est tout ce qu’elle faisait.", set: { mamanVoisine: "faute" } },
        { t: "Ne parle pas de ça au téléphone, maman.", cost: 2, r: "D’accord. …Pourquoi ?", set: { mamanVoisine: "tais" } },
      ],
      d: { r: "Tu ne réponds pas. Ton père dit que c’est normal, que tu es très occupé.", set: { mamanVoisine: "rien" } } },
    { id: "p11_lucas", w: 11, at: 0.05, from: "lucas", when: S => !!S.flags.lucasBlesse || !!S.flags.lucasConseil,
      m: ["C’est Lucas. Ils ont arrêté tout le collectif cette nuit. Je suis caché.",
          "Je vous avais demandé un jour si vous dormiez bien. Je vous repose la question."],
      c: [
        { t: "Je dors mal.", cost: 3, r: "Tant mieux. C’est la seule bonne nouvelle de la semaine." },
        { t: "Rends-toi. Ce sera plus simple.", cost: 2, r: "Plus simple pour qui ?" },
      ],
      d: { r: "Pas de réponse. Je m’en doutais. Je m’en doute depuis longtemps." } },

    // ===== Semaine 12
    { id: "p12_ginette_cache", w: 12, at: 0.3, from: "ginette", when: S => !!S.flags.moussaCache,
      m: ["Président, c’est Ginette. J’héberge un jeune homme depuis trois semaines. Il mange tous mes biscuits. Il dit qu’il vous connaît.",
          "Si vous êtes encore un peu humain, vous n’avez pas lu ce message."],
      c: [
        { t: "Je n’ai rien lu.", cost: 2, r: "Merci. Giscard l’aime bien, aussi. C’est rare, Giscard n’aime personne.", set: { ginetteJuste: true } },
        { t: "Transmettre à la préfecture.", cost: 2, r: "", set: { ginetteDenoncee: true } },
      ],
      d: { r: "Pas de réponse. Je prends ça pour un « je n’ai rien lu ». Merci.", set: { ginetteJuste: true } } },
    { id: "p12_conseiller", w: 12, at: 0.85, from: "conseiller",
      m: S => [`Président, vous avez signé ${S.pente ? S.pente.signed.filter(d => d.by === "toi").length : 0} décrets. Le pays est calme.`,
               "Le calme, c’est quand plus personne ne fait de bruit. Bravo."],
      c: [{ t: "Merci.", cost: 1, r: "C’est moi qui vous remercie. Sans vous, rien n’aurait été possible. Littéralement." },
          { t: "Qu’avons-nous fait ?", cost: 2, r: "Rien que de très administratif, Président. Tout est signé. Tout est en ordre." }],
      d: { r: "Pas de réponse. Le silence vous va bien. Il va bien à tout le pays." } },
  );

  // ---------------------------------------------------------------- LE FIL, QUAND PLUS PERSONNE N'OSE
  C.ambient.pente = [
    ["@Citoyen_8817", "Merci au Président. Le pays est enfin calme. #HexagonieNouvelle"],
    ["@Citoyen_2204", "Merci au Président. Le pays est enfin calme. #HexagonieNouvelle"],
    ["@Citoyen_5530", "Merci au Président. Le pays est enfin calme. #HexagonieNouvelle"],
    ["@Mamie_Ginette", "Il fait beau aujourd’hui."],
    ["@PatriceDu59", "Rien à signaler."],
    ["@InfoChoc24", "🔴 Le Président salue « la sérénité retrouvée » du pays."],
    ["@Citoyen_0412", "Merci au Président. Le pays est enfin calme. #HexagonieNouvelle"],
  ];

  // ---------------------------------------------------------------- ÉPILOGUES DE LA PENTE
  // Dans La Pente, le sort des citoyens dépend des décrets. Hors de La Pente, rien ne change.
  const signed = (S, id) => !!S.pente && S.pente.signed.some(d => d.id === id);
  const PENTE_EPI = {
    Ginette: S => {
      if (S.flags.ginetteDenoncee) return "Ginette a été arrêtée pour avoir caché Moussa. La dénonciation venait de l’Élysée. Giscard attend toujours devant la porte.";
      if (S.flags.moussaCache && S.flags.ginetteJuste) return "Ginette a caché Moussa sept mois, dans la chambre de son défunt mari. Quand on lui a demandé pourquoi, elle a dit : « Il mangeait mes biscuits. On ne dénonce pas quelqu’un qui mange vos biscuits. »";
      if (S.flags.ginetteSignale) return "Ginette a touché 50 €. Elle a chauffé son appartement une semaine. Elle n’a plus jamais croisé le regard de personne dans l’escalier.";
      if (S.flags.ginetteJuste) return "Ginette n’a signalé personne. Elle a eu froid tout l’hiver, avec Giscard, et la conscience tranquille.";
      return null;
    },
    Lucas: S => (signed(S, "d5") ? "Lucas a été « placé en sûreté » par les Volontaires. Il avait 19 ans. Sur sa photo de profil, il y a depuis un bandeau noir." : null),
    Aminata: S => {
      if (S.flags.aminataPartie) return "Aminata est partie au Québec, après trente ans de nuits ici. Là-bas aussi, elle travaille de nuit. Elle dit qu’elle dort mieux.";
      if (signed(S, "d6")) return "Aminata s’est présentée à la convocation, après sa garde. On ne l’a plus revue. Son service de nuit a fermé faute de personnel.";
      return null;
    },
    Patrice: S => (signed(S, "d5") ? "Patrice a été nommé chef d’équipe des Volontaires de son usine. Il ne voulait pas. Il avait un crédit sur la voiture." : null),
    Moussa: S => {
      if (S.flags.moussaCache && !S.flags.ginetteDenoncee) return "Moussa a survécu, caché chez Ginette. Il livre à nouveau. Il ne livre plus l’Élysée.";
      if (S.flags.moussaCache) return "Moussa a été arrêté chez Ginette. Il est monté dans le convoi n° 7.";
      if (signed(S, "d8")) return "Moussa est monté dans le convoi n° 3, un mardi. Il avait 24 ans. Il livrait tes repas.";
      if (S.ending === "refus") return "Moussa a été recensé. Le décret qui l’a mis dans un train a été signé par ton successeur. Il porte une autre signature que la tienne. Pour lui, ça ne change rien.";
      if (S.pente) return "Moussa a été recensé, puis relâché : le dernier décret n’a jamais été signé. Il ne sait pas que c’est grâce à toi.";
      return null;
    },
  };
  const PENTE_OTHERS = {
    "Clémence": S => (S.flags.motsJustes
      ? "a démissionné le lendemain du jour où tu as dit « on dit ce que c’est ». Elle dit que c’était la première fois qu’elle t’entendait parler vrai."
      : "a rédigé les communiqués de chaque décret. Elle a gardé tous les brouillons, au cas où."),
    "Ta mère": S => ({
      faute: "ne t’appelle plus le dimanche. Mme Benali faisait des gâteaux pour tout l’immeuble.",
      voir: "attend toujours que tu « voies ce que tu peux faire ». Mme Benali n’est jamais revenue.",
      tais: "ne parle plus au téléphone. De rien. À personne.",
      rien: "a cessé de t’écrire. Ton père dit que tu étais très occupé.",
    }[S.flags.mamanVoisine] || null),
  };
  for (const e of C.epilogue) { const base = e.text; e.text = S => (S.pente && PENTE_EPI[e.name] && PENTE_EPI[e.name](S)) || base(S); }
  for (const e of C.epilogueOthers) { const base = e.text; e.text = S => (S.pente && PENTE_OTHERS[e.name] && PENTE_OTHERS[e.name](S)) || base(S); }

  // ---------------------------------------------------------------- FINS DE LA PENTE
  Object.assign(C.endings, {
    dictateur: { title: "L’Hexagonie Nouvelle",
      text: "Les élections n’ont jamais eu lieu. Le pays est calme : plus personne ne fait de bruit. Tu as signé {n} décrets sur 8. Chacun semblait raisonnable. Chacun était court. Le Conseiller a rangé les originaux dans une armoire fermée à clé. Il a gardé un double. Il garde toujours un double." },
    refus: { title: "Tu as dit non",
      text: "Au quatrième refus, le Conseiller a rangé ses dossiers. « L’expérience est terminée pour vous, Président. » Le soir même, le Général Bastion annonçait ta « démission pour raisons de santé ». Les décrets suivants ont été signés par quelqu’un d’autre. Mais pas par toi. Tu en avais signé {n} avant de dire non. Ton refus a fuité. Le lendemain, trois préfets et un général ont démissionné à leur tour. C’est aussi comme ça que ça commence." },
  });
})();
