// Simulateur d'équilibrage : rejoue les règles de game.js sans interface, avec plusieurs profils de joueurs.
// À garder synchronisé avec game.js quand on change une règle (dérives, censure, fins).
// Usage : node tools/equilibrage.js [parties] [profil à tracer] [programme]
global.window = {};
require(__dirname + '/../content.js');
require(__dirname + '/../content-parlement.js');
require(__dirname + '/../content-citoyens.js');
require(__dirname + '/../content-programmes.js');
require(__dirname + '/../content-gouvernements.js');
require(__dirname + '/../content-coupsbas.js');
require(__dirname + '/../content-pente.js');
require(__dirname + '/../content-gauche.js');
require(__dirname + '/../content-verts.js');
require(__dirname + '/../content-droite.js');
require(__dirname + '/../content-rh.js');
const C = window.CONTENT;

const G = ["jeunes", "ouvriers", "retraites", "patrons", "police"];
const W = { jeunes: .22, ouvriers: .28, retraites: .30, patrons: .08, police: .12 };
const MAJ = 289, ECO_DRIFT = +(process.env.ECO_DRIFT || 8), USURE = +(process.env.USURE || 4);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const EV = {}; [...C.events, ...C.pool].forEach(e => { EV[e.id] = e; });
// même logique que pv() / ovShift() dans game.js : la version d'un contenu propre au programme
const pvOf = (S, o) => (o && o.variants && o.variants[S.programme] ? { ...o, ...o.variants[S.programme] } : o);
const ovOf = (e, ci) => (e.ov === false ? 0 : C.ovEvent(e.id, ci));

