// Simulateur d'équilibrage : rejoue les règles de game.js sans interface, avec plusieurs profils de joueurs.
// À garder synchronisé avec game.js quand on change une règle (dérives, censure, fins).
// Usage : node tools/equilibrage.js [parties] [profil à tracer]
global.window = {};
require(__dirname + '/../content.js');
require(__dirname + '/../content-parlement.js');
const C = window.CONTENT;

const G = ["jeunes", "ouvriers", "retraites", "patrons", "police"];
const W = { jeunes: .22, ouvriers: .28, retraites: .30, patrons: .08, police: .12 };
const MAJ = 289, ECO_DRIFT = +(process.env.ECO_DRIFT || 8), USURE = +(process.env.USURE || 4);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const EV = {}; [...C.events, ...C.pool].forEach(e => { EV[e.id] = e; });

function game(strat) {
  const S = {
    week: 1, t: 0, g: { jeunes: 38, ouvriers: 32, retraites: 55, patrons: 62, police: 58 },
    ordre: 60, budget: 60, colere: 30, eco: 40, battery: 100, spent: 0, dead: false,
    rel: Object.fromEntries(C.groups.map(g => [g.id, g.rel])), laws: {}, n493: 0,
    flags: {}, stats: { blesses: 0, gav: 0, fuites: 0, ignores: 0, feries: 0, lois: 0 },
    poolUsed: {}, ending: null, log: [], altUsed: {}, alerts: {},
  };
  const val = x => (typeof x === "function" ? x(S) : x);
  const pop = () => G.reduce((s, k) => s + S.g[k] * W[k], 0);
  S.pop = pop;
  function apply(o) {
    if (!o) return;
    for (const [k, v] of Object.entries(o.fx || {})) {
      if (G.includes(k)) S.g[k] = cl(S.g[k] + v, 0, 100);
      else if (["ordre", "budget", "colere", "eco"].includes(k)) S[k] = cl(S[k] + v, 0, 100);
      else if (k in S.stats) S.stats[k] = Math.max(0, S.stats[k] + v);
    }
    for (const [g, v] of Object.entries(o.rel || {})) S.rel[g] = cl(S.rel[g] + v, 0, 100);
    Object.assign(S.flags, o.set || {});
  }
  function checkEnd() {
    if (S.colere >= 100 && S.ordre < 65) return "revolution";
    if (S.eco >= 100) return "effondrement";
    if (S.g.police <= 8) return "coup";
    if (S.budget <= 0) return "faillite";
    if (S.g.patrons <= 5) return "debranche";
    if (pop() <= 15) return "destitue";
    return null;
  }
  const end = id => { if (!S.ending) S.ending = id; };
  const battery = () => 100 - 14 * S.t - S.spent;
  function spend(x) { S.spent += x; if (battery() <= 0) S.dead = true; }

  function lawShares(L, instr, noise) {
    const st = val(L.st), fronde = cl((45 - pop()) / 80, 0, 0.3);
    let pour = 0, contre = 0;
    for (const g of C.groups) {
      let p = g.id === "CA" ? (instr === "pour" ? 0.78 + 0.22 * st.CA - fronde : 0.1 * st.CA + fronde)
        : st[g.id] + (S.rel[g.id] - 50) / (L.gov ? 250 : 450);
      if (noise) p += rnd(-0.08, 0.08);
      p = cl(p, 0, 1);
      const a = noise ? rnd(0.02, 0.1) : 0.06;
      const y = Math.round(g.seats * p * (1 - a)), ab = Math.min(g.seats - y, Math.round(g.seats * a));
      pour += y; contre += g.seats - y - ab;
    }
    return { pour, contre };
  }
  function censure(rel, n, noise) {
    const us = USURE * Math.pow(Math.max(0, n - 1), 1.5);
    let pour = 0;
    for (const g of C.groups) {
      let sh = g.id === "CA" ? 0 : 0.5 + (g.T + us - rel[g.id]) / 30;
      if (noise && g.id !== "CA") sh += rnd(-0.1, 0.1);
      pour += Math.round(g.seats * cl(sh, 0, 1));
    }
    return pour;
  }
  function predictCensure() {
    const rel = { ...S.rel };
    C.groups.forEach(g => { if (g.id !== "CA") rel[g.id] = cl(rel[g.id] - 5, 0, 100); });
    return censure(rel, S.n493 + 1, false);
  }
  S.api = { lawShares, predictCensure, val };

  const queue = []; // {w, at, fn}
  const leakQ = [];

  function runEvent(e) {
    if (e.alt && S.altUsed[e.alt]) return false;
    if (e.when && !e.when(S)) return false;
    if (e.alt) S.altUsed[e.alt] = true;
    const opts = e.c.map((c, i) => [c, i]).filter(([c]) => !c.when || c.when(S));
    let pick = S.dead ? null : strat.event(S, e, opts.map(o => o[0]));
    if (pick) {
      const ci = e.c.indexOf(pick);
      spend(e.call ? 8 + (pick.cost ?? 4) : (pick.cost ?? 8));
      apply(pick);
      if (pick.leak && Math.random() < pick.leak.p) {
        const L = pick.leak;
        if (L.soon || S.week >= 8) queue.push({ w: S.week, at: S.t + rnd(0.05, 0.12), fn: () => { S.stats.fuites++; apply({ fx: L.fx, rel: L.rel }); } });
        else queue.push({ w: S.week + 1, at: rnd(0.1, 0.6), fn: () => { S.stats.fuites++; apply({ fx: L.fx, rel: L.rel }); } });
      }
      if (pick.end) end(pick.end);
      S.log.push(`S${S.week} ${e.id}: ${pick.t}`);
    } else {
      S.stats.ignores++;
      apply(e.d);
      if (e.d && e.d.end) end(e.d.end);
      S.log.push(`S${S.week} ${e.id}: (ignoré)`);
    }
    return true;
  }

  function runLaw(L) {
    if (L.when && !L.when(S)) return;
    const st = S.laws[L.id] = { status: "pending", w: S.week };
    if (S.dead) return;
    const act = strat.law(S, L);
    if (!act) return;
    if (act === "493") {
      spend(8);
      S.n493++; st.status = "493";
      C.groups.forEach(g => { if (g.id !== "CA") S.rel[g.id] = cl(S.rel[g.id] - 5, 0, 100); });
      const y = val(L.yes) || {};
      const fx = { ...(y.fx || {}) }; fx.colere = (fx.colere || 0) + 4; fx.jeunes = (fx.jeunes || 0) - 2;
      apply({ ...y, fx });
      S.stats.lois++;
      queue.push({ w: S.week, at: S.t + 0.05, fn: () => { const c = censure(S.rel, S.n493, true); S.lastCensure = c; if (c >= MAJ) end("censure"); } });
      S.log.push(`S${S.week} ${L.id}: 49.3 (censure prévue ${predictCensure()})`);
      return;
    }
    if (act === "retirer") { spend(2); st.status = "retire"; apply(val(L.buried)); S.log.push(`S${S.week} ${L.id}: retiré`); return; }
    spend(5);
    const r = lawShares(L, act, true);
    const adopted = r.pour > r.contre;
    st.status = adopted ? "adopted" : "rejected";
    if (act === "contre" && L.against) apply(val(L.against));
    if (L.by !== "CA") S.rel[L.by] = cl(S.rel[L.by] + (act === "pour" ? 5 : -4), 0, 100);
    apply(val(adopted ? L.yes : L.no));
    if (adopted) S.stats.lois++;
    if (adopted && L.revoke && pop() < 42) end("revoque");
    S.log.push(`S${S.week} ${L.id}: ${act} → ${adopted ? "adoptée" : "rejetée"} ${r.pour}-${r.contre}`);
  }

  for (let w = 1; w <= 8 && !S.ending; w++) {
    S.week = w; S.t = 0; S.spent = 0; S.dead = false;
    const items = [];
    C.events.filter(e => e.w === w).forEach(e => items.push({ at: e.at, fn: () => runEvent(e) }));
    C.laws.filter(l => l.w === w).forEach(l => items.push({ at: l.at, fn: () => runLaw(l) }));
    if (w >= 2) {
      C.pool.filter(p => !S.poolUsed[p.id] && w >= (p.minW || 1)).sort(() => Math.random() - 0.5).slice(0, 2)
        .forEach(p => { S.poolUsed[p.id] = true; items.push({ at: rnd(0.15, 0.88), fn: () => { if (!runEvent(p)) S.poolUsed[p.id] = false; } }); });
    }
    queue.filter(q => q.w === w).forEach(q => items.push(q));
    // publication hebdo
    const post = strat.post && strat.post(S, C.posts[w]);
    if (post) items.push({ at: 0.5, fn: () => { if (!S.dead) { spend(6); apply({ fx: post.fx }); } } });
    items.sort((a, b) => a.at - b.at);
    for (let i = 0; i < items.length && !S.ending; i++) {
      const it = items[i];
      S.t = it.at;
      if (battery() <= 0) S.dead = true;
      it.fn();
      // les fuites ajoutées en cours de semaine
      const late = queue.filter(q => q.w === w && q.at > it.at && !items.includes(q));
      if (late.length) { late.forEach(q => items.push(q)); items.sort((a, b) => a.at - b.at); }
      for (const a of C.alerts) if (!S.alerts[a.id] && a.when(S)) { S.alerts[a.id] = true; runEvent(a); }
      const e = checkEnd(); if (e) end(e);
    }
    if (S.ending) break;
    // fin de semaine : textes expirés, dérives
    Object.entries(S.laws).forEach(([id, st]) => {
      if (st.status === "pending" && st.w < w) { st.status = "buried"; const L = C.laws.find(l => l.id === id); if (L.by !== "CA") S.rel[L.by] = cl(S.rel[L.by] - 3, 0, 100); apply(val(L.buried)); }
    });
    queue.filter(q => q.w === w && q.at >= 1).forEach(q => { q.w = w + 1; q.at = rnd(0.01, 0.3); });
    const avg = (S.g.jeunes + S.g.ouvriers) / 2;
    S.colere = cl(S.colere + cl(Math.round((40 - avg) * 0.15), -3, 5) - 3, 0, 100);
    if (S.colere >= 90) S.ordre -= 6;
    S.ordre = cl(Math.round(S.ordre + (50 - S.ordre) * 0.1), 0, 100);
    S.budget = cl(S.budget - 1, 0, 100);
    S.g.patrons = cl(Math.round(S.g.patrons + (45 - S.g.patrons) * 0.15), 0, 100);
    const UP = +(process.env.UP || 2);
    ["jeunes", "ouvriers", "retraites"].forEach(k => { S.g[k] = cl(S.g[k] - UP, 0, 100); });
    S.eco = cl(S.eco + ECO_DRIFT, 0, 100);
    const e = checkEnd(); if (e) end(e);
    if (process.env.TRACE) console.log(`  fin S${w} pop=${pop().toFixed(0)} colère=${S.colere} ordre=${S.ordre} caisses=${S.budget} éco=${S.eco} 49.3=${S.n493} rel=${JSON.stringify(S.rel)}`);
  }
  if (!S.ending) S.ending = pop() >= 45 ? "reelu" : "battu";
  return S;
}

