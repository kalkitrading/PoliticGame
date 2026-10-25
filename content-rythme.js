// Ne Pas Déranger — le rythme : un mandat en 6 semaines au lieu de 8.
// Le contenu reste écrit en 8 « semaines d'écriture » ; ce fichier les replie en 6 semaines de jeu.
// Les semaines 4 et 5 deviennent une seule semaine (le scandale tombe en plein milieu, comme un rebondissement),
// les semaines 7 et 8 aussi (l'ultimatum, puis le verdict). La Pente passe aux semaines 7 à 10.
// Chargé en dernier, juste avant game.js (et par le simulateur).

(() => {
  const C = window.CONTENT;
  C.lastWeek = 6;
  C.weekScale = 8 / 6; // les dérives hebdomadaires sont renforcées d'autant
  // semaine d'écriture → [semaine de jeu, début, fin] dans la semaine de jeu
  const MAP = {
    1: [1, 0, 1], 2: [2, 0, 1], 3: [3, 0, 1], 4: [4, 0, 0.5], 5: [4, 0.5, 1], 6: [5, 0, 1], 7: [6, 0, 0.55], 8: [6, 0.55, 1],
    9: [7, 0, 1], 10: [8, 0, 1], 11: [9, 0, 1], 12: [10, 0, 1],
  };
  const remap = o => {
    const m = o && MAP[o.w];
    if (!m) return;
    const [w, a, b] = m;
    o.w = w;
    o.at = a + (o.at ?? 0) * (b - a);
  };
  [...C.events, ...C.laws, ...C.citizenPosts, ...(C.decrees || [])].forEach(remap);
  // les événements aléatoires : même seuil, en semaines de jeu
  C.pool.forEach(p => { if (p.minW) p.minW = MAP[p.minW] ? MAP[p.minW][0] : p.minW; });
  C.penteLastWeek = 10;

  // les titres : une semaine fusionnée garde le premier titre, et annonce le second en plein milieu
  const fold = (A, B, midAt) => ({ ...A, agenda: [A.agenda[0], B.agenda[0]], mid: B.title, midAt });
  const weeks = C.weeks;
  C.weeks = {
    1: weeks[1], 2: weeks[2], 3: weeks[3], 4: fold(weeks[4], weeks[5], 0.5), 5: weeks[6], 6: fold(weeks[7], weeks[8], 0.55),
    7: weeks[9], 8: weeks[10], 9: weeks[11], 10: weeks[12],
  };
  for (const [prog, wb] of Object.entries(C.weeksBy || {})) {
    const at = w => ({ ...weeks[w], ...(wb[w] || {}) });
    C.weeksBy[prog] = {
      1: at(1), 2: at(2), 3: at(3), 4: fold(at(4), at(5), 0.5), 5: at(6), 6: fold(at(7), at(8), 0.55),
    };
  }
  // tes publications : une par semaine de jeu (semaine 4 : le déluge ; semaine 6 : le jour du vote)
  const foldPosts = P => P && [null, P[1], P[2], P[3], P[4], P[6], P[8]];
  C.posts = Object.assign(foldPosts(C.posts), { 7: C.posts[9], 8: C.posts[10], 9: C.posts[11], 10: C.posts[12] });
  for (const prog of Object.keys(C.postsBy || {})) C.postsBy[prog] = foldPosts(C.postsBy[prog]);
})();