function game(strat, progId = "centre") {
  // même initialisation que newState() dans game.js
  const prog = C.programmes.find(p => p.id === progId);
  const me = prog.group;
  const seats = Object.fromEntries(C.groups.map(g => [g.id, g.seats]));
  if (me !== "CA") { seats.CA = seats[me]; seats[me] = 168; }
  const g0 = { jeunes: 38, ouvriers: 32, retraites: 55, patrons: 62, police: 58 };
  for (const [k, v] of Object.entries(prog.start.g)) g0[k] = cl(g0[k] + v, 0, 100);
  const rel0 = Object.fromEntries(C.groups.map(x => [x.id, x.rel]));
  Object.assign(rel0, prog.start.rel);
  rel0[me] = 90;
  if (me !== "CA" && !("CA" in prog.start.rel)) rel0.CA = 40;
  const S = {
    programme: progId, me, seats, overton: prog.overton,
    image: Object.fromEntries(C.groups.map(x => [x.id, 0])),
    week: 1, t: 0, g: g0,
    ordre: 60, budget: 68, colere: 30, eco: 40, battery: 100, spent: 0, dead: false,
    rel: rel0, laws: {}, n493: 0,
    flags: { ...(prog.flags || {}) }, stats: { blesses: 0, gav: 0, fuites: 0, ignores: 0, feries: 0, lois: 0 },
    poolUsed: {}, ending: null, log: [], altUsed: {}, alerts: {}, dnd: false, dndN: 0, dndUsed: {},
  };
  const val = x => (typeof x === "function" ? x(S) : x);
  const pop = () => G.reduce((s, k) => s + S.g[k] * W[k], 0);
  S.pop = pop;
  function apply(o) {
    if (!o) return;
    for (const [k, v] of Object.entries(val(o.fx) || {})) {
      if (G.includes(k)) S.g[k] = cl(S.g[k] + v, 0, 100);
      else if (k === "overton") S.overton = cl(S.overton + v, -100, 100);
      else if (["ordre", "budget", "colere", "eco"].includes(k)) S[k] = cl(S[k] + v, 0, 100);
      else if (k in S.stats) S.stats[k] = Math.max(0, S.stats[k] + v);
    }
    for (const [g, v] of Object.entries(val(o.rel) || {})) S.rel[g] = cl(S.rel[g] + v, 0, 100);
    for (const [g, v] of Object.entries(val(o.image) || {})) { const id = g === "me" ? S.me : g; S.image[id] = (S.image[id] || 0) + v; }
    Object.assign(S.flags, o.set || {});
  }
  function checkEnd() {
    if (S.colere >= 100 && S.ordre < 65) return "revolution";
    if (S.g.police <= 8) return "coup";
    if (S.budget <= 0) return "faillite";
    if (S.g.patrons <= 5 && !S.flags.controleCapitaux) return "debranche";   // le contrôle des capitaux coupe la prise
    if (pop() <= 15) return "destitue";
    return null;
  }
  const end = id => { if (!S.ending) S.ending = id; };
  const shift = v => { if (v) S.overton = cl(S.overton + v, -100, 100); };
  const byOf = L => val(L.by);
  const isGov = L => byOf(L) === S.me;
  const battery = () => (S.dnd ? 100 : 100 - 14 * S.t - S.spent);
  function spend(x) { S.spent += x; if (battery() <= 0) S.dead = true; }

  function lawShares(L, instr, noise) {
    const broken = C.promiseStates(S).filter(p => p.st === "broken").length;
    const st = val(L.st), fronde = cl((45 - pop()) / 80, 0, 0.3) + broken * 0.04 + (S.flags.frondeDure ? 0.1 : 0);
    let pour = 0, contre = 0;
    for (const g of C.groups) {
      let p = g.id === S.me ? (instr === "pour" ? 0.78 + 0.22 * st[g.id] - fronde : 0.1 * st[g.id] + fronde)
        : st[g.id] + (S.rel[g.id] - 50) / (isGov(L) ? 250 : 450);
      if (noise) p += rnd(-0.08, 0.08);
      p = cl(p, 0, 1);
      const a = noise ? rnd(0.02, 0.1) : 0.06;
      const n = S.seats[g.id];
      const y = Math.round(n * p * (1 - a)), ab = Math.min(n - y, Math.round(n * a));
      pour += y; contre += n - y - ab;
    }
    return { pour, contre };
  }
  function censure(rel, n, noise) {
    const us = USURE * Math.pow(Math.max(0, n - 1), 1.5);
    let pour = 0;
    for (const g of C.groups) {
      let sh = g.id === S.me ? 0 : 0.5 + (g.T + us - rel[g.id]) / 30;
      if (noise && g.id !== S.me) sh += rnd(-0.1, 0.1);
      pour += Math.round(S.seats[g.id] * cl(sh, 0, 1));
    }
    return pour;
  }
  function predictCensure() {
    const rel = { ...S.rel };
    C.groups.forEach(g => { if (g.id !== S.me) rel[g.id] = cl(rel[g.id] - 5, 0, 100); });
    return censure(rel, S.n493 + 1, false);
  }
  S.api = { lawShares, predictCensure, val, isGov };
  function ministersDecide(L) {
    S.dndN++;
    const hawk = !S.flags.lebatonVire;
    if (L.revoke) return "contre";
    if (isGov(L)) { const r = lawShares(L, "pour", false); return r.pour > r.contre || !hawk ? "pour" : "493"; }
    return (hawk ? ["RH", "DP"] : ["VP", "PP", "HI"]).includes(byOf(L)) ? "pour" : "contre";
  }
  function ministerAct() {
    let list = C.dndActs.filter(a => (!a.when || a.when(S)) && !S.dndUsed[a.id]);
    if (!list.length) { S.dndUsed = {}; list = C.dndActs.filter(a => !a.when || a.when(S)); }
    const a = pvOf(S, list[Math.floor(Math.random() * list.length)]);
    S.dndUsed[a.id] = true; S.dndN++;
    apply({ fx: a.fx });
  }

  const queue = []; // {w, at, fn}
  const leakQ = [];

  function runEvent(e0) {
    const e = pvOf(S, e0);
    if (e.alt && S.altUsed[e.alt]) return false;
    if (e.when && !e.when(S)) return false;
    if (e.alt) S.altUsed[e.alt] = true;
    const opts = e.c.map((c, i) => [c, i]).filter(([c]) => !c.when || c.when(S));
    let pick = S.dead || S.dnd ? null : strat.event(S, e, opts.map(o => o[0]));
    if (S.dnd) S.dndN++;
    if (pick) {
      const ci = e.c.indexOf(pick);
      spend(e.call ? 8 + (pick.cost ?? 4) : (pick.cost ?? 8));
      apply(pick);
      shift(ovOf(e, ci));
      if (pick.leak && Math.random() < pick.leak.p) {
        const L = pick.leak;
        if (L.soon || S.week >= 8) queue.push({ w: S.week, at: S.t + rnd(0.05, 0.12), fn: () => { S.stats.fuites++; apply({ fx: L.fx, rel: L.rel, image: L.image }); } });
        else queue.push({ w: S.week + 1, at: rnd(0.1, 0.6), fn: () => { S.stats.fuites++; apply({ fx: L.fx, rel: L.rel, image: L.image }); } });
      }
      if (pick.end) end(pick.end);
      S.log.push(`S${S.week} ${e.id}: ${pick.t}`);
    } else {
      S.stats.ignores++;
      apply(e.d);
      shift(ovOf(e, "d"));
      if (e.d && e.d.end) end(e.d.end);
      S.log.push(`S${S.week} ${e.id}: (ignoré)`);
    }
    return true;
  }

  function runLaw(L) {
    if (L.when && !L.when(S)) return;
    const st = S.laws[L.id] = { status: "pending", w: S.week };
    if (S.dead && !S.dnd) return;
    const act = S.dnd ? ministersDecide(L) : strat.law(S, L);
    if (!act) return;
    if (act === "493") {
      if (!isGov(L)) return;
      spend(8);
      S.n493++; st.status = "493";
      shift((C.overtonMap.laws[L.id] || 0) + C.overtonMap.use493);
      C.groups.forEach(g => { if (g.id !== S.me) S.rel[g.id] = cl(S.rel[g.id] - 5, 0, 100); });
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
    st.instr = act;
    if (act === "contre" && L.against) apply(val(L.against));
    if (byOf(L) !== S.me) S.rel[byOf(L)] = cl(S.rel[byOf(L)] + (act === "pour" ? 5 : -4), 0, 100);
    apply(val(adopted ? L.yes : L.no));
    if (adopted) { S.stats.lois++; shift(C.overtonMap.laws[L.id]); }
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
    C.citizenPosts.filter(p => p.w === w).map(p => pvOf(S, p)).forEach(p => items.push({ at: p.at, fn: () => { if (!p.when || p.when(S)) apply({ fx: p.fx, set: p.set }); } }));
    S.dnd = false;
    if (strat.dndFrom != null) {
      items.push({ at: strat.dndFrom, fn: () => {
        S.dnd = true;
        // les textes en attente passent aux ministres
        Object.entries(S.laws).forEach(([id, st]) => { if (st.status === "pending") { st.status = "x"; const L = C.laws.find(l => l.id === id); delete S.laws[id]; runLaw(L); } });
      } });
      for (let t = strat.dndFrom + rnd(0.03, 0.06); t < 1; t += rnd(0.07, 0.11)) items.push({ at: t, fn: () => { if (S.dnd) ministerAct(); } });
    }
    // publication hebdo
    const post = strat.post && strat.post(S, ((C.postsBy && C.postsBy[S.programme]) || {})[w] || C.posts[w]);
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
      for (const a of C.alerts) if (!S.dnd && !S.alerts[a.id] && a.when(S)) { S.alerts[a.id] = true; runEvent(a); }
      const e = checkEnd(); if (e) end(e);
    }
    if (S.ending) break;
    // fin de semaine : textes expirés, dérives
    Object.entries(S.laws).forEach(([id, st]) => {
      if (st.status === "pending" && st.w < w) { st.status = "buried"; const L = C.laws.find(l => l.id === id); if (byOf(L) !== S.me) S.rel[byOf(L)] = cl(S.rel[byOf(L)] - 3, 0, 100); apply(val(L.buried)); }
    });
    queue.filter(q => q.w === w && q.at >= 1).forEach(q => { q.w = w + 1; q.at = rnd(0.01, 0.3); });
    const avg = (S.g.jeunes + S.g.ouvriers) / 2;
    S.colere = cl(S.colere + cl(Math.round((40 - avg) * 0.15), -3, 5) - 3, 0, 100);
    shift(C.overtonMap.weekly);
    if (S.colere >= 90) S.ordre -= 6;
    S.ordre = cl(Math.round(S.ordre + (50 - S.ordre) * 0.1), 0, 100);
    S.budget = cl(S.budget - 1, 0, 100);
    S.g.patrons = cl(Math.round(S.g.patrons + (45 - S.g.patrons) * 0.15), 0, 100);
    S.g.police = cl(Math.round(S.g.police + (45 - S.g.police) * 0.12), 0, 100);
    const UP = +(process.env.UP || 2);
    ["jeunes", "ouvriers", "retraites"].forEach(k => { S.g[k] = cl(S.g[k] - UP, 0, 100); });
    S.eco = cl(S.eco + ECO_DRIFT, 0, 100);
    const e = checkEnd(); if (e) end(e);
    if (process.env.TRACE) console.log(`  fin S${w} pop=${pop().toFixed(0)} colère=${S.colere} ordre=${S.ordre} caisses=${S.budget} éco=${S.eco} 49.3=${S.n493} rel=${JSON.stringify(S.rel)}`);
  }
  if (!S.ending && S.flags.pente) S.ending = "dictateur"; // La Pente n'est pas simulée
  if (!S.ending) {
    const el = C.election(S, { noise: 0.06, atEnd: true });
    S.el = el;
    S.ending = el.winner === S.me ? "reelu" : `win_${el.winner}`;
  }
  return S;
}