// ------------------------------------------------------------------ profils de joueurs
const pickBy = (opts, score) => opts.reduce((a, c) => (score(c) > score(a) ? c : a), opts[0]);
const noEnd = opts => opts.filter(c => !c.end);
const fxOf = (o, S) => (o ? (typeof o === "function" ? o(S) : o) : {}) || {};

// score « raisonnable » d'un ensemble d'effets, selon l'état du pays
function smartScore(S, o, ecoW = 1) {
  const f = o.fx || {};
  let x = G.reduce((s, k) => s + (f[k] || 0) * W[k], 0);
  x += (f.patrons || 0) * (S.g.patrons < 30 ? .25 : .03) + (f.police || 0) * (S.g.police < 30 ? .2 : 0);
  x += (f.budget || 0) * (S.budget < 35 ? .4 : .12) - (f.colere || 0) * (S.colere > 60 ? .3 : .12);
  x += (f.ordre || 0) * (S.ordre < 40 ? .15 : 0) - (f.eco || 0) * ecoW * (S.eco > 60 ? .35 : .15);
  for (const [g, v] of Object.entries(o.rel || {})) x += v * (g === "RH" || g === "PP" ? 0.04 : 0.02);
  return x;
}

function lawDecision(S, L, scoreFn, allow493 = true) {
  const { lawShares, predictCensure, val } = S.api;
  const yes = fxOf(L.yes, S), no = fxOf(L.no, S);
  const gain = scoreFn(yes) - scoreFn(no);
  if (L.gov) {
    if (L.revoke) return "contre";
    if (gain <= 0) return "retirer";
    const r = lawShares(L, "pour", false);
    if (r.pour - r.contre > 15) return "pour";
    if (allow493 && predictCensure() < MAJ - 25) return "493";
    return "pour";
  }
  if (L.revoke) return "contre";
  return gain > 0 ? "pour" : "contre";
}

