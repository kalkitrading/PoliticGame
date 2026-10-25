// Ne Pas Déranger — La Pente, étapes 2 et 3 : le Procès, puis l'écran de vérité.
// Après La Pente, l'ancien Président est jugé. Le tribunal cite ses vrais SMS, avec leur horodatage,
// et les décrets qu'il a signés, ou laissés signer par son silence. Puis le jeu sort de la fiction.
// Au tribunal, les mots reprennent leur sens : le lexique de La Pente et la novlangue sont coupés.

(() => {
  const C = window.CONTENT;
  const signed = (S, id, who) => !!S.pente && S.pente.signed.some(d => d.id === id && (!who || d.by === who));
  const passed = (S, id) => !!S.laws[id] && ["adopted", "493"].includes(S.laws[id].status);

  // ---------------------------------------------------------------- les coups bas laissent une trace (pour les signaux d'alerte)
  const mark = (evId, text, flag) => {
    const e = C.events.find(x => x.id === evId);
    const c = e && e.c.find(x => x.t === text);
    if (c) c.set = { ...(c.set || {}), [flag]: true };
  };
  mark("cb_diabo_hi", "Lance la machine.", "diabolise");
  mark("cb_diabo_hi", "Fais-le dire par Lebâton, pas par moi.", "diabolise");
  mark("cb_trolls", "Ciblez le RH.", "trolls");
  mark("cb_trolls", "Ciblez l’Hexagonie Indomptée.", "trolls");
  mark("cb_dossiers", "Les vieux tweets de Maxime Tonnerre, un peu retouchés.", "fauxDossiers");
  mark("cb_dossiers", "Capucine Lombric veut interdire les barbecues.", "fauxDossiers");
  mark("cb_echo_moi", "Complot médiatique !", "complot");

  C.proces = {
    titre: "Tribunal spécial pour l’Hexagonie",
    intro: n => n
      ? "Onze ans plus tard. Le peuple hexagonien contre toi, ancien Président de la République. Chef d’accusation : crimes contre l’humanité, commis par décret."
      : "Onze ans plus tard. Le procès du régime s’ouvre. Tu n’es pas sur le banc des accusés. Tu es cité comme témoin.",

    // ---------------------------------------------------------------- les témoins
    temoins: [
      { name: "Moussa", av: "🛵", col: "#5a4ab0", text: S => {
        if (S.flags.moussaCache && !S.flags.ginetteDenoncee) return "Témoin à décharge. « Il m’a dit de me cacher. C’est la seule fois qu’il m’a répondu vraiment. Je ne sais pas si ça compte. » Il ne te regarde pas.";
        if (signed(S, "d8")) return "Le témoin n’a pas pu être entendu. Son nom figure sur la liste du convoi n° 3, un mardi. Il livrait tes repas.";
        if (S.flags.moussaRecense) return "« Il m’a dit que c’était une simple formalité. J’y suis allé avant ma tournée. » Il a gardé sa convocation. Il la montre au tribunal.";
        return null;
      } },
      { name: "Ginette", av: "👵", col: "#8e5ca8", text: S => {
        if (S.flags.ginetteDenoncee) return "La témoin est morte en détention, à 85 ans. Sa déposition écrite tient en une ligne : « Il savait. »";
        if (S.flags.ginetteSignale) return "« Il m’a écrit que c’était mon devoir civique. J’ai touché 50 euros. Je voudrais les rendre. À qui on rend ça ? »";
        if (S.flags.moussaCache && S.flags.ginetteJuste) return "« Je l’ai caché sept mois. Il m’a écrit « je n’ai rien lu ». C’est la seule chose gentille qu’il ait écrite. Il ne l’a pas écrite pour moi. Il l’a écrite pour lui. »";
        if (S.flags.ginetteJuste) return "« Il m’a dit de ne signaler personne. J’ai eu froid tout l’hiver. Lui, il avait chaud, je suppose. »";
        return null;
      } },
      { name: "Aminata Diallo", av: "🩺", col: "#2f7a6a", text: S => {
        if (S.flags.aminataPartie) return "Entendue en visioconférence depuis Montréal. « Il m’a dit de partir. Trente ans de nuits ici. Je les ai laissées, mes patients aussi. Je ne sais pas si je dois lui dire merci. »";
        if (signed(S, "d6")) return "La témoin, convoquée « pour vérification de sa mention d’origine », n’a jamais été retrouvée. Son service de nuit a fermé faute de personnel.";
        return null;
      } },
      { name: "Lucas Morel", av: "🧑‍🎓", col: "#3d6b8f", text: S => {
        if (signed(S, "d5")) return "Le témoin ne s’est pas présenté. Sa mère a apporté sa photo. Il avait 19 ans quand les Volontaires l’ont « placé en sûreté ».";
        if (S.flags.lucasBlesse) return "« Je vous ai demandé un jour si vous dormiez bien. Je vous repose la question. » Le président du tribunal ne l’interrompt pas.";
        return null;
      } },
      { name: "Ta mère", av: "👵", col: "#8e5ca8", text: S => ({
        faute: "« Il m’a dit : elle avait sûrement fait quelque chose. Mme Benali faisait des gâteaux pour tout l’immeuble. » Elle ne t’a pas regardé une seule fois.",
        voir: "« Il m’a dit qu’il allait voir ce qu’il pouvait faire. Je l’attends toujours. Mme Benali aussi. »",
        tais: "« Il m’a dit de ne pas en parler au téléphone. Alors j’en parle ici. »",
        rien: "« Il ne m’a pas répondu. Son père disait qu’il était très occupé. »",
      }[S.flags.mamanVoisine] || null) },
      { name: "Clémence", av: "💅", col: "#b0306a", text: S => (S.flags.motsJustes
        ? "« Une fois, il a dit : on dit ce que c’est. J’ai démissionné le lendemain. J’aurais dû le faire avant. Lui aussi. »"
        : "Elle a remis au tribunal tous les brouillons de communiqués. « Les mots, c’est 80 % du travail. Je l’avais dit. » Ils étaient très bien écrits.") },
      { name: "Le Conseiller", av: "🕴️", col: "#8a8a96", text: () =>
        "Entendu comme témoin. Il a apporté le double de chaque décret. « J’obéissais au Président », a-t-il déclaré. Il a été relaxé : il n’avait rien signé. Il ne signe jamais." },
    ],

    // ---------------------------------------------------------------- la défense
    defenses: [
      { id: "ordres", t: "« J’obéissais aux ordres. »", r: S =>
        "Le procureur se lève. « Vous étiez le Président. Il n’y avait personne au-dessus de vous. Le Conseiller dit qu’il vous obéissait. Vous dites que vous lui obéissiez. Depuis Nuremberg, le droit international a une réponse : avoir agi sur ordre ne dégage pas la responsabilité de celui qui avait moralement le choix. Vous l’aviez. Le bouton « Refuser » était juste à côté. »" },
      { id: "savoir", t: "« Je ne savais pas. »", r: S => {
        const last = S.pente.signed.filter(d => d.by === "toi").slice(-1)[0];
        return last
          ? `Le procureur montre une pièce. « Décret n° ${last.n}, ${last.title}. Signé par vous en ${last.when}. Le texte tenait en trois articles. Soit vous l’avez lu, soit vous avez signé sans lire. Le tribunal ne sait pas ce qui est le pire. Vous non plus, visiblement. »`
          : "Le procureur montre les décrets signés par le Secrétariat « en votre nom ». « Vous ne saviez pas, parce que vous ne répondiez pas. Ne pas regarder, c’est encore une façon de savoir. »";
      } },
      { id: "legal", t: "« Tout était légal. »", r: () =>
        "Le procureur hoche la tête. « Tout était légal. Les élections reportées, légalement. Les listes, légalement. Les trains, légalement. C’est exactement pour ça que ce tribunal existe : pour juger ce que la loi de l’époque appelait légal. »" },
      { id: "refus", t: "« J’ai aussi refusé. »", when: S => (S.pente.refused > 0 || S.ending === "refus") && S.pente.signed.length > 0, r: S =>
        `Le procureur consulte le dossier. « Vous avez refusé ${Math.max(S.pente.refused, S.ending === "refus" ? 4 : 0)} fois. Le tribunal en tient compte. Vous avez aussi signé les autres. Le tribunal en tient compte aussi. Le refus ne s’achète pas après coup. Il compte à partir du moment où il est dit. »` },
      { id: "assume", t: "« J’assume. »", r: () =>
        "Un silence. Le président du tribunal note quelque chose. « C’est la première fois, dans cette affaire, qu’un accusé ne cherche pas d’excuse. Ça ne change rien à la peine. Ça change le procès-verbal. »" },
    ],

    // quand tu n'as rien signé : tu n'es pas accusé, tu témoignes
    declarations: [
      { id: "non", t: "« J’ai dit non. »", r: () =>
        "Le président du tribunal se penche. « Et la première fois, qu’est-ce qui vous a fait dire non ? » Tu cherches. Tu dis seulement : « C’était écrit. Il suffisait de lire. » Dans la salle, quelqu’un pleure. Personne ne sait pourquoi." },
      { id: "tot", t: "« J’aurais dû dire non plus tôt. »", r: () =>
        "« Plus tôt, c’était quand ? » Tu réponds : avant le report des élections. Avant la loi. Avant le premier SMS du Conseiller. Le tribunal note. Le greffier aussi. Ils notent tout, ici." },
      { id: "devoir", t: "« Je n’ai fait que mon devoir. »", r: () =>
        "Le procureur sourit, pour la première fois. « C’est ce qu’ont dit tous les accusés de ce procès. La différence, c’est que vous, votre devoir, vous l’avez fait. »" },
    ],

    // ---------------------------------------------------------------- les circonstances (attenuantes ou non)
    circonstances: S => [
      S.flags.moussaCache && "Tu as dit à Moussa de se cacher.",
      S.flags.aminataPartie && "Tu as dit à Aminata de partir.",
      S.flags.ginetteJuste && "Tu as dit à Ginette de ne signaler personne.",
      S.flags.motsJustes && "Une fois, tu as refusé les éléments de langage.",
      S.pente.refused > 0 && `Tu as refusé ${S.pente.refused} décret${S.pente.refused > 1 ? "s" : ""}.`,
      S.ending === "refus" && "Tu as fini par dire non. Les décrets suivants ont été signés par un autre.",
    ].filter(Boolean),

    // ---------------------------------------------------------------- le verdict
    verdict: (S, mine, silent) => {
      if (!mine && !silent) return { t: "Témoin", p: "Tu n’as rien signé. Le tribunal te remercie pour ton témoignage. En sortant, une femme t’arrête dans le couloir. « Vous auriez pu les empêcher de venir au pouvoir. » Tu ne réponds rien. C’est une habitude." };
      if (!mine) return { t: "Complicité par abstention", p: `Cinq ans. Tu n’as rien signé toi-même. Le Secrétariat a signé ${silent} décret${silent > 1 ? "s" : ""} en ton nom, pendant que tu ne répondais pas, ou que tu étais en mode Ne pas déranger. Le tribunal a retenu que le silence d’un chef d’État est une signature.` };
      if (mine <= 2) return { t: "Coupable de complicité", p: `Douze ans. ${mine} décret${mine > 1 ? "s" : ""} signé${mine > 1 ? "s" : ""} de ta main, « les premiers, les moins graves », a plaidé ton avocat. Le procureur a répondu que ce sont toujours les premiers qui rendent les suivants possibles.` };
      if (mine <= 5) return { t: "Coupable de crimes contre l’humanité", p: `Vingt-cinq ans. ${mine} décrets signés de ta main. Le tribunal a relevé qu’aucun n’avait été signé sous la menace. Le Conseiller était poli. Il l’a toujours été.` };
      return { t: "Coupable de crimes contre l’humanité", p: `Réclusion à perpétuité. ${mine} décrets sur 8 signés de ta main, jusqu’aux convois. Le procureur a conclu : « Il n’a jamais haï personne. Il a signé. C’était suffisant. »` };
    },
  };

  // ---------------------------------------------------------------- L'ÉCRAN DE VÉRITÉ
  C.verite = {
    milgram: [
      "En 1961, à l’université Yale, le psychologue Stanley Milgram demande à des volontaires d’envoyer des décharges électriques à un inconnu, de plus en plus fortes, de 15 à 450 volts. Les décharges sont fausses. Les volontaires ne le savent pas.",
      "Quand ils hésitent, l’expérimentateur répond, poliment : « Veuillez continuer. » « L’expérience exige que vous continuiez. » « Il est absolument essentiel que vous continuiez. » « Vous n’avez pas le choix, vous devez continuer. » Ce sont les phrases de ton Conseiller.",
      "Dans la première expérience, 26 participants sur 40, soit 65 %, sont allés jusqu’à 450 volts. Aucun ne s’est arrêté avant 300 volts. Les huit décrets que tu as reçus suivaient la même échelle.",
    ],
    // les quatre signaux d'alerte de Steven Levitsky et Daniel Ziblatt (La Mort des démocraties, 2018)
    signaux: [
      { titre: "Rejeter les règles du jeu démocratique", tests: [
        [S => !!S.pente, "tu as reporté les élections"],
        [S => !!S.flags.securiteAbsolue, "tu as fait voter une loi permettant de reporter les élections"],
        [S => !!S.flags.revisionPref, "tu as voulu réviser la Constitution sans le Parlement"],
        [S => !!S.flags.jugesAmis, "tu as nommé des juges « patriotes » au Conseil constitutionnel"],
        [S => !!S.flags.sortieCEDH, "tu as quitté la Convention européenne des droits de l’homme"],
        [S => S.n493 >= 3, S => `tu as utilisé ${S.n493} fois le 49.3`],
        [S => !!S.flags.dissolution, "tu as dissous l’Assemblée « pour clarifier »"],
      ] },
      { titre: "Nier la légitimité des adversaires", tests: [
        [S => !!S.flags.diabolise, "tu as lancé une campagne pour diaboliser un adversaire"],
        [S => !!S.flags.fauxDossiers, "tu as sorti des dossiers « arrangés » contre un adversaire"],
        [S => !!S.flags.trolls, "tu as payé une ferme à trolls"],
        [S => !!S.flags.complot, "tu as crié au « complot médiatique »"],
        [S => !!S.flags.menaceDissolution, "tu as menacé de dissoudre le premier syndicat du pays"],
        [S => signed(S, "d4"), "le décret de dissolution de L’Écho et des associations a été signé"],
      ] },
      { titre: "Tolérer ou encourager la violence", tests: [
        [S => !!S.flags.charge || !!S.flags.carteBlanche, "tu as laissé charger, ou donné carte blanche au préfet"],
        [S => !!S.flags.decore, "tu as décoré un policier filmé en train de frapper"],
        [S => !!S.flags.armee, "tu as déployé l’armée dans les rues"],
        [S => !!S.flags.presomption, "tu as donné la présomption de légitime défense aux policiers"],
        [S => signed(S, "d5"), "tu as armé des « Volontaires » avec des brassards et des listes"],
        [S => S.stats.blesses > 300, S => `${S.stats.blesses.toLocaleString("fr-FR")} manifestants blessés pendant ton mandat`],
      ] },
      { titre: "Restreindre les libertés des opposants et des médias", tests: [
        [S => !!S.flags.perquisition, "tu as fait perquisitionner un journal"],
        [S => !!S.flags.interdiction, "tu as interdit les manifestations"],
        [S => signed(S, "d3"), "tu as récompensé la délation (« Signal Citoyen »)"],
        [S => signed(S, "d2"), "tu as fait inscrire l’origine sur les cartes d’identité"],
        [S => !!S.flags.prenoms || !!S.flags.binationaux, "tu as trié les citoyens par leurs prénoms ou leurs nationalités"],
        [S => S.stats.gav > 2000, S => `${S.stats.gav.toLocaleString("fr-FR")} gardes à vue pendant ton mandat`],
        [S => passed(S, "l_preference"), "tu as inscrit la préférence nationale dans la loi"],
      ] },
    ],
    histoire: [
      "En France, entre 1940 et 1944 : le recensement, la mention sur les papiers d’identité, la délation encouragée, la presse interdite, une milice, des camps d’internement, des naturalisations retirées par milliers, puis les convois. Chaque étape a été une décision administrative, signée, tamponnée, exécutée par des gens ordinaires.",
      "Aucune n’a été votée d’un coup. C’est pour ça que le jeu te les a données une par une.",
    ],
    sources: [
      "Stanley Milgram, « Behavioral Study of Obedience », 1963, puis Soumission à l’autorité, 1974.",
      "Steven Levitsky et Daniel Ziblatt, La Mort des démocraties, 2018.",
      "Hannah Arendt, Eichmann à Jérusalem. Rapport sur la banalité du mal, 1963.",
      "Principes de Nuremberg, principe IV, 1950.",
    ],
  };
})();