// ------------------------------------------------------------------ profils de joueurs
const pickBy = (opts, score) => opts.reduce((a, c) => (score(c) > score(a) ? c : a), opts[0]);
const noEnd = opts => opts.filter(c => !c.end);
const fxOf = (o, S) => (o ? (typeof o === "function" ? o(S) : o) : {}) || {};

// score « raisonnable » d'un ensemble d'effets, selon l'état du pays
function smartScore(S, o, ecoW = 1) {
  const f = (typeof o.fx === "function" ? o.fx(S) : o.fx) || {};
  let x = G.reduce((s, k) => s + (f[k] || 0) * W[k], 0);
  x += (f.patrons || 0) * (S.g.patrons < 35 ? .3 : .03) + (f.police || 0) * (S.g.police < 35 ? .25 : 0);
  x += (f.budget || 0) * (S.budget < 35 ? .4 : .12) - (f.colere || 0) * (S.colere > 60 ? .3 : .12);
  x += (f.ordre || 0) * (S.ordre < 40 ? .15 : 0) - (f.eco || 0) * ecoW * (S.eco > 60 ? .35 : .15);
  for (const [g, v] of Object.entries((typeof o.rel === "function" ? o.rel(S) : o.rel) || {})) x += v * (g === "RH" || g === "PP" ? 0.04 : 0.02);
  // coups bas : salir un adversaire rapporte, se salir soi-même coûte
  for (const [g, v] of Object.entries((typeof o.image === "function" ? o.image(S) : o.image) || {})) x += (g === "me" || g === S.me ? 0.5 : -0.15) * v;
  return x;
}