const STRATS = {
  // joue au hasard, n'ignore presque rien
  hasard: {
    event: (S, e, o) => (Math.random() < 0.12 ? null : (() => { const a = Math.random() < 0.9 ? noEnd(o) : o; return a[Math.floor(Math.random() * a.length)] || o[0]; })()),
    law: (S, L) => (Math.random() < 0.15 ? null : L.gov ? ["pour", "493", "retirer"][Math.floor(Math.random() * 3)] : Math.random() < 0.5 ? "pour" : "contre"),
    post: (S, p) => (Math.random() < 0.5 ? p[Math.floor(Math.random() * 3)] : null),
  },
  // l'ordre avant tout, vote avec la droite, 49.3 à volonté
  repressif: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => (c.fx?.ordre || 0) + (c.fx?.police || 0) * 0.5),
    law: (S, L) => L.gov ? (S.api.lawShares(L, "pour", false).pour > 300 ? "pour" : "493") : ["RH", "DP"].includes(L.by) ? "pour" : "contre",
    post: (S, p) => pickBy(p, c => (c.fx?.police || 0)),
  },
  // cède à tout, vote avec la gauche et les écolos, jamais de 49.3
  social: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => -(c.fx?.colere || 0) + (c.fx?.ouvriers || 0) * 0.3),
    law: (S, L) => L.gov ? (L.id === "l_retraite" || L.id === "l_immigration" ? "retirer" : "pour") : ["HI", "VP", "PP"].includes(L.by) && !L.revoke ? "pour" : "contre",
    post: (S, p) => pickBy(p, c => -(c.fx?.colere || 0)),
  },
  // joueur réfléchi : pèse tout, y compris le climat et les alliances
  stratege: {
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0) - (c.cost ?? 8) * 0.02),
    law: (S, L) => lawDecision(S, L, o => smartScore(S, o)),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
  // stratège qui ignore complètement le climat
  climatosceptique: {
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c, 0) - (c.leak ? c.leak.p * 6 : 0)),
    law: (S, L) => lawDecision(S, L, o => smartScore(S, o, 0)),
    post: (S, p) => pickBy(p, c => smartScore(S, c, 0)),
  },
  // bon sur les messages, mais n'ouvre jamais l'appli Assemblée
  sansAssemblee: {
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0)),
    law: () => null,
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
  // joueur humain moyen : souvent raisonnable, parfois impulsif, parfois débordé
  moyen: {
    event: (S, e, o) => { const r = Math.random(); if (r < 0.15) return null; const a = noEnd(o); if (r < 0.4) return a[Math.floor(Math.random() * a.length)]; return pickBy(a, c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0)); },
    law: (S, L) => { const r = Math.random(); if (r < 0.15) return null; if (r < 0.4) return L.gov ? ["pour", "493"][Math.floor(Math.random() * 2)] : Math.random() < 0.5 ? "pour" : "contre"; return lawDecision(S, L, o => smartScore(S, o)); },
    post: (S, p) => (Math.random() < 0.6 ? p[Math.floor(Math.random() * 3)] : null),
  },
  // social, mais écoute les alertes (patrons, caisses) comme le ferait un humain
  socialLucide: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => -(c.fx?.colere || 0) + (c.fx?.ouvriers || 0) * 0.3
      + (S.g.patrons < 25 ? (c.fx?.patrons || 0) * 1.2 : 0) + (S.budget < 25 ? (c.fx?.budget || 0) * 1 : 0)),
    law: (S, L) => {
      const y = fxOf(L.yes, S).fx || {};
      if (L.gov) return L.id === "l_retraite" || L.id === "l_immigration" ? "retirer" : (L.id === "l_budget" && S.api.predictCensure() < MAJ - 25 ? "493" : "pour");
      if (L.revoke) return "contre";
      if (S.g.patrons < 25 && (y.patrons || 0) < -5) return "contre";
      if (S.budget < 25 && (y.budget || 0) < -4) return "contre";
      return ["HI", "VP", "PP"].includes(L.by) ? "pour" : "contre";
    },
    post: (S, p) => pickBy(p, c => -(c.fx?.colere || 0)),
  },
  // 49.3 systématique, mais en ménageant le RH (pacte, vote de ses textes)
  accro493RH: {
    event: (S, e, o) => e.id === "w2_frontiere" ? o[0] : pickBy(noEnd(o), c => smartScore(S, c) + (c.rel?.RH || 0) * 0.3 - (c.leak ? c.leak.p * 6 : 0)),
    law: (S, L) => (L.gov ? "493" : L.by === "RH" ? "pour" : lawDecision(S, L, o => smartScore(S, o))),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
  // dégaine le 49.3 sur chaque texte du gouvernement
  accro493: {
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0)),
    law: (S, L) => (L.gov ? "493" : lawDecision(S, L, o => smartScore(S, o))),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
};

