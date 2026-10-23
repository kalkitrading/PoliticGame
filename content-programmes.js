// Ne Pas Déranger — programmes, fenêtre d'Overton, promesses et élection présidentielle.
// Ce fichier est partagé par le jeu (game.js) et le simulateur (tools/equilibrage.js) :
// le calcul de l'élection est écrit une seule fois, ici.

(() => {
  const C = window.CONTENT;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // une loi « tenue » : adoptée, ou défendue par ton groupe puis rejetée par l'Assemblée
  const passed = (S, id) => !!S.laws[id] && (["adopted", "493"].includes(S.laws[id].status) || (S.laws[id].status === "rejected" && S.laws[id].instr === "pour"));
  const gone = (S, id) => !!S.laws[id] && ["rejected", "buried", "retire", "skip"].includes(S.laws[id].status) && !passed(S, id);
  const REPRESSION = ["repression", "carteBlanche", "charge", "requisition", "interdiction", "perquisition", "armee", "securiteAbsolue"];
  const repCount = S => REPRESSION.filter(f => S.flags[f]).length;

  C.weights = { jeunes: .22, ouvriers: .28, retraites: .30, patrons: .08, police: .12 };
  C.popOf = S => Object.entries(C.weights).reduce((s, [k, w]) => s + S.g[k] * w, 0);

  // position de chaque groupe sur l'axe gauche de rupture (-100) → droite autoritaire (+100)
  C.positions = { HI: -70, VP: -45, PP: -25, CA: 0, DIV: 5, DP: 35, RH: 70 };

  // soutien de base des autres groupes à un texte du gouvernement : plus ils sont proches de toi, plus ils votent pour
  C.proximityStance = (S, mine) => {
    const o = {};
    for (const g of C.groups) {
      o[g.id] = g.id === S.me ? mine : g.id === "DIV" ? 0.4 : Math.max(0.03, 0.6 - Math.abs(C.positions[g.id] - C.positions[S.me]) / 110);
    }
    return o;
  };

  C.leaderContact = { HI: "tonnerre", VP: "lombric", PP: "hesitant", CA: "parti", DP: "heritage", RH: "frontiere" };

  // ---------------------------------------------------------------- PROGRAMMES
  // Chaque promesse : state(S) → "ok" | "broken" | "pending". keep: une promesse de « ne pas faire »,
  // tenue si rien ne l'a brisée à la fin. final(S) : vérification à la fin du mandat.
  C.programmes = [
    { id: "social", group: "HI", emoji: "🌹", name: "Justice sociale",
      pitch: "Le SMIC, l’hôpital, les riches qui paient enfin. Tu diriges l’Hexagonie Indomptée.",
      overton: -12, incumbency: 7, // un électorat militant
      start: { g: { jeunes: 8, ouvriers: 10, retraites: 0, patrons: -12, police: -8 }, rel: { VP: 55, PP: 50, CA: 30, DIV: 45, DP: 20, RH: 15 } },
      promises: [
        { text: "Augmenter le SMIC", heir: "CA", state: S => (passed(S, "l_smic") || S.flags.dealSyndicat ? "ok" : "pending") },
        { text: "Taxer les plus riches", heir: "CA", state: S => (S.flags.arrangement || passed(S, "l_heritage") || S.flags.rigueur || S.flags.gelPensions ? "broken" : S.flags.taxeRiches ? "ok" : "pending") },
        { text: "Ne pas reculer l’âge de la retraite", heir: "CA", keep: true, state: S => (passed(S, "l_retraite") ? "broken" : "pending") },
        { text: "Ne jamais réprimer la rue", heir: "RH", keep: true, state: S => (repCount(S) >= 2 ? "broken" : "pending") },
      ] },
    { id: "climat", group: "VP", emoji: "🌱", name: "Urgence climatique",
      pitch: "Sauver ce qui peut l’être, contre les jets privés et les lobbies. Tu diriges les Verts Pâles.",
      overton: -6, incumbency: -2,
      start: { g: { jeunes: 10, ouvriers: -2, retraites: -4, patrons: -6, police: -4 }, rel: { HI: 40, PP: 50, CA: 40, DIV: 45, DP: 30, RH: 15 } },
      promises: [
        { text: "Interdire les jets privés", heir: "CA", state: S => (passed(S, "l_jets") ? "ok" : gone(S, "l_jets") ? "broken" : "pending") },
        { text: "Voter une grande loi climat", heir: "CA", state: S => (passed(S, "l_climat_urgence") || (passed(S, "l_renov") && passed(S, "l_kerosene")) ? "ok" : gone(S, "l_climat_urgence") ? "broken" : "pending") },
        { text: "Ni méga-bassines ni béton sur les terres inondées", heir: "DP", keep: true, state: S => (S.flags.megabassines || S.flags.terrainsVallon ? "broken" : "pending") },
        { text: "Garder plus de 40 % de planète", heir: "HI", state: S => (S.eco >= 90 ? "broken" : "pending"), final: S => S.eco <= 60 },
      ] },
    { id: "liberal", group: "DP", emoji: "💼", name: "Libérer les énergies",
      pitch: "Moins d’impôts, des retraites réformées, des marchés rassurés. Tu diriges la Droite Patrimoniale.",
      overton: 8, incumbency: 4,
      start: { g: { jeunes: -3, ouvriers: -3, retraites: 6, patrons: 15, police: 3 }, rel: { HI: 10, VP: 25, PP: 30, CA: 60, DIV: 50, RH: 35 } },
      promises: [
        { text: "Réformer les retraites", heir: "CA", state: S => (passed(S, "l_retraite") ? "ok" : gone(S, "l_retraite") ? "broken" : "pending") },
        { text: "Supprimer les droits de succession", heir: "CA", state: S => (passed(S, "l_heritage") ? "ok" : gone(S, "l_heritage") ? "broken" : "pending") },
        { text: "Aucun nouvel impôt", heir: "RH", keep: true, state: S => (S.flags.taxeRiches || passed(S, "l_kerosene") ? "broken" : "pending") },
        { text: "Garder les caisses à flot", heir: "CA", state: S => (S.budget < 15 ? "broken" : "pending"), final: S => S.budget >= 35 },
      ] },
    { id: "ordre", group: "RH", emoji: "🛡️", name: "L’Ordre",
      pitch: "Sécurité, frontières, autorité. Tu diriges le Rassemblement Hexagonal. Le jeu ne te fera pas de cadeau.",
      overton: 20, incumbency: 6,
      start: { g: { jeunes: -8, ouvriers: 2, retraites: 6, patrons: -2, police: 12 }, rel: { HI: 5, VP: 10, PP: 20, CA: 35, DIV: 40, DP: 50 } },
      promises: [
        { text: "Instaurer la Préférence Hexagonale", heir: "DP", state: S => (passed(S, "l_preference") ? "ok" : gone(S, "l_preference") ? "broken" : "pending") },
        { text: "Construire le Bouclier Hexagonal", heir: "DP", state: S => (passed(S, "l_mur") ? "ok" : gone(S, "l_mur") ? "broken" : "pending") },
        { text: "Ne régulariser personne", heir: "DP", keep: true, state: S => (passed(S, "l_regul") || S.flags.moussa === "appui" ? "broken" : "pending") },
        { text: "Garder l’ordre au-dessus de 60", heir: "DP", state: S => (S.ordre < 35 ? "broken" : "pending"), final: S => S.ordre >= 60 },
      ] },
    { id: "centre", group: "CA", emoji: "🤷", name: "Ni l’un ni l’autre",
      pitch: "Ni de gauche ni de droite, bien au contraire. Le but : garder le pouvoir. Tu diriges le Centre Absolu.",
      overton: 5, incumbency: -12, // l'usure du « en même temps »
      start: { g: {}, rel: {} },
      promises: [
        { text: "Faire voter le budget", heir: "DP", state: S => (passed(S, "l_budget") ? "ok" : gone(S, "l_budget") ? "broken" : "pending") },
        { text: "Réformer les retraites", heir: "DP", state: S => (passed(S, "l_retraite") ? "ok" : gone(S, "l_retraite") ? "broken" : "pending") },
        { text: "Pas plus de deux 49.3", heir: "RH", keep: true, state: S => (S.n493 > 2 ? "broken" : "pending") },
        { text: "Rester « ni de gauche ni de droite »", heir: S => (S.overton > 0 ? "RH" : "HI"), state: S => (Math.abs(S.overton) > 45 ? "broken" : "pending"), final: S => Math.abs(S.overton) <= 25 },
      ] },
  ];
  C.programme = S => C.programmes.find(p => p.id === S.programme);

  C.promiseStates = (S, atEnd) => C.programme(S).promises.map(pr => {
    let st = pr.state(S);
    if (atEnd && st === "pending") st = (pr.final ? pr.final(S) : pr.keep) ? "ok" : "broken";
    return { text: pr.text, st, heir: pr.heir };
  });

  // part des promesses tenues ; en cours de mandat, une promesse en attente compte pour moitié
  C.fidelity = (S, atEnd) => {
    const st = C.promiseStates(S, atEnd);
    return st.reduce((s, p) => s + (p.st === "ok" ? 1 : p.st === "pending" ? 0.5 : 0), 0) / st.length;
  };

  // ---------------------------------------------------------------- FENÊTRE D'OVERTON
  // Valeur ajoutée par chaque choix : positive = vers la droite autoritaire, négative = vers la gauche.
  // events[id] = [choix 0, choix 1, choix 2] ; d = réponse par défaut (message ignoré).
  C.overtonMap = {
    events: {
      w1_rabot: { c: [3, 2, -5], d: 3 },
      w1_josy: { c: [-2, 2, 2] },
      w1_prefet: { c: [5, -3, 6], d: 6 },
      w2_josy_a: { c: [-4, 0, 3] },
      w2_josy_b: { c: [-6, 0] },
      w2_frontiere: { c: [6, -2] },
      w2_call_prefet: { c: [6, 0, -2], d: 6 },
      w2_video_a: { c: [2, -4, 4] },
      w2_video_b: { c: [4, -1, 0] },
      w3_rabot: { c: [4, 0, 1], d: 4 },
      w3_josy: { c: [-4, 0, 6] },
      w3_lebaton: { c: [10, 3, -5], d: 10 },
      w5_chloe: { c: [0, -1, 2] },
      w5_lebaton: { c: [6, -1], d: 6 },
      w5_douce: { c: [-3, 1] },
      w5_general: { c: [0, 8, 0] },
      w6_josy_hot: { c: [-6, 6, 0] },
      w6_prefet: { c: [6, -4, 2], d: 5 },
      w7_securite: { c: [12, 6, -4], d: 12 },
      w7_general: { c: [-2, 0, 4] },
      c_aminata1: { c: [0, -1, 2] },
      c_moussa: { c: [0, 2, -2] },
      c_lucas_blesse: { c: [-2, 0, 3] },
      p_culture: { c: [0, 2], d: 2 },
      p_feux: { c: [4, -1] },
    },
    // texte adopté (vote ou 49.3)
    laws: {
      l_preference: 15, l_immigration: 10, l_permis: 8, l_mur: 10, l_heritage: 4, l_retraite: 3,
      l_regul: -10, l_smic: -8, l_jets: -4, l_renov: -2, l_kerosene: -3, l_climat_urgence: -5, l_revocation: -6, l_feries: -1,
    },
    use493: 3,   // chaque 49.3 banalise l'autoritarisme
    weekly: 1,   // la droitisation ambiante des chaînes de Vallon-Dividende
  };
  C.ovEvent = (id, ci) => {
    const m = C.overtonMap.events[id];
    if (!m) return 0;
    return ci === "d" ? m.d || 0 : m.c[ci] || 0;
  };

  C.overtonLabel = O => (O < -40 ? "Gauche de rupture" : O < -12 ? "Centre gauche" : O <= 12 ? "Centre" : O <= 40 ? "Droite" : "Droite autoritaire");
  // plus la fenêtre glisse à droite, moins le barrage contre le RH tient
  C.barrage = O => clamp((45 - O) / 70, 0, 1);
  C.barrageLabel = O => { const b = C.barrage(O); return b > 0.6 ? "solide" : b > 0.25 ? "fragile" : "effondré"; };

  C.movement = S => {
    const mate = repCount(S) >= 2 || !!S.flags.securiteAbsolue;
    const strong = S.colere >= 45;
    return { mate, strong, label: strong ? (mate ? "Fort, mais maté" : "Fort et écouté") : mate ? "Écrasé" : "Essoufflé" };
  };

  // ---------------------------------------------------------------- ÉLECTION À DEUX TOURS
  C.candidates = {
    HI: "Maxime Tonnerre", VP: "Capucine Lombric", PP: "Olivier Hésitant",
    CA: "Édouard Lisse", DP: "Bertrand Héritage", RH: "Steeve Frontière",
  };
  const BASE = { HI: 13, VP: 6, PP: 7, CA: 15, DP: 9, RH: 23 };

  // noise : aléa relatif sur chaque score (0 pour un sondage)
  C.election = (S, opts = {}) => {
    const noise = opts.noise || 0, atEnd = !!opts.atEnd;
    const me = S.me, O = S.overton, mv = C.movement(S), f = C.fidelity(S, atEnd), p = C.popOf(S);
    const rnd = () => 1 + (Math.random() * 2 - 1) * noise;
    const near = id => Math.max(0, 1 - Math.abs(C.positions[id] - O) / 60);
    const ids = Object.keys(C.candidates);
    const raw = {};
    for (const id of ids) {
      let v = id === me
        ? 6 + p * 0.55 * (0.15 + 0.85 * Math.pow(f, 1.3)) + 10 * near(id) + (C.programme(S).incumbency || 0)  // toi : popularité × fidélité
        : BASE[id] + 14 * near(id);                                        // les autres : proches de la fenêtre = « normaux »
      if (id === "HI" && mv.strong && !mv.mate) v += (S.colere - 40) * 0.3;   // la rue écoutée porte la gauche
      if (id === "RH" && mv.mate) v += 4 + repCount(S) * 1.5;                 // la rue écrasée porte la peur
      if (id === "RH") v += S.stats.fuites * 0.8 + Math.max(0, O) * 0.08;
      if (id === "HI") v += S.stats.fuites * 0.4;
      if (id === "VP") v += Math.max(0, S.eco - 60) * 0.25;
      raw[id] = Math.max(1, v);
    }
    // tes électeurs déçus votent pour celui qui fait ce que tu as fait à leur place :
    // l'héritier désigné par tes promesses trahies, sinon le candidat le plus proche de la fenêtre
    const heirs = {};
    for (const pr of C.promiseStates(S, atEnd)) if (pr.st === "broken" && pr.heir) { const h = typeof pr.heir === "function" ? pr.heir(S) : pr.heir; if (h !== me) heirs[h] = (heirs[h] || 0) + 1; }
    const nearest = ids.filter(id => id !== me).sort((a, b) => Math.abs(C.positions[a] - O) - Math.abs(C.positions[b] - O))[0];
    const heir = Object.keys(heirs).sort((a, b) => heirs[b] - heirs[a])[0] || nearest;
    raw[heir] += (1 - f) * 14;
    for (const id of ids) raw[id] *= rnd();
    const sum = Object.values(raw).reduce((a, b) => a + b, 0);
    const r1 = ids.map(id => ({ id, pct: (100 * raw[id]) / sum })).sort((a, b) => b.pct - a.pct);
    const [A, B] = [r1[0].id, r1[1].id];

    // second tour : reports des éliminés, barrage contre le RH, consignes de vote des groupes
    const b = C.barrage(O);
    const votes = { [A]: r1[0].pct, [B]: r1[1].pct };
    for (const e of r1.slice(2)) {
      let wA = 1 / (1 + Math.abs(C.positions[e.id] - C.positions[A]) / 25);
      let wB = 1 / (1 + Math.abs(C.positions[e.id] - C.positions[B]) / 25);
      if (A === "RH" && e.id !== "RH") { wB *= 1 + 1.2 * b; wA *= 1 - 0.5 * b; }
      if (B === "RH" && e.id !== "RH") { wA *= 1 + 1.2 * b; wB *= 1 - 0.5 * b; }
      if (A === me && e.id !== me) wA *= 0.5 + S.rel[e.id] / 100;
      if (B === me && e.id !== me) wB *= 0.5 + S.rel[e.id] / 100;
      const keep = e.pct * 0.75; // un quart des électeurs des éliminés s'abstient
      votes[A] += (keep * wA) / (wA + wB);
      votes[B] += (keep * wB) / (wA + wB);
    }
    const tot = votes[A] + votes[B];
    const r2 = [A, B].map(id => ({ id, pct: (100 * votes[id]) / tot })).sort((x, y) => y.pct - x.pct);
    return { r1, r2, winner: r2[0].id, barrage: b, fidelity: f };
  };

  C.candName = (S, id) => (id === S.me ? "Toi" : C.candidates[id]);

  // ---------------------------------------------------------------- SONDAGES (SMS de Clémence)
  C.pollText = S => {
    const r = C.election(S);
    S.lastPoll = { week: S.week, r1: r.r1, r2: r.r2 };
    const first = r.r1.slice(0, 4).map(c => `${C.candName(S, c.id)} ${Math.round(c.pct)} %`).join(" · ");
    const inR2 = r.r2.some(c => c.id === S.me);
    const second = inR2
      ? (r.winner === S.me
        ? `Second tour : tu gagnerais avec ${Math.round(r.r2[0].pct)} % face à ${C.candName(S, r.r2[1].id)}.`
        : `Second tour : tu perdrais face à ${C.candName(S, r.winner)}, ${Math.round(r.r2[1].pct)} % contre ${Math.round(r.r2[0].pct)} %.`)
      : `Tu ne serais même pas au second tour. Il opposerait ${C.candName(S, r.r2[0].id)} et ${C.candName(S, r.r2[1].id)}. ${C.candName(S, r.winner)} gagnerait.`;
    return [`📊 Sondage exclusif, 1er tour : ${first}.`, second,
      `Fenêtre d’Overton : ${C.overtonLabel(S.overton).toLowerCase()}. Barrage contre le RH : ${C.barrageLabel(S.overton)}.`];
  };

  C.events.push(
    { id: "w4_sondage", w: 4, at: 0.93, from: "clemence",
      m: S => C.pollText(S),
      c: [
        { t: "Merci.", cost: 1, r: "Je t’en commande un autre pour la semaine 7. Essaie de le rendre meilleur." },
        { t: "Fais-le refaire.", cost: 2, r: "J’ai demandé à l’institut. Il dit que les chiffres sont têtus. Comme toi." },
      ],
      d: { r: "Tu n’as pas lu le sondage. Les autres candidats, si." } },
    { id: "w7_sondage", w: 7, at: 0.1, from: "clemence",
      m: S => C.pollText(S),
      c: [
        { t: "On peut encore renverser la tendance.", cost: 1, r: "Il te reste une semaine. Et ton téléphone." },
        { t: "Les sondages se trompent toujours.", cost: 1, r: "C’est ce que disent tous ceux qui perdent. Et parfois ceux qui gagnent." },
      ],
      d: { r: "Pas de réponse. Je range le sondage avec les autres mauvaises nouvelles." } },

    // ton propre groupe te rappelle tes promesses
    { id: "w5_groupe", w: 5, at: 0.56, from: S => C.leaderContact[S.me],
      when: S => C.promiseStates(S).some(p => p.st === "broken"),
      m: S => {
        const broken = C.promiseStates(S).find(p => p.st === "broken");
        return ["Président, ici ton groupe à l’Assemblée.",
          `Nos députés ont été élus sur « ${broken.text} ». Tu l’as trahi. Une trentaine menacent de voter avec l’opposition.`];
      },
      c: [
        { t: "Je tiendrai le reste de mes promesses.", cost: 3, r: "On te croit. Pas tous. Mais on te croit." },
        { t: "Ils obéiront.", cost: 3, r: "Ils obéiront. Jusqu’au jour où ils n’obéiront plus.", set: { frondeDure: true } },
      ],
      d: { r: "Pas de réponse. Les frondeurs prennent ça pour un feu vert.", set: { frondeDure: true } } },
  );

  // ---------------------------------------------------------------- FINS SELON LE GAGNANT
  Object.assign(C.endings, {
    win_RH: { title: "La Longue Nuit",
      text: "Steeve Frontière est élu avec {p} %. Premier décret : la Préférence Hexagonale, « sans attendre l’Assemblée ». Deuxième décret : le préfet Garrot devient ministre. Les journalistes de L’Écho apprennent le mot « rétention » en direct. Les manifestations sont « encadrées », c’est-à-dire interdites. L’Hexagonie entre dans une longue nuit, et beaucoup disent qu’ils n’ont rien vu venir. Ils avaient pourtant tout vu." },
    win_HI: { title: "Le Grand Soir",
      text: "Maxime Tonnerre est élu avec {p} %. Le SMIC passe à 2 000 €, les loyers sont bloqués, Ginette a chaud l’hiver. Vallon-Dividende découvre la salle d’attente des urgences, avec tout le monde. Les marchés font une crise de nerfs, puis s’habituent. Le bonheur est voté à main levée. Maxime Tonnerre nationalise aussi les jours de pluie : personne n’a osé lui dire non." },
    win_CA: { title: "L’Extrême Centre",
      text: "Édouard Lisse est élu avec {p} %. Personne ne l’a choisi, tout le monde l’a subi. Il promet de « dépasser les clivages », c’est-à-dire de ne rien changer avec un nouveau logo. Le mouvement social s’essouffle, le RH attend son tour, et les éditorialistes saluent « le retour de la raison ». La raison, elle, n’a pas été consultée." },
    win_VP: { title: "La République Verte",
      text: "Capucine Lombric est élue avec {p} %. Les jets privés deviennent des serres, les autoroutes des pistes cyclables, Patrice apprend à réparer des éoliennes. Les SUV sont taxés au poids : Vallon-Dividende fait peser son yacht. La planète respire. Le reste du monde regarde, prend des notes, et ne fait rien." },
    win_DP: { title: "La Restauration",
      text: "Bertrand Héritage est élu avec {p} %. Les droits de succession disparaissent, le SMIC aussi « par souci de clarté ». Sa grand-mère entre au Conseil constitutionnel : elle a 12 immeubles et désormais un avis. L’Hexagonie retrouve les valeurs d’antan, surtout celles cotées en Bourse." },
    win_PP: { title: "Peut-être Président",
      text: "Olivier Hésitant est élu avec {p} %, à sa grande surprise. Il hésite trois semaines avant de s’installer à l’Élysée. Son premier Conseil des ministres dure neuf heures et ne décide rien. Pour la première fois depuis longtemps, l’Hexagonie ne va ni mieux ni pire. Certains appellent ça un miracle." },
  });
  delete C.endings.battu;

  // ---------------------------------------------------------------- LA PLANÈTE, EN ARRIÈRE-PLAN DE LA FIN
  // L'effondrement ne termine plus la partie : il s'ajoute au texte de fin, quel que soit le gagnant.
  C.ecoEnding = {
    collapse: {
      RH: "Steeve Frontière accuse les réfugiés climatiques d’avoir apporté la chaleur. Il fait construire un mur contre la mer. La mer n’a pas été consultée.",
      HI: "Maxime Tonnerre lance un plan d’urgence historique, avec dix ans de retard. Le bonheur est voté, mais à 48 °C.",
      CA: "Édouard Lisse organise une COP de la dernière chance, la quatorzième. Elle se tient sous clim, dans un salon de l’Élysée.",
      VP: "Capucine Lombric est élue pour gérer les ruines. Elle a raison depuis vingt ans. Ça ne la console pas.",
      DP: "Bertrand Héritage investit dans les bunkers de luxe. Sa grand-mère en a déjà douze.",
      PP: "Olivier Hésitant hésite à déclarer l’état d’urgence climatique. Il hésite encore.",
      me: "Tu as gagné l’élection sur une planète qui l’a perdue. Ton discours de victoire est coupé par une alerte canicule.",
      other: "Pendant que le pays s’occupait de toi, les fleuves se sont asséchés, les récoltes ont brûlé et les assureurs ont fait faillite. Personne n’a eu le temps d’en parler.",
    },
    tipping: "Pendant ce temps, l’été a duré jusqu’en novembre et trois départements ont manqué d’eau potable. Personne n’en a parlé au débat.",
  };
  C.ecoText = (S, endingId) => {
    if (S.eco >= 100) {
      const w = S.election ? S.election.winner : null;
      const t = endingId === "reelu" ? C.ecoEnding.collapse.me : w && C.ecoEnding.collapse[w] ? C.ecoEnding.collapse[w] : C.ecoEnding.collapse.other;
      return { level: "collapse", text: t };
    }
    if (S.eco >= 75) return { level: "tipping", text: C.ecoEnding.tipping };
    return null;
  };

  // la phrase qui te concerne, selon ton programme, tes trahisons et le gagnant
  C.youSentence = (S, el) => {
    const states = C.promiseStates(S, true);
    const kept = states.filter(p => p.st === "ok").length, n = states.length;
    const broken = states.find(p => p.st === "broken");
    const prog = C.programme(S);
    const mine = el.r1.find(c => c.id === S.me);
    const out = el.r2.some(c => c.id === S.me) ? "" : ` Tu as été éliminé dès le premier tour, avec ${Math.round(mine.pct)} %.`;
    if (el.winner === S.me) return "";
    if (kept >= 3) return `Tu avais tenu ${kept} promesses sur ${n}. Ça n’a pas suffi : ${S.overton > 25 ? "le pays, lui, avait glissé ailleurs." : "être fidèle ne fait pas une majorité."}${out}`;
    let why = "Tes électeurs sont allés voir ailleurs.";
    if (el.winner === "RH" && S.overton > 25) why = "En reprenant ses idées, tu lui as ouvert la porte. Steeve Frontière t’a remercié dans son discours de victoire.";
    else if (el.winner === "RH") why = "Tu as écrasé la rue ; la peur a voté pour lui.";
    else if (el.winner === "HI") why = "Tes électeurs trahis sont partis plus à gauche, et la rue les a portés.";
    else if (el.winner === "CA") why = "Ta trahison a servi le candidat que tu combattais. L’extrême centre te remercie pour ce cadeau.";
    else if (el.winner === "VP") why = "Pendant que tu gérais l’urgence, l’urgence climatique a fait campagne pour les Verts.";
    return `Tu avais promis « ${broken ? broken.text : prog.name} » (${prog.emoji} ${prog.name}). Tu as tenu ${kept} promesse${kept > 1 ? "s" : ""} sur ${n}. ${why}${out}`;
  };
})();