function lawDecision(S, L, scoreFn, allow493 = true) {
  const { lawShares, predictCensure, val } = S.api;
  const yes = fxOf(L.yes, S), no = fxOf(L.no, S);
  const gain = scoreFn(yes) - scoreFn(no);
  if (S.api.isGov(L)) {
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
    law: (S, L) => (Math.random() < 0.15 ? null : S.api.isGov(L) ? ["pour", "493", "retirer"][Math.floor(Math.random() * 3)] : Math.random() < 0.5 ? "pour" : "contre"),
    post: (S, p) => (Math.random() < 0.5 ? p[Math.floor(Math.random() * 3)] : null),
  },
  // l'ordre avant tout, vote avec la droite, 49.3 à volonté
  repressif: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => (c.fx?.ordre || 0) + (c.fx?.police || 0) * 0.5),
    law: (S, L) => S.api.isGov(L) ? (S.api.lawShares(L, "pour", false).pour > 300 ? "pour" : "493") : ["RH", "DP"].includes(S.api.val(L.by)) ? "pour" : "contre",
    post: (S, p) => pickBy(p, c => (c.fx?.police || 0)),
  },
  // cède à tout, vote avec la gauche et les écolos, jamais de 49.3
  social: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => -(c.fx?.colere || 0) + (c.fx?.ouvriers || 0) * 0.3),
    law: (S, L) => S.api.isGov(L) ? (L.id === "l_retraite" || L.id === "l_immigration" ? "retirer" : "pour") : ["HI", "VP", "PP"].includes(S.api.val(L.by)) && !L.revoke ? "pour" : "contre",
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
    law: (S, L) => { const r = Math.random(); if (r < 0.15) return null; if (r < 0.4) return S.api.isGov(L) ? ["pour", "493"][Math.floor(Math.random() * 2)] : Math.random() < 0.5 ? "pour" : "contre"; return lawDecision(S, L, o => smartScore(S, o)); },
    post: (S, p) => (Math.random() < 0.6 ? p[Math.floor(Math.random() * 3)] : null),
  },
  // joueur moyen qui passe la seconde moitié de chaque semaine en Ne pas déranger
  dormeur: {
    dndFrom: 0.5,
    event: (S, e, o) => { const r = Math.random(); if (r < 0.15) return null; const a = noEnd(o); if (r < 0.4) return a[Math.floor(Math.random() * a.length)]; return pickBy(a, c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0)); },
    law: (S, L) => { const r = Math.random(); if (r < 0.15) return null; if (r < 0.4) return S.api.isGov(L) ? ["pour", "493"][Math.floor(Math.random() * 2)] : Math.random() < 0.5 ? "pour" : "contre"; return lawDecision(S, L, o => smartScore(S, o)); },
    post: (S, p) => (Math.random() < 0.6 ? p[Math.floor(Math.random() * 3)] : null),
  },
  // stratège qui s'accorde une pause en fin de semaine
  strategeFatigue: {
    dndFrom: 0.8,
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0) - (c.cost ?? 8) * 0.02),
    law: (S, L) => lawDecision(S, L, o => smartScore(S, o)),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
  // social, mais écoute les alertes (patrons, caisses) comme le ferait un humain
  socialLucide: {
    event: (S, e, o) => pickBy(noEnd(o).length ? noEnd(o) : o, c => -(c.fx?.colere || 0) + (c.fx?.ouvriers || 0) * 0.3
      + (S.g.patrons < 25 ? (c.fx?.patrons || 0) * 1.2 : 0) + (S.budget < 25 ? (c.fx?.budget || 0) * 1 : 0)),
    law: (S, L) => {
      const y = fxOf(L.yes, S).fx || {};
      if (S.api.isGov(L)) return L.id === "l_retraite" || L.id === "l_immigration" ? "retirer" : (L.id === "l_budget" && S.api.predictCensure() < MAJ - 25 ? "493" : "pour");
      if (L.revoke) return "contre";
      if (S.g.patrons < 25 && (y.patrons || 0) < -5) return "contre";
      if (S.budget < 25 && (y.budget || 0) < -4) return "contre";
      return ["HI", "VP", "PP"].includes(S.api.val(L.by)) ? "pour" : "contre";
    },
    post: (S, p) => pickBy(p, c => -(c.fx?.colere || 0)),
  },
  // 49.3 systématique, mais en ménageant le RH (pacte, vote de ses textes)
  accro493RH: {
    event: (S, e, o) => e.id === "w2_frontiere" ? o[0] : pickBy(noEnd(o), c => smartScore(S, c) + (c.rel?.RH || 0) * 0.3 - (c.leak ? c.leak.p * 6 : 0)),
    law: (S, L) => (S.api.isGov(L) ? "493" : S.api.val(L.by) === "RH" ? "pour" : lawDecision(S, L, o => smartScore(S, o))),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
  // dégaine le 49.3 sur chaque texte du gouvernement
  accro493: {
    event: (S, e, o) => pickBy(noEnd(o), c => smartScore(S, c) - (c.leak ? c.leak.p * 6 : 0)),
    law: (S, L) => (S.api.isGov(L) ? "493" : lawDecision(S, L, o => smartScore(S, o))),
    post: (S, p) => pickBy(p, c => smartScore(S, c)),
  },
};