const N = +(process.argv[2] || 3000);
const trace = process.argv[3];
if (trace) {
  process.env.TRACE = 1;
  const S = game(STRATS[trace]);
  console.log(S.log.join("\n"));
  console.log("FIN :", S.ending, "pop", S.pop().toFixed(0), "éco", S.eco, "49.3", S.n493);
  process.exit();
}
console.log(`${N} parties par profil · dérive éco ${ECO_DRIFT}/sem · usure 49.3 ${USURE}\n`);
for (const [name, st] of Object.entries(STRATS)) {
  const res = {}, wk = {};
  let pop = 0, eco = 0, n493 = 0, fu = 0;
  for (let i = 0; i < N; i++) {
    const S = game(st);
    res[S.ending] = (res[S.ending] || 0) + 1;
    wk[S.ending] = (wk[S.ending] || 0) + S.week;
    pop += S.pop(); eco += S.eco; n493 += S.n493; fu += S.stats.fuites;
  }
  const line = Object.entries(res).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${(100 * v / N).toFixed(0)}%${k === "reelu" || k === "battu" ? "" : ` (S${(wk[k] / v).toFixed(1)})`}`).join(" · ");
  console.log(`${name.padEnd(16)} ${line}`);
  console.log(`${"".padEnd(16)} pop moy ${(pop / N).toFixed(0)} · éco ${(eco / N).toFixed(0)} · 49.3 ${(n493 / N).toFixed(1)} · fuites ${(fu / N).toFixed(1)}`);
}