// ------------------------------------------------------------------ profils liés au programme
// lois que chaque programme veut voir passer (fav) ou échouer (anti)
const AGENDA = {
  social: { dir: -1, fav: ["l_smic", "l_regul", "l_jets", "l_renov", "l_climat_urgence", "l_budget", "l_kerosene"], anti: ["l_retraite", "l_heritage", "l_preference", "l_permis", "l_mur", "l_immigration"] },
  climat: { dir: -1, fav: ["l_jets", "l_renov", "l_kerosene", "l_climat_urgence", "l_budget", "l_climat_raisonnable"], anti: ["l_mur", "l_heritage", "l_preference", "l_permis"] },
  liberal: { dir: 0.6, fav: ["l_retraite", "l_heritage", "l_budget", "l_immigration", "l_climat_raisonnable"], anti: ["l_smic", "l_kerosene", "l_regul", "l_jets", "l_preference", "l_mur"] },
  ordre: { dir: 1, fav: ["l_preference", "l_mur", "l_permis", "l_immigration", "l_budget", "l_renov"], anti: ["l_regul", "l_smic", "l_jets", "l_kerosene", "l_revocation"] },
  centre: { dir: 0, fav: ["l_budget", "l_retraite", "l_climat_raisonnable", "l_feries", "l_renov", "l_jets"], anti: ["l_preference", "l_mur", "l_permis", "l_revocation", "l_heritage"] },
};
// direction d'une trahison : -1 vers la gauche, +1 vers la droite, 0 vers le centre libéral
const TRAHISON = {
  droite: { fav: ["l_preference", "l_immigration", "l_mur", "l_permis", "l_retraite", "l_heritage", "l_budget"], anti: ["l_smic", "l_regul", "l_jets", "l_renov", "l_kerosene", "l_climat_urgence"], dir: 1 },
  centre: { fav: ["l_retraite", "l_heritage", "l_budget", "l_climat_raisonnable", "l_feries"], anti: ["l_smic", "l_regul", "l_preference", "l_mur", "l_kerosene", "l_climat_urgence"], dir: 0 },
};

function agendaLaw(S, L, ag) {
  if (L.revoke) return "contre";
  const gov = S.api.isGov(L);
  if (ag.fav.includes(L.id)) {
    if (!gov) return "pour";
    const r = S.api.lawShares(L, "pour", false);
    if (r.pour - r.contre > 15) return "pour";
    return S.api.predictCensure() < MAJ - 25 ? "493" : "pour";
  }
  if (ag.anti.includes(L.id)) return gov ? "retirer" : "contre";
  return lawDecision(S, L, o => smartScore(S, o));
}
const agendaEvent = (ag, dirW) => (S, e, o) => pickBy(noEnd(o), c => {
  const fx = (typeof c.fx === "function" ? c.fx(S) : c.fx) || {};
  const ov = ovOf(e, e.c.indexOf(c)) + (fx.overton || 0);
  const pull = ag.dir === 0 ? -Math.abs(ov) * dirW : ov * ag.dir * dirW;
  return smartScore(S, c) + pull - (c.leak ? c.leak.p * 6 : 0);
});

const PROFILS = {
  // tient son programme et pèse le reste
  fidele: prog => ({ event: agendaEvent(AGENDA[prog], 0.35), law: (S, L) => agendaLaw(S, L, AGENDA[prog]), post: (S, p) => pickBy(p, c => smartScore(S, c)) }),
  // joueur moyen : son programme quand il y pense
  moyen: prog => ({
    event: (S, e, o) => { const r = Math.random(); if (r < 0.15) return null; const a = noEnd(o); if (r < 0.4) return a[Math.floor(Math.random() * a.length)]; return agendaEvent(AGENDA[prog], 0.2)(S, e, o); },
    law: (S, L) => { const r = Math.random(); if (r < 0.15) return null; if (r < 0.35) return S.api.isGov(L) ? ["pour", "493"][Math.floor(Math.random() * 2)] : Math.random() < 0.5 ? "pour" : "contre"; return agendaLaw(S, L, AGENDA[prog]); },
    post: (S, p) => (Math.random() < 0.6 ? p[Math.floor(Math.random() * 3)] : null),
  }),
  // trahit en glissant vers la droite dure
  traitreDroite: () => ({ event: agendaEvent(TRAHISON.droite, 0.5), law: (S, L) => agendaLaw(S, L, TRAHISON.droite), post: (S, p) => pickBy(p, c => smartScore(S, c)) }),
  // trahit vers le centre libéral
  traitreCentre: () => ({ event: agendaEvent(TRAHISON.centre, 0.3), law: (S, L) => agendaLaw(S, L, TRAHISON.centre), post: (S, p) => pickBy(p, c => smartScore(S, c)) }),
  // ne fait rien de son programme et laisse la rue monter
  immobile: () => ({
    event: (S, e, o) => pickBy(noEnd(o), c => -(c.fx?.colere || 0) * -0.5 - (c.cost ?? 8) * 0.3 - Math.abs(ovOf(e, e.c.indexOf(c))) * 0.3 - (c.fx?.gav ? 3 : 0)),
    law: (S, L) => (L.revoke ? "contre" : S.api.isGov(L) ? "retirer" : null),
    post: () => null,
  }),
};

const N = +(process.argv[2] || 3000);
const trace = process.argv[3];
const progArg = process.argv[4] || "centre";
if (trace) {
  process.env.TRACE = 1;
  const S = game(STRATS[trace] || PROFILS[trace](progArg), progArg);
  if (S.el) console.log("1er tour :", S.el.r1.map(c => `${c.id} ${c.pct.toFixed(0)}`).join(" "), "| 2nd :", S.el.r2.map(c => `${c.id} ${c.pct.toFixed(0)}`).join(" "), "| Overton", S.overton, "| fidélité", S.el.fidelity);
  console.log(S.log.join("\n"));
  console.log("FIN :", S.ending, "pop", S.pop().toFixed(0), "éco", S.eco, "49.3", S.n493);
  process.exit();
}
const fmt = (res, wk, n) => Object.entries(res).sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `${k} ${(100 * v / n).toFixed(0)}%${k === "reelu" || k.startsWith("win_") ? "" : ` (S${(wk[k] / v).toFixed(1)})`}`).join(" · ");

if (process.env.MATRICE !== "0") {
  console.log(`${N} parties par programme et par profil\n`);
  for (const prog of C.programmes.map(p => p.id)) {
    console.log(`== ${C.programmes.find(p => p.id === prog).name}`);
    for (const [name, mk] of Object.entries(PROFILS)) {
      const res = {}, wk = {};
      let ov = 0, fi = 0, n = 0, eff = 0;
      for (let i = 0; i < N; i++) {
        const S = game(mk(prog), prog);
        res[S.ending] = (res[S.ending] || 0) + 1;
        wk[S.ending] = (wk[S.ending] || 0) + S.week;
        ov += S.overton;
        if (S.eco >= 100) eff++;
        if (S.el) { fi += S.el.fidelity; n++; }
      }
      console.log(`  ${name.padEnd(14)} ${fmt(res, wk, N)}`);
      console.log(`  ${"".padEnd(14)} Overton fin ${(ov / N).toFixed(0)} · promesses tenues ${n ? (100 * fi / n).toFixed(0) : "-"} % · planète effondrée ${(100 * eff / N).toFixed(0)} %`);
    }
  }
  process.exit();
}
console.log(`${N} parties par profil · dérive éco ${ECO_DRIFT}/sem · usure 49.3 ${USURE}\n`);
for (const [name, st] of Object.entries(STRATS)) {
  const res = {}, wk = {};
  let pop = 0, eco = 0, n493 = 0, fu = 0, dn = 0;
  for (let i = 0; i < N; i++) {
    const S = game(st);
    res[S.ending] = (res[S.ending] || 0) + 1;
    wk[S.ending] = (wk[S.ending] || 0) + S.week;
    pop += S.pop(); eco += S.eco; n493 += S.n493; fu += S.stats.fuites; dn += S.dndN;
  }
  const line = fmt(res, wk, N);
  console.log(`${name.padEnd(16)} ${line}`);
  console.log(`${"".padEnd(16)} pop moy ${(pop / N).toFixed(0)} · éco ${(eco / N).toFixed(0)} · 49.3 ${(n493 / N).toFixed(1)} · fuites ${(fu / N).toFixed(1)}${dn ? ` · décisions sans toi ${(dn / N).toFixed(0)}` : ""}`);
}
