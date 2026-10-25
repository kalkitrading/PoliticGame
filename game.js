// Ne Pas Déranger — moteur du jeu.
(() => {
  "use strict";

  const C = window.CONTENT;
  const WEEK_MS = 300000;          // durée réelle d'une semaine à vitesse normale (5 min)
  const FAST = 7;                   // multiplicateur en accéléré
  const SKIP = 30;                  // jour par jour : le temps file jusqu'au prochain message, puis s'arrête
  const CALL_RING_MS = 15000;       // temps pour décrocher
  const CALL_TALK_MS = 32000;       // temps pour répondre pendant l'appel
  const PASSIVE_DRAIN = 14;         // % de batterie perdus par semaine sans rien faire
  const POST_COST = 6;
  const GROUPS = ["jeunes", "ouvriers", "retraites", "patrons", "police"];
  const LABEL = { jeunes: "Jeunes", ouvriers: "Ouvriers", retraites: "Retraités", patrons: "Patrons", police: "Police", ordre: "Ordre", budget: "Caisses", eco: "Planète" };
  const WEIGHTS = C.weights;
  const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const DAYS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const REPRESSION_FLAGS = ["repression", "carteBlanche", "charge", "requisition", "interdiction", "perquisition", "armee", "securiteAbsolue"];
  const MAJ = 289;                  // majorité absolue à l'Assemblée
  const ECO_DRIFT = 8;              // dette écologique ajoutée chaque semaine si on ne fait rien
  const VOTE_COST = 5, COST_493 = 8;
  const DND_RECHARGE = 120;         // % de batterie récupérés par semaine en mode Ne pas déranger
  const GBY = {};
  C.groups.forEach(g => { GBY[g.id] = g; });
  const LAW = {};
  C.laws.forEach(l => { LAW[l.id] = l; });
  const EV = {};
  C.events.forEach(e => { EV[e.id] = e; });
  C.pool.forEach(e => { EV[e.id] = e; });
  C.alerts.forEach(e => { EV[e.id] = e; });
  // la version d'un contenu propre à ton programme (variants, voir content-gauche.js)
  const pv = o => (S && o && o.variants && o.variants[S.programme] ? { ...o, ...o.variants[S.programme] } : o);
  const byProg = (m, fallback) => (m && m[S.programme]) || fallback;
  const weekInfo = w => ({ ...C.weeks[w], ...(byProg(C.weeksBy, {})[w] || {}) });
  const postsOf = w => byProg(C.postsBy, {})[w] || C.posts[w];
  // une variante qui réécrit les réponses porte elle-même son glissement d'Overton (ov: false)
  const ovShift = (e, ci) => { if (e.ov !== false) shift(C.ovEvent(e.id, ci)); };

  const $ = s => document.querySelector(s);
  // les noms des ministres changent selon ton gouvernement (Rabot devient M. Partage, etc.)
  const esc = s => {
    let t = String(s);
    if (S && S.names) for (const [a, b] of Object.entries(S.names)) t = t.split(a).join(b);
    // au Centre, le téléphone parle la langue du pouvoir, un peu plus chaque semaine (C.novlangue)
    // au tribunal et sur l'écran de vérité (S.verite), les mots reprennent leur sens
    const nv = S && S.flags && !S.flags.parlerVrai && !S.verite && C.novlangue && C.novlangue[S.programme];
    if (nv) for (const lv of nv) if (S.week >= lv.from) for (const [a, b] of Object.entries(lv.words)) t = t.split(a).join(b);
    // dans La Pente, les mots changent à mesure que les décrets passent
    if (S && S.pente && !S.verite) for (const lv of C.lexique) if (S.pente.signed.length >= lv.from) for (const [a, b] of Object.entries(lv.words)) t = t.split(a).join(b);
    return t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const val = x => (typeof x === "function" ? x(S) : x);
  const tags = s => esc(s).replace(/#[\p{L}\p{N}_]+/gu, m => `<span class="tag">${m}</span>`);

  let S = null;
  let view = "title";
  let threadId = null;
  let bannerTimer = 0, fxTimer = 0, cardTimer = 0;
  let voteOpen = false;

  // ------------------------------------------------------------------ état
  function newState(progId) {
    const prog = C.programmes.find(p => p.id === progId) || C.programmes[C.programmes.length - 1];
    const me = prog.group;
    // ton groupe prend les 168 sièges du groupe présidentiel ; le Centre Absolu récupère les siens
    const seats = Object.fromEntries(C.groups.map(g => [g.id, g.seats]));
    if (me !== "CA") { seats.CA = seats[me]; seats[me] = 168; }
    const g = { jeunes: 38, ouvriers: 32, retraites: 55, patrons: 62, police: 58 };
    for (const [k, v] of Object.entries(prog.start.g)) g[k] = clamp(g[k] + v, 0, 100);
    const rel = Object.fromEntries(C.groups.map(x => [x.id, x.rel]));
    Object.assign(rel, prog.start.rel);
    rel[me] = 90;
    if (me !== "CA" && !(prog.start.rel && "CA" in prog.start.rel)) rel.CA = 40;
    return {
      programme: prog.id, me, seats, overton: prog.overton, lastPoll: null,
      names: prog.names || null, castContacts: prog.contacts || null,
      image: Object.fromEntries(C.groups.map(x => [x.id, 0])),
      week: 1, t: 0, speed: 1, running: false, battery: 100, dead: false, deadAt: null, lowWarned: false,
      g,
      ordre: 60, budget: 68, colere: 30, eco: 40,
      rel,
      laws: {}, n493: 0, lastCensure: 0, revokePct: 0, pendingEnd: null, altUsed: {}, alerts: {},
      dnd: null, dndWeek: 0, dndUsed: {}, cposts: {},
      pente: null, decrees: {}, silenced: {},
      flags: { ...(prog.flags || {}) },
      stats: { blesses: 0, gav: 0, fuites: 0, ignores: 0, feries: 0, lois: 0, dnd: 0 },
      convs: {}, seq: 1,
      feed: [], feedUnread: 0, news: [], newsUnread: 0,
      spawned: {}, sched: [], poolUsed: {},
      popHist: [], weekStart: null, posted: false,
      ignoredWeek: 0, leaksWeek: 0, nextAmb: 0.04, ambUsed: {},
      call: null, ending: null,
    };
  }

  const pop = () => GROUPS.reduce((s, k) => s + S.g[k] * WEIGHTS[k], 0);
  const dayIdx = () => Math.floor(clamp(S.t, 0, 0.9999) * 7);
  const contact = id => (S && S.castContacts && S.castContacts[id]) || C.contacts[id] || { name: id, av: "❓", col: "#444" };

  function mood() {
    const c = S.colere;
    if (c < 25) return ["Calme plat", "#34d68a"];
    if (c < 45) return ["Grogne", "#a3d635"];
    if (c < 60) return ["Tendu", "#ffb020"];
    if (c < 78) return ["Explosif", "#ff7a2f"];
    return ["Pré-insurrectionnel", "#ff3d4a"];
  }

  function clockText() {
    const x = clamp(S.t, 0, 0.9999) * 7;
    const d = Math.floor(x);
    const m = 8 * 60 + Math.floor((x - d) * 16 * 60);
    return `${DAYS[d]} ${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  }

  function conv(id) {
    if (!S.convs[id]) S.convs[id] = { msgs: [], unread: 0, pending: null, last: 0, lastText: "", typing: false };
    return S.convs[id];
  }

  // ------------------------------------------------------------------ effets
  function apply(o) {
    const d = {};
    if (!o) return d;
    const fx = val(o.fx);
    if (fx) {
      for (const [k, v] of Object.entries(fx)) {
        if (GROUPS.includes(k)) {
          const b = S.g[k]; S.g[k] = clamp(S.g[k] + v, 0, 100); d[k] = S.g[k] - b;
        } else if (k === "overton") {
          S.overton = clamp(S.overton + v, -100, 100);
        } else if (k === "ordre" || k === "budget" || k === "colere" || k === "eco") {
          const b = S[k]; S[k] = clamp(S[k] + v, 0, 100); d[k] = S[k] - b;
        } else if (k in S.stats) {
          S.stats[k] = Math.max(0, S.stats[k] + v);
        }
      }
    }
    if (o.rel) for (const [g, v] of Object.entries(val(o.rel))) S.rel[g] = clamp(S.rel[g] + v, 0, 100);
    // image d'un candidat à l'élection ; « me » désigne ton propre groupe
    if (o.image) for (const [g, v] of Object.entries(val(o.image))) { const id = g === "me" ? S.me : g; S.image[id] = (S.image[id] || 0) + v; }
    if (o.set) Object.assign(S.flags, o.set);
    if (o.news) {
      addNews(o.news);
      // chaque titre est aussi relayé sur Le Fil, avec le bandeau rouge
      schedulePost("@InfoChoc24", `🔴 ${o.news}`, rnd(0.006, 0.02));
    }
    if (o.posts) o.posts.forEach((p, i) => schedulePost(p[0], p[1], 0.015 + i * 0.02));
    return d;
  }

  const shift = v => { if (v) S.overton = clamp(S.overton + v, -100, 100); };

  function drain(x) {
    if (S.dead) return;
    S.battery = Math.max(0, S.battery - x);
    if (S.battery <= 20 && !S.lowWarned) { S.lowWarned = true; textToast("🔋 Batterie faible. Choisis tes combats."); }
    if (S.battery <= 0) die();
  }

  function die() {
    S.dead = true;
    S.deadAt = `${DAYS_FULL[dayIdx()].toLowerCase()} à ${clockText().slice(4)}`;
    if (S.call && S.call.phase !== "end") missCall(true);
    S.speed = FAST;
    $("#dead").hidden = false;
    $("#banner").hidden = true;
  }

  // ------------------------------------------------------------------ boucle
  let lastTs = 0;
  function tick(now) {
    const dt = Math.min(now - (lastTs || now), 250);
    lastTs = now;
    if (S && S.running && !voteOpen && !document.hidden) {
      if (S.call && S.call.phase !== "end") {
        S.call.left -= dt;
        const bar = $("#call .timer i");
        if (bar) bar.style.width = `${clamp(S.call.left / (S.call.phase === "ring" ? CALL_RING_MS : CALL_TALK_MS), 0, 1) * 100}%`;
        const rt = $("#call .ring");
        if (rt && S.call.phase === "ring") rt.textContent = `Appel entrant… ${Math.ceil(S.call.left / 1000)} s`;
        if (S.call.left <= 0) missCall();
      }
      // jour par jour : tant qu'un message attend ta réponse, le temps est arrêté ; sinon il file jusqu'au suivant.
      // Téléphone éteint ou mode Ne pas déranger : tes ministres gèrent, et le temps file.
      const speed = S.call ? 0 : S.dnd || S.dead || idle() ? SKIP : 0;
      const dw = dt * speed / WEEK_MS;
      S.t += dw;
      const day = dayIdx();
      if (day !== S.dayShown) {
        S.dayShown = day;
        if (day > 0 && !S.dnd && !S.dead && !S.ending) textToast(`☀️ ${DAYS_FULL[day]}`);
      }
      if (S.dnd) S.battery = Math.min(100, S.battery + dw * DND_RECHARGE);
      else drain(dw * PASSIVE_DRAIN);
      spawn();
      if (!S.ending) {
        const end = checkEnd();
        if (end) endGameSoon(end);
      }
      if (S.running && S.t >= 1) endWeek();
      updateStatus();
      if (S.dnd) {
        const ck = $("#dnd-clock"), bt = $("#dnd-batt");
        if (ck) ck.textContent = clockText();
        if (bt) bt.textContent = `${Math.floor(S.battery)}%`;
      }
    }
    requestAnimationFrame(tick);
  }

  function spawn() {
    for (const e0 of C.events) {
      const e = EV[e0.id];
      if (e.w !== S.week || S.spawned[e.id] || e.at > S.t) continue;
      S.spawned[e.id] = true;
      // une seule variante d'un même message
      if (e.alt && S.altUsed[e.alt]) continue;
      if (!e.when || e.when(S)) { if (e.alt) S.altUsed[e.alt] = true; deliver(e); }
    }
    for (const p0 of C.citizenPosts) {
      const p = pv(p0);
      if (p.w !== S.week || S.cposts[p.id] || p.at > S.t) continue;
      S.cposts[p.id] = true;
      if (p.when && !p.when(S)) continue;
      addPost({ h: p.h, t: p.t });
      apply({ fx: p.fx, set: p.set, news: p.news });
    }
    if (S.dnd && S.t >= S.dnd.nextAct) {
      S.dnd.nextAct = S.t + rnd(0.07, 0.11);
      ministerAct();
    }
    for (const a0 of C.alerts) {
      const a = EV[a0.id];
      // une alerte attend que tu sois réveillé
      if (S.alerts[a.id] || S.dead || S.dnd || !a.when(S)) continue;
      const cv = S.convs[val(a.from)];
      if (cv && cv.pending) continue; // on attend que le contact soit libre
      S.alerts[a.id] = true;
      deliver(a);
    }
    for (const L of C.laws) {
      if (L.w !== S.week || S.laws[L.id] || L.at > S.t || S.pente) continue;
      deliverLaw(L);
    }
    if (S.pente) for (const d of C.decrees) {
      if (d.w !== S.week || S.decrees[d.id] || d.at > S.t) continue;
      deliverDecree(d);
    }
    const due = S.sched.filter(q => q.w === S.week && q.at <= S.t);
    if (due.length) S.sched = S.sched.filter(q => !due.includes(q));
    for (const q of due) {
      if (q.kind === "post") addPost({ h: q.h, t: q.t, mine: q.mine });
      else if (q.kind === "leak") fireLeak(q);
      else if (q.kind === "ev") deliver(EV[q.id]);
      else if (q.kind === "censure") runCensure(q.id);
      else if (q.kind === "pool") {
        const e = EV[q.id];
        if (!e.when || e.when(S)) deliver(e); else S.poolUsed[q.id] = false;
      }
    }
    // semaine fusionnée : le second titre tombe en plein milieu, comme un rebondissement
    const wi = weekInfo(S.week);
    if (wi.mid && S.t >= wi.midAt && S.midSeen !== S.week) {
      S.midSeen = S.week;
      // une nuit de sommeil au milieu : la batterie repart à 100 %
      S.battery = 100; S.lowWarned = false;
      if (S.dead) { S.dead = false; S.deadAt = null; $("#dead").hidden = true; }
      if (!S.dnd) { buzz([60, 40, 60]); banner({ av: "⚡", col: "#b3121f", name: "Rebondissement" }, `${wi.mid} · 🔋 rechargé`, () => go("actu"), true); }
      addNews(`⚡ ${wi.mid}`);
    }
    if (S.t >= S.nextAmb) {
      S.nextAmb += rnd(0.06, 0.1);
      ambientPost();
    }
  }

  // ------------------------------------------------------------------ messages
  function deliver(e) {
    if (e.call) {
      if (S.dnd) { missedWhileDead(e, "📞 Appel filtré (Ne pas déranger)"); dndLog(contact(val(e.from)), (e.d && e.d.r) || "Appel filtré."); return; }
      if (S.call || S.dead) { if (!S.dead) S.sched.push({ w: S.week, at: S.t + 0.04, kind: "ev", id: e.id }); else missedWhileDead(e); return; }
      startCall(e);
      return;
    }
    const cid = val(e.from);
    const cv = conv(cid);
    if (cv.pending) ignore(cid);
    const msgs = val(e.m);
    const d = S.week * 10 + dayIdx();
    msgs.forEach(text => cv.msgs.push({ k: "them", text, d }));
    cv.pending = e.id;
    cv.unread += msgs.length;
    cv.last = S.seq++;
    cv.lastText = msgs[msgs.length - 1];
    if (S.dead) {
      ignore(cid, "📵 Téléphone éteint : tes ministres ont géré");
      refresh();
      return;
    }
    if (S.dnd) {
      ignore(cid, "🌙 Ne pas déranger : tes ministres ont géré");
      const d = e.d || {};
      dndLog(contact(cid), d.r || "Classé sans suite.");
      refresh();
      return;
    }
    if (!S.dead) {
      S.speed = 1;
      buzz();
      if (!(view === "thread" && threadId === cid)) banner(contact(cid), msgs[0], () => openThread(cid));
    }
    refresh();
  }

  function missedWhileDead(e, label) {
    const cid = val(e.from);
    const cv = conv(cid);
    cv.msgs.push({ k: "sys", text: label || "📞 Appel manqué (téléphone éteint)", d: S.week * 10 + dayIdx() });
    const d = e.d || {};
    if (d.r) cv.msgs.push({ k: "them", text: d.r });
    cv.lastText = "Appel manqué"; cv.last = S.seq++; cv.unread++;
    S.stats.ignores++; S.ignoredWeek++;
    apply(d);
    ovShift(e, "d");
  }

  function ignore(cid, label) {
    const cv = S.convs[cid];
    const e = EV[cv.pending];
    cv.pending = null;
    if (!e) return;
    S.stats.ignores++; S.ignoredWeek++;
    cv.msgs.push({ k: "sys", text: label || "Sans réponse" });
    const d = e.d || {};
    if (d.r) { cv.msgs.push({ k: "them", text: d.r }); cv.lastText = d.r; }
    apply(d);
    ovShift(e, "d");
    if (d.end) endGameSoon(d.end);
  }

  function choose(cid, ci) {
    const cv = S.convs[cid];
    const e = EV[cv.pending];
    if (!e || S.dead || S.ending) return;
    const ch = e.c[ci];
    cv.msgs.push({ k: "me", text: ch.t, d: S.week * 10 + dayIdx(), w: S.week, time: clockText(), grave: isGrave(e, ch) });
    cv.pending = null;
    cv.lastText = `Vous : ${ch.t}`;
    cv.last = S.seq++;
    const deltas = apply(ch);
    ovShift(e, ci);
    if (ch.leak && Math.random() < ch.leak.p) scheduleLeak(e, ci, cid);
    showFx(deltas);
    if (ch.r) {
      const s = S;
      cv.typing = true;
      setTimeout(() => {
        if (S !== s) return;
        cv.typing = false;
        cv.msgs.push({ k: "them", text: ch.r });
        cv.lastText = ch.r;
        if (!(view === "thread" && threadId === cid)) cv.unread++;
        refresh();
      }, 800 + Math.min(ch.r.length * 12, 1400));
    }
    if (ch.end) endGameSoon(ch.end);
    if (ch.act) ch.act();
    if (S.flags.pente && !S.pente) startPente();
    drain(ch.cost ?? 8);
    refresh();
  }

  // ------------------------------------------------------------------ appels
  function startCall(e) {
    S.call = { id: e.id, phase: "ring", left: CALL_RING_MS };
    S.speed = 1;
    buzz([300, 150, 300, 150, 300]);
    renderCall();
  }

  function acceptCall() {
    if (!S.call || S.call.phase !== "ring") return;
    S.call.phase = "talk";
    S.call.left = CALL_TALK_MS;
    drain(8);
    if (S.call) renderCall();
  }

  function missCall(silent) {
    const e = EV[S.call.id];
    S.call = null;
    $("#call").hidden = true;
    const cid = val(e.from);
    const cv = conv(cid);
    cv.msgs.push({ k: "sys", text: "📞 Appel manqué", d: S.week * 10 + dayIdx() });
    const d = e.d || {};
    if (d.r) cv.msgs.push({ k: "them", text: d.r });
    cv.lastText = d.r || "Appel manqué";
    cv.last = S.seq++;
    cv.unread++;
    S.stats.ignores++; S.ignoredWeek++;
    showFx(apply(d));
    ovShift(e, "d");
    if (!silent) textToast("📞 Appel manqué");
    refresh();
  }

  function callChoose(ci) {
    if (!S.call || S.call.phase !== "talk") return;
    const e = EV[S.call.id];
    const ch = e.c[ci];
    S.call.phase = "end";
    const cid = val(e.from);
    const cv = conv(cid);
    const d = S.week * 10 + dayIdx();
    cv.msgs.push({ k: "sys", text: "📞 Appel", d });
    val(e.m).forEach(text => cv.msgs.push({ k: "them", text, d }));
    cv.msgs.push({ k: "me", text: ch.t, d, w: S.week, time: clockText(), grave: isGrave(e, ch) });
    if (ch.r) cv.msgs.push({ k: "them", text: ch.r, d });
    cv.lastText = ch.r || ch.t;
    cv.last = S.seq++;

    const talk = $("#call .talk");
    $("#call .talk-choices").innerHTML = "";
    talk.insertAdjacentHTML("beforeend", `<div class="bub me">${esc(ch.t)}</div>`);
    const s = S;
    setTimeout(() => {
      if (S !== s) return;
      if (ch.r) talk.insertAdjacentHTML("beforeend", `<div class="bub them">${esc(ch.r)}</div>`);
      setTimeout(() => {
        if (S !== s) return;
        S.call = null;
        $("#call").hidden = true;
        refresh();
      }, ch.r ? 2600 : 600);
    }, 700);

    const deltas = apply(ch);
    ovShift(e, ci);
    if (ch.leak && Math.random() < ch.leak.p) scheduleLeak(e, ci, cid);
    showFx(deltas);
    if (ch.end) endGameSoon(ch.end);
    if (S.flags.pente && !S.pente) startPente();
    drain(ch.cost ?? 4);
  }

  // ------------------------------------------------------------------ fuites
  function scheduleLeak(e, ci, to) {
    const L = e.c[ci].leak;
    if (L.soon || S.week >= (C.lastWeek || 8)) S.sched.push({ w: S.week, at: S.t + rnd(0.05, 0.12), kind: "leak", id: e.id, ci, to });
    else S.sched.push({ w: S.week + 1, at: rnd(0.1, 0.6), kind: "leak", id: e.id, ci, to });
  }

  function fireLeak(q) {
    const ch = EV[q.id].c[q.ci];
    const L = ch.leak;
    S.stats.fuites++; S.leaksWeek++;
    const deltas = apply({ fx: L.fx, news: L.news, rel: L.rel, image: L.image });
    addPost({ h: "@LaFuite_Hex", t: "Capture exclusive 👀 On vous laisse juger.", leak: true, shot: { to: contact(q.to).name, text: ch.t } });
    if (!S.dead) {
      buzz([80, 60, 80, 60, 240]);
      banner({ av: "🚨", col: "#b3121f", name: "FUITE" }, L.news, () => go("fil"), true);
      showFx(deltas);
    }
  }

  // ------------------------------------------------------------------ le fil
  function addPost(p) {
    p.likes = p.likes ?? Math.floor(rnd(40, 9000) * (p.leak ? 30 : 1));
    p.rts = Math.floor(p.likes * rnd(0.1, 0.4));
    p.time = clockText();
    S.feed.unshift(p);
    if (S.feed.length > 80) S.feed.length = 80;
    if (view !== "fil") S.feedUnread++;
    if (view === "fil") renderFil();
    else updateBadges();
  }

  function schedulePost(h, t, delay) {
    S.sched.push({ w: S.week, at: S.t + delay, kind: "post", h, t });
  }

  function ambientPost() {
    const tier = S.pente && S.pente.signed.length >= 2 ? "pente" : S.colere < 40 ? "calm" : S.colere < 65 ? "tense" : "angry";
    // Le Fil réagit à tes choix, aux lois, aux chiffres et à la fenêtre d'Overton (content-fil.js) ;
    // les réactions « hot » passent en priorité, chaque publication ne sort qu'une fois
    if (tier !== "pente" && C.fil) {
      const used = S.filUsed || (S.filUsed = {});
      const ok = p => !used[p.id] && (!p.when || p.when(S));
      const hot = C.fil.filter(p => p.hot && ok(p));
      const pool = hot.length && Math.random() < 0.7 ? hot : Math.random() < 0.65 ? C.fil.filter(p => !p.hot && ok(p)) : [];
      if (pool.length) {
        const p = pick(pool);
        used[p.id] = true;
        addPost({ h: p.h, t: p.t });
        return;
      }
    }
    const list = (C.ambientBy && C.ambientBy[S.programme] && C.ambientBy[S.programme][tier]) || C.ambient[tier];
    const used = S.ambUsed[tier] || (S.ambUsed[tier] = []);
    if (used.length >= list.length) used.length = 0;
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (used.includes(i));
    used.push(i);
    addPost({ h: list[i][0], t: list[i][1] });
  }

  function publish(i) {
    const opt = postsOf(S.week)[i];
    S.posted = true;
    $("#composer").hidden = true;
    addPost({ h: "@President_Hex", t: opt.t, mine: true, likes: Math.floor(rnd(2000, 40000)) });
    showFx(apply({ fx: opt.fx }));
    schedulePost(opt.rep[0], opt.rep[1], 0.02);
    drain(POST_COST);
    renderFil();
  }

  // ------------------------------------------------------------------ actu
  function addNews(text) {
    S.news.unshift({ w: S.week, text });
    if (view !== "actu") S.newsUnread++;
  }

  // ------------------------------------------------------------------ semaines
  function startWeek(w) {
    S.week = w; S.t = 0; S.battery = 100; S.dead = false; S.deadAt = null; S.lowWarned = false;
    S.speed = 1; S.dayShown = 0; S.posted = false; S.ignoredWeek = 0; S.leaksWeek = 0; S.nextAmb = rnd(0.03, 0.07); S.dndWeek = 0;
    S.weekStart = { g: { ...S.g }, ordre: S.ordre, budget: S.budget, eco: S.eco, pop: pop() };
    $("#dead").hidden = true;
    if (w >= 2) {
      const cands = C.pool.filter(p => !S.poolUsed[p.id] && w >= (p.minW || 1)).sort(() => Math.random() - 0.5).slice(0, 2);
      cands.forEach(p => { S.poolUsed[p.id] = true; S.sched.push({ w, at: rnd(0.15, 0.88), kind: "pool", id: p.id }); });
    }
    showCard(w);
  }

  function showCard(w) {
    const wk = weekInfo(w);
    const el = $("#card");
    el.innerHTML = `<p class="k">${weekLabel(w)}</p><p class="t">${esc(wk.title)}</p><p class="s">${esc(wk.agenda[0])}</p>`;
    el.hidden = false;
    const go2 = () => {
      clearTimeout(cardTimer);
      el.hidden = true;
      el.onclick = null;
      go("home");
      S.running = true;
      lastTs = 0;
      if (w === 1) textToast("⏸ Le temps s’arrête tant qu’un message t’attend. ⏭ pour laisser filer.");
    };
    el.onclick = go2;
    cardTimer = setTimeout(go2, 2600);
  }

  function endWeek() {
    S.running = false;
    S.t = 1;
    if (S.dnd) stopDnd(true);
    if (S.pente) Object.entries(S.decrees).forEach(([id, st]) => { if (st.status === "pending") signDecree(id, "Le Secrétariat général"); });
    if (S.call && S.call.phase !== "end") missCall(true);
    S.call = null;
    $("#call").hidden = true;
    Object.keys(S.convs).forEach(cid => { if (S.convs[cid].pending) ignore(cid); });
    // un texte reste à l'ordre du jour deux semaines, puis il est enterré
    Object.entries(S.laws).forEach(([id, st]) => { if (st.status === "pending" && st.w < S.week) buryLaw(id); });
    S.ecoWeek = S.eco - S.weekStart.eco;
    const sc = C.weekScale || 1; // mandat replié en 6 semaines : dérives renforcées d'autant
    S.eco = clamp(S.eco + ECO_DRIFT * sc, 0, 100);
    S.sched.forEach(q => {
      if (q.w === S.week) { q.w = S.week + 1; q.at = q.kind === "leak" ? rnd(0.05, 0.3) : rnd(0.01, 0.05); }
    });
    // la société bouge toute seule
    // la colère retombe si on ne l'alimente pas, sauf chez ceux qui n'en peuvent plus
    const avg = (S.g.jeunes + S.g.ouvriers) / 2;
    S.colere = clamp(S.colere + clamp(Math.round((40 - avg) * 0.15), -3, 5) - 3, 0, 100);
    shift(Math.round(C.overtonMap.weekly * sc));
    // une colère maximale use les forces de l'ordre
    if (S.colere >= 90) S.ordre -= 6;
    S.ordre = clamp(Math.round(S.ordre + (50 - S.ordre) * 0.1), 0, 100);
    S.budget = clamp(S.budget - sc, 0, 100);
    // les marchés ont la mémoire courte
    S.g.patrons = clamp(Math.round(S.g.patrons + (45 - S.g.patrons) * 0.15), 0, 100);
    S.g.police = clamp(Math.round(S.g.police + (45 - S.g.police) * 0.12), 0, 100);
    // l'usure du pouvoir : les citoyens se lassent un peu chaque semaine
    ["jeunes", "ouvriers", "retraites"].forEach(k => { S.g[k] = clamp(S.g[k] - 2 * sc, 0, 100); });
    S.popHist.push(Math.round(pop()));
    $("#dead").hidden = true;
    $("#banner").hidden = true;
    const end = checkEnd();
    if (end) return showEnding(end);
    if (S.pente && S.week >= C.penteLastWeek) return showEnding("dictateur");
    if (S.week >= (C.lastWeek || 8) && !S.pente) return showElection();
    showRecap();
  }

  function checkEnd() {
    // tant que l'ordre tient, la colère reste sous le couvercle
    if (S.colere >= 100 && S.ordre < 65) return "revolution";
    if (S.g.police <= 8) return "coup";
    // sous l'état d'urgence, plus de sondage ni de Parlement pour te faire tomber
    if (S.pente) return null;
    if (S.budget <= 0) return "faillite";
    if (S.g.patrons <= 5 && !S.flags.controleCapitaux) return "debranche";   // le contrôle des capitaux coupe la prise
    if (pop() <= 15) return "destitue";
    return null;
  }

  function endGameSoon(id) {
    if (S.ending) return;
    S.ending = id;
    S.running = false;
    const s = S;
    setTimeout(() => { if (S === s) showEnding(id); }, 2800);
  }

  // ------------------------------------------------------------------ assemblée
  const lawTitle = L => val(L.title);
  const byOf = L => val(L.by);
  const isGov = L => byOf(L) === S.me;
  const seatsOf = g => S.seats[g.id];
  const addFx = (a, b) => {
    const o = { ...(a || {}) };
    for (const [k, v] of Object.entries(b)) o[k] = (o[k] || 0) + v;
    return o;
  };

  function deliverLaw(L) {
    if (L.when && !L.when(S)) { S.laws[L.id] = { status: "skip", w: S.week }; return; }
    S.laws[L.id] = { status: "pending", w: S.week, seq: S.seq++ };
    const g = GBY[byOf(L)];
    if (S.dnd) { ministersDecide(L); refresh(); return; }
    if (!S.dead) {
      S.speed = 1;
      buzz([40, 40, 40]);
      if (view !== "assemblee") banner({ av: "📜", col: g.col, name: isGov(L) ? "Projet de loi du gouvernement" : `Proposition de loi · ${g.id}` }, lawTitle(L), () => go("assemblee"));
    }
    refresh();
  }

  // répartition des votes par groupe. Ton groupe suit ta consigne, avec quelques frondeurs.
  function lawShares(L, instr, noise) {
    const st = val(L.st);
    // quand le Président est impopulaire, ses propres députés le lâchent
    const broken = C.promiseStates(S).filter(p => p.st === "broken").length;
    const fronde = clamp((45 - pop()) / 80, 0, 0.3) + broken * 0.04 + (S.flags.frondeDure ? 0.1 : 0);
    const groups = {};
    let pour = 0, contre = 0, abst = 0;
    for (const g of C.groups) {
      let p = g.id === S.me
        ? (instr === "pour" ? 0.78 + 0.22 * st[g.id] - fronde : 0.1 * st[g.id] + fronde)
        : st[g.id] + (S.rel[g.id] - 50) / (isGov(L) ? 250 : 450);
      if (noise) p += rnd(-0.08, 0.08);
      p = clamp(p, 0, 1);
      const a = noise ? rnd(0.02, 0.1) : 0.06;
      const n = seatsOf(g);
      const y = Math.round(n * p * (1 - a));
      const ab = Math.min(n - y, Math.round(n * a));
      groups[g.id] = { pour: y, contre: n - y - ab, abst: ab };
      pour += y; contre += n - y - ab; abst += ab;
    }
    return { groups, pour, contre, abst };
  }

  // chaque 49.3 de plus use la patience de l'opposition
  function censureShares(rel, n493, noise) {
    const usure = 4 * Math.pow(Math.max(0, n493 - 1), 1.5);
    const groups = {};
    let pour = 0;
    for (const g of C.groups) {
      let share = g.id === S.me ? 0 : 0.5 + (g.T + usure - rel[g.id]) / 30;
      if (noise && g.id !== S.me) share += rnd(-0.1, 0.1);
      share = clamp(share, 0, 1);
      const y = Math.round(seatsOf(g) * share);
      groups[g.id] = { pour: y, contre: seatsOf(g) - y, abst: 0 };
      pour += y;
    }
    return { groups, pour, contre: 577 - pour, abst: 0 };
  }

  function predictCensure() {
    const rel = { ...S.rel };
    C.groups.forEach(g => { if (g.id !== S.me) rel[g.id] = clamp(rel[g.id] - 5, 0, 100); });
    return censureShares(rel, S.n493 + 1, false).pour;
  }

  function voteLaw(id, instr, auto) {
    const L = LAW[id], st = S.laws[id];
    if (!L || !st || st.status !== "pending" || (S.dead && !auto) || S.ending) return;
    if (instr === "493") return use493(id, auto);
    if (instr === "retirer") { buryLaw(id, true); drain(2); refresh(); return; }
    const r = lawShares(L, instr, true);
    const adopted = r.pour > r.contre;
    st.status = adopted ? "adopted" : "rejected";
    st.res = r;
    st.instr = instr;
    const d = {};
    if (instr === "contre" && L.against) Object.assign(d, apply(val(L.against)));
    if (byOf(L) !== S.me) S.rel[byOf(L)] = clamp(S.rel[byOf(L)] + (instr === "pour" ? 5 : -4), 0, 100);
    Object.assign(d, apply(val(adopted ? L.yes : L.no)));
    if (adopted) { S.stats.lois++; shift(C.overtonMap.laws[L.id]); }
    if (adopted && L.revoke) referendum();
    if (auto) {
      dndLog(auto, `${lawTitle(L)} : consigne « ${instr} », texte ${adopted ? "adopté" : "rejeté"} ${r.pour}–${r.contre}.`);
      if (S.pendingEnd) { const e = S.pendingEnd; S.pendingEnd = null; endGameSoon(e); }
      return;
    }
    showVote({ kind: "vote", L, r, adopted, d });
    drain(VOTE_COST);
  }

  function referendum() {
    const p = pop();
    if (p < 42) {
      S.revokePct = Math.round(clamp(58 + (42 - p) * 0.8, 51, 89));
      S.pendingEnd = "revoque";
    } else {
      addNews(`Référendum révocatoire : le Président sauve sa place avec ${Math.round(clamp(50 + (p - 42) * 0.6, 51, 80))} % de « non ». Il parle de « plébiscite »`);
    }
  }

  function use493(id, auto) {
    const L = LAW[id], st = S.laws[id];
    if (!isGov(L)) return;
    S.n493++;
    st.status = "493";
    shift((C.overtonMap.laws[L.id] || 0) + C.overtonMap.use493);
    C.groups.forEach(g => { if (g.id !== S.me) S.rel[g.id] = clamp(S.rel[g.id] - 5, 0, 100); });
    const y = val(L.yes) || {};
    const d = apply({ ...y, fx: addFx(y.fx, { colere: 4, jeunes: -2 }) });
    S.stats.lois++;
    addNews(`49.3 sur « ${lawTitle(L)} » : adopté sans vote, l’opposition dépose une motion de censure`);
    S.sched.push({ w: S.week, at: S.t + 0.05, kind: "censure", id });
    if (auto) { dndLog(auto, `a dégainé le 49.3 sur « ${lawTitle(L)} ». « Ça ira plus vite. »`); return; }
    showVote({ kind: "493", L, d });
    drain(COST_493);
  }

  function runCensure(id) {
    const r = censureShares(S.rel, S.n493, true);
    const ok = r.pour >= MAJ;
    S.lastCensure = r.pour;
    addNews(ok ? `MOTION DE CENSURE ADOPTÉE par ${r.pour} voix : le gouvernement est renversé`
               : `Motion de censure rejetée : ${r.pour} voix, il en fallait ${MAJ}`);
    if (S.dead || S.dnd) {
      if (S.dnd) dndLog({ name: "Assemblée", av: "🏛️", col: "#a8620a" }, ok ? `Motion de censure adoptée par ${r.pour} voix. Le gouvernement tombe pendant ta sieste.` : `Motion de censure rejetée : ${r.pour} voix sur ${MAJ}.`);
      if (ok) endGameSoon("censure");
      return;
    }
    if (ok) S.pendingEnd = "censure";
    buzz([200, 100, 200]);
    showVote({ kind: "censure", L: LAW[id], r, adopted: ok });
  }

  function buryLaw(id, retire) {
    const L = LAW[id];
    S.laws[id].status = retire ? "retire" : "buried";
    if (byOf(L) !== S.me) S.rel[byOf(L)] = clamp(S.rel[byOf(L)] - 3, 0, 100);
    apply(val(L.buried) || (retire ? { news: `Le gouvernement retire « ${lawTitle(L)} » de l’ordre du jour` } : null));
  }

  // ------------------------------------------------------------------ rendu : hémicycle
  let SEATS = null;
  function seats() {
    if (SEATS) return SEATS;
    const rows = 10, r0 = 0.42, r1 = 1;
    const radii = Array.from({ length: rows }, (_, i) => r0 + (r1 - r0) * i / (rows - 1));
    const sum = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map(r => Math.round(577 * r / sum));
    counts[rows - 1] += 577 - counts.reduce((a, b) => a + b, 0);
    const pts = [];
    radii.forEach((r, i) => {
      for (let j = 0; j < counts[i]; j++) {
        const a = Math.PI * (1 - j / (counts[i] - 1));
        pts.push({ x: r * Math.cos(a), y: -r * Math.sin(a), a });
      }
    });
    pts.sort((p, q) => q.a - p.a); // de la gauche vers la droite
    return (SEATS = pts);
  }

  // r = résultat d'un vote (null = couleurs des groupes). En censure, seuls les votes « pour » comptent.
  function hemicycle(r, censure) {
    const fills = [];
    for (const g of C.groups) {
      if (!r) { for (let i = 0; i < seatsOf(g); i++) fills.push(g.col); continue; }
      const v = r.groups[g.id];
      for (let i = 0; i < v.pour; i++) fills.push(censure ? "#ff3d4a" : "#34d68a");
      for (let i = 0; i < v.abst; i++) fills.push("#5a6075");
      for (let i = 0; i < v.contre; i++) fills.push(censure ? "#2a2f42" : "#ff3d4a");
    }
    const label = !r ? "577" : censure ? String(r.pour) : `${r.pour}–${r.contre}`;
    return `<svg class="hemi${r ? " anim" : ""}" viewBox="-1.05 -1.05 2.1 1.1" role="img" aria-label="Hémicycle de 577 sièges">
      ${seats().map((p, i) => `<circle cx="${p.x.toFixed(3)}" cy="${p.y.toFixed(3)}" r="0.019" fill="${fills[i]}"${r ? ` style="animation-delay:${(i * 2.2) | 0}ms"` : ""}/>`).join("")}
      <text x="0" y="-0.05" text-anchor="middle" class="hemi-n${r && !censure ? " sm" : ""}">${label}</text>
    </svg>`;
  }

  function groupTable(r, censure) {
    return `<div class="vt-groups">${C.groups.map(g => {
      const v = r.groups[g.id];
      return `<div class="vg"><span class="dot" style="background:${g.col}"></span><span class="vg-n">${esc(g.name)}${g.id === S.me ? " (toi)" : ""}</span>
        <span class="vg-v">${censure ? `${v.pour} / ${seatsOf(g)}` : `<span class="up">${v.pour}</span> · <span class="down">${v.contre}</span>`}</span></div>`;
    }).join("")}</div>`;
  }

  function showVote(o) {
    voteOpen = true;
    const { L, r } = o;
    let kicker, stamp, stampCls, counts = "", note = "";
    if (o.kind === "vote") {
      kicker = "Scrutin public";
      stamp = o.adopted ? "Adoptée" : "Rejetée";
      stampCls = o.adopted ? "ok" : "ko";
      counts = `<span class="up">Pour <b>${r.pour}</b></span><span class="down">Contre <b>${r.contre}</b></span><span>Abst. <b>${r.abst}</b></span>`;
    } else if (o.kind === "493") {
      kicker = "Article 49.3";
      stamp = "49.3";
      stampCls = "ko";
      note = "Le texte est considéré comme adopté. Sans vote. L’opposition dépose une motion de censure, votée dans les prochaines heures.";
    } else {
      kicker = "Motion de censure";
      stamp = o.adopted ? "Gouvernement renversé" : "Motion rejetée";
      stampCls = o.adopted ? "ko" : "ok";
      counts = `<span class="down">Censure <b>${r.pour}</b></span><span>Requis <b>${MAJ}</b></span>`;
      note = o.adopted
        ? "Le RH, l’HI et les autres ont voté ensemble. Ils ne se parlent pas, mais ils savent compter."
        : `Il a manqué ${MAJ - r.pour} voix. Le gouvernement survit. Pour l’instant.`;
    }
    const el = $("#vote");
    el.innerHTML = `<div class="vt">
      <span class="k">${kicker} · Assemblée</span>
      <h2>${esc(lawTitle(L))}</h2>
      ${hemicycle(o.kind === "493" ? null : r, o.kind === "censure")}
      ${counts ? `<div class="vt-counts">${counts}</div>` : ""}
      <div class="stamp ${stampCls}">${stamp}</div>
      ${note ? `<p class="note">${note}</p>` : ""}
      ${r ? groupTable(r, o.kind === "censure") : ""}
      <button class="btn-primary" type="button" id="btn-vote-close">${o.kind === "493" ? "Assumer" : "Continuer"}</button>
    </div>`;
    el.hidden = false;
    el.scrollTop = 0;
    S.voteFx = o.d || null;
  }

  function closeVote() {
    $("#vote").hidden = true;
    voteOpen = false;
    lastTs = 0;
    if (S.voteFx) showFx(S.voteFx);
    S.voteFx = null;
    if (S.pendingEnd) { const e = S.pendingEnd; S.pendingEnd = null; endGameSoon(e); }
    refresh();
  }

  function relMood(v) {
    if (v < 25) return ["Hostile", "#ff3d4a"];
    if (v < 45) return ["Méfiant", "#ff7a2f"];
    if (v < 60) return ["Neutre", "#8b91a6"];
    if (v < 80) return ["Bienveillant", "#a3d635"];
    return ["Allié", "#34d68a"];
  }

  function verdict(r) {
    const m = r.pour - r.contre;
    if (m > 30) return ["Adoption probable", "up"];
    if (m < -30) return ["Rejet probable", "down"];
    return ["Incertain", "warn"];
  }

  const STAMPS = { adopted: ["Adoptée", "up"], rejected: ["Rejetée", "down"], "493": ["49.3", "warn"], buried: ["Enterrée", "dim"], retire: ["Retirée", "dim"] };

  function renderAssemblee() {
    const laws = Object.entries(S.laws);
    const pending = laws.filter(([, st]) => st.status === "pending").sort((a, b) => a[1].seq - b[1].seq);
    const done = laws.filter(([, st]) => STAMPS[st.status]).sort((a, b) => b[1].seq - a[1].seq);
    const cens = predictCensure();
    const cards = pending.map(([id, st]) => {
      const L = LAW[id], g = GBY[byOf(L)];
      const [vp, cp] = verdict(lawShares(L, "pour", false));
      let lines, btns;
      if (isGov(L)) {
        const [vc, cc] = cens >= MAJ ? ["Chute probable", "down"] : cens >= MAJ - 30 ? ["Ça passe de justesse", "warn"] : ["Ça passe", "up"];
        lines = `<div class="pt-line"><span>Si on met au vote</span><span class="${cp}">${vp}</span></div>
          <div class="pt-line"><span>Si 49.3 : ~${cens} voix de censure sur ${MAJ}</span><span class="${cc}">${vc}</span></div>`;
        btns = `<button class="lb" type="button" data-law="${id}" data-vote="pour">Mettre au vote <small>🔋${VOTE_COST}</small></button>
          <button class="lb danger" type="button" data-law="${id}" data-vote="493">49.3 <small>🔋${COST_493}</small></button>
          <button class="lb ghost" type="button" data-law="${id}" data-vote="retirer">Retirer</button>`;
      } else {
        const [vc, cc] = verdict(lawShares(L, "contre", false));
        lines = `<div class="pt-line"><span>Si ton groupe vote pour</span><span class="${cp}">${vp}</span></div>
          <div class="pt-line"><span>Si ton groupe vote contre</span><span class="${cc}">${vc}</span></div>`;
        btns = `<button class="lb" type="button" data-law="${id}" data-vote="pour">Voter pour <small>🔋${VOTE_COST}</small></button>
          <button class="lb" type="button" data-law="${id}" data-vote="contre">Voter contre <small>🔋${VOTE_COST}</small></button>`;
      }
      return `<article class="law">
        <div class="law-by"><span class="gpill" style="background:${g.col}">${g.id}</span>${isGov(L) ? "Projet de loi du gouvernement" : `Proposition · ${esc(g.name)}`}</div>
        <h3>${esc(lawTitle(L))}</h3>
        <p>${esc(val(L.desc))}</p>
        ${lines}
        ${st.w < S.week ? `<p class="exp">Enterré dimanche si personne ne vote.</p>` : ""}
        <div class="law-btns">${btns}</div>
      </article>`;
    }).join("");
    $("#hemi").innerHTML = `
      <div class="hemi-wrap">${hemicycle(null)}</div>
      <div class="legend">${C.groups.map(g => {
        const [m, col] = relMood(S.rel[g.id]);
        return `<div class="lg"><span class="dot" style="background:${g.col}"></span><span class="lg-n">${esc(g.name)}</span><span class="lg-s">${seatsOf(g)}</span><span class="lg-m" style="color:${g.id === S.me ? "var(--gold)" : col}">${g.id === S.me ? "Ton groupe" : m}</span></div>`;
      }).join("")}</div>
      <p class="hemi-note">Majorité absolue : <b>${MAJ}</b> sièges. Ton groupe en a 168. 49.3 utilisés : <b>${S.n493}</b>.</p>
      <h4 class="sec">À l’ordre du jour</h4>
      ${cards || `<p class="empty">Rien à l’ordre du jour. Les députés font des mots croisés.</p>`}
      ${done.length ? `<h4 class="sec">Textes examinés</h4>${done.map(([id, st]) => {
        const [t, c] = STAMPS[st.status];
        return `<div class="done"><span>${esc(lawTitle(LAW[id]))}</span><span class="st ${c}">${t}${st.res ? ` ${st.res.pour}–${st.res.contre}` : ""}</span></div>`;
      }).join("")}` : ""}`;
  }


  // ------------------------------------------------------------------ mode Ne pas déranger
  function startDnd() {
    if (!S || !S.running || S.dead || S.dnd || S.ending) return;
    if (S.call && S.call.phase === "ring") missCall(true);
    S.dnd = { log: [], nextAct: S.t + rnd(0.03, 0.06), from: clockText() };
    S.speed = FAST;
    $("#banner").hidden = true;
    renderDnd();
    $("#dnd").hidden = false;
    // les messages en attente : tes ministres s'en chargent aussi
    Object.keys(S.convs).forEach(cid => {
      const cv = S.convs[cid];
      if (!cv.pending) return;
      const e = EV[cv.pending];
      ignore(cid, "🌙 Ne pas déranger : tes ministres ont géré");
      dndLog(contact(cid), (e && e.d && e.d.r) || "Classé sans suite.");
    });
    Object.entries(S.laws).forEach(([id, st]) => { if (st.status === "pending") ministersDecide(LAW[id]); });
  }

  function stopDnd(silent) {
    const n = S.dnd ? S.dnd.log.length : 0;
    S.dnd = null;
    S.speed = 1;
    $("#dnd").hidden = true;
    if (!silent) textToast(n ? `🌙 ${n} décision${n > 1 ? "s" : ""} prise${n > 1 ? "s" : ""} sans toi. Bon courage.` : "🌙 Rien ne s’est passé. Profite, c’est rare.");
    refresh();
  }

  function dndLog(c, text) {
    if (!S.dnd) return;
    S.stats.dnd++;
    S.dndWeek++;
    S.dnd.log.unshift({ c, text, time: clockText() });
    renderDnd();
  }

  // tes ministres votent selon leurs convictions, qui dépendent de qui est à l'Intérieur
  function ministersDecide(L) {
    const hawk = !S.flags.lebatonVire;
    const who = { name: hawk ? "Lebâton" : "Mme Douce", av: hawk ? "🚓" : "🕊️", col: hawk ? "#2b4fa8" : "#4d7fa8" };
    let instr;
    if (L.revoke) instr = "contre";
    else if (isGov(L)) {
      const r = lawShares(L, "pour", false);
      instr = r.pour > r.contre || !hawk ? "pour" : "493";
    } else instr = (hawk ? ["RH", "DP"] : ["VP", "PP", "HI"]).includes(L.by) ? "pour" : "contre";
    voteLaw(L.id, instr, who);
  }

  function ministerAct() {
    let list = C.dndActs.filter(a => (!a.when || a.when(S)) && !S.dndUsed[a.id]);
    if (!list.length) {
      S.dndUsed = {};
      list = C.dndActs.filter(a => !a.when || a.when(S));
    }
    const a = pv(pick(list));
    S.dndUsed[a.id] = true;
    apply({ fx: a.fx });
    if (a.post) addPost({ h: a.post[0], t: a.post[1], mine: true });
    dndLog({ ...(a.from ? contact(a.from) : { av: "🌙", col: "#2d2a5a" }), name: a.who }, a.t);
  }

  function renderDnd() {
    if (!S.dnd) return;
    $("#dnd").innerHTML = `<div class="dnd-inner">
      <div class="dnd-moon">🌙</div>
      <p class="dnd-k">Ne pas déranger · depuis ${esc(S.dnd.from)}</p>
      <p class="dnd-clock" id="dnd-clock">${clockText()}</p>
      <p class="dnd-batt">🔋 Recharge en cours · <span id="dnd-batt">${Math.floor(S.battery)}%</span></p>
      <h3>Pendant ton absence</h3>
      <div class="dnd-log">${S.dnd.log.length ? S.dnd.log.map(l => `<div class="dnd-row"><span class="av" style="background:${l.c.col}">${l.c.av}</span><div><b>${esc(l.c.name)}</b><span>${esc(l.time)}</span><p>${esc(l.text)}</p></div></div>`).join("")
        : `<p class="dnd-empty">Pour l’instant, rien. Tes ministres s’échauffent.</p>`}</div>
      <button class="btn-primary" type="button" id="btn-dnd-stop">Reprendre la main</button>
    </div>`;
  }

  // ------------------------------------------------------------------ programmes, promesses, Overton, élection
  function renderProgrammes() {
    $("#prog-list").innerHTML = C.programmes.map(p => {
      const g = GBY[p.group];
      return `<button class="prog" type="button" data-prog="${p.id}">
        <span class="prog-h"><span class="prog-e">${p.emoji}</span><b>${esc(p.name)}</b><span class="gpill" style="background:${g.col}">${g.id}</span></span>
        <span class="prog-p">${esc(p.pitch)}</span>
        <span class="prog-l">${p.promises.map(x => `<span>· ${esc(x.text)}</span>`).join("")}</span>
      </button>`;
    }).join("");
  }

  function promisesCard(atEnd) {
    const prog = C.programme(S);
    const ic = { ok: "✅", broken: "❌", pending: "⏳" };
    return `<div class="card prom"><h3>${prog.emoji} Tes promesses · ${esc(prog.name)}</h3>
      ${C.promiseStates(S, atEnd).map(p => `<div class="prom-row ${p.st}"><span>${ic[p.st]}</span><span>${esc(p.text)}</span></div>`).join("")}
    </div>`;
  }

  function overtonCard() {
    const O = S.overton, mv = C.movement(S);
    const pos = (O + 100) / 2;
    const b = C.barrageLabel(O);
    const bcol = b === "solide" ? "#34d68a" : b === "fragile" ? "#ffb020" : "#ff3d4a";
    const mcol = mv.strong ? (mv.mate ? "#ff7a2f" : "#34d68a") : "#8b91a6";
    return `<div class="card"><h3>Fenêtre d’Overton</h3>
      <div class="ov">
        <div class="ov-track"></div>
        <div class="ov-win" style="left:${clamp(pos - 15, 0, 70)}%"></div>
        ${C.groups.filter(g => g.id !== "DIV").map(g => `<span class="ov-g" style="left:${(C.positions[g.id] + 100) / 2}%;background:${g.col}">${g.id}</span>`).join("")}
      </div>
      <div class="ov-lbl"><span>Gauche de rupture</span><span>Droite autoritaire</span></div>
      <p class="ov-txt">Ce qui se dit à la télé : <b>${C.overtonLabel(O)}</b></p>
      <div class="bar-row"><span>Barrage</span><span class="mood-pill" style="background:${bcol}22;color:${bcol};justify-self:start">Barrage anti-RH ${b}</span><span></span></div>
      <div class="bar-row"><span>La rue</span><span class="mood-pill" style="background:${mcol}22;color:${mcol};justify-self:start">${mv.label}</span><span></span></div>
    </div>`;
  }

  function pollCard() {
    const lp = S.lastPoll;
    if (!lp) return `<div class="card"><h3>Intentions de vote</h3><p class="note-s">Premier sondage à la fin de la semaine 4.</p></div>`;
    return `<div class="card"><h3>Intentions de vote · semaine ${lp.week}</h3>
      ${lp.r1.slice(0, 5).map(c => barRow(esc(C.candName(S, c.id)), c.pct * 2, 0, GBY[c.id].col).replace(`>${Math.round(c.pct * 2)}<`, `>${Math.round(c.pct)} %<`)).join("")}
    </div>`;
  }

  function showElection() {
    S.running = false;
    const el = C.election(S, { noise: 0.06, atEnd: true });
    S.election = el;
    voteOpen = true;
    const kept = C.promiseStates(S, true).filter(p => p.st === "ok").length;
    const row = c => {
      const g = GBY[c.id];
      return `<div class="el-row${c.id === S.me ? " me" : ""}">
        <span class="el-n">${esc(C.candName(S, c.id))}<small>${esc(g.name)}</small></span>
        <span class="el-bar"><i style="width:${Math.min(100, c.pct * (el.r1.includes(c) ? 2 : 1)).toFixed(1)}%;background:${g.col}"></i></span>
        <span class="el-v">${c.pct.toFixed(1).replace(".", ",")} %</span>
      </div>`;
    };
    const won = el.winner === S.me;
    $("#election").innerHTML = `<div class="vt">
      <span class="k">Dimanche · 20 h · Élection présidentielle</span>
      <h2>Soirée électorale</h2>
      <h4 class="el-sec">Premier tour</h4>
      <div class="el-list">${el.r1.map(row).join("")}</div>
      <h4 class="el-sec r2">Second tour</h4>
      <div class="el-list r2">${el.r2.map(row).join("")}</div>
      <div class="stamp ${won ? "ok" : "ko"} el-stamp">${won ? "Réélu" : `${esc(C.candName(S, el.winner))} élu`}</div>
      <p class="note el-note">Fenêtre d’Overton : ${C.overtonLabel(S.overton).toLowerCase()}. Barrage contre le RH : ${C.barrageLabel(S.overton)}. Promesses tenues : ${kept} sur 4.</p>
      <button class="btn-primary el-btn" id="btn-election" type="button">Voir la suite</button>
    </div>`;
    $("#election").hidden = false;
    $("#election").scrollTop = 0;
    $("#dead").hidden = true;
    $("#banner").hidden = true;
  }

  function closeElection() {
    $("#election").hidden = true;
    voteOpen = false;
    showEnding(S.election.winner === S.me ? "reelu" : `win_${S.election.winner}`);
  }

  // ------------------------------------------------------------------ La Pente
  const DECREE = {};
  (C.decrees || []).forEach(d => { DECREE[d.id] = d; });
  const signedCount = (who) => (S.pente ? S.pente.signed.filter(d => !who || d.by === who).length : 0);
  const weekLabel = w => (S && S.pente ? `Semaine ${w}` : `Semaine ${w} / ${C.lastWeek || 8}`);

  function startPente() {
    S.pente = { signed: [], refused: 0, w0: S.week };
    // l'Assemblée est suspendue : les textes en attente sont enterrés
    Object.entries(S.laws).forEach(([id, st]) => { if (st.status === "pending") st.status = "buried"; });
    addNews("ÉTAT D’URGENCE : les élections sont reportées « jusqu’au retour au calme »");
    voteOpen = true;
    $("#avert").innerHTML = `<div class="avert-inner">
      <p class="k">Avertissement</p>
      <h2>La Pente</h2>
      <p>Les élections n’auront pas lieu. Le mandat continue.</p>
      <p>La suite aborde la persécution et la déportation, par petites étapes administratives. Le jeu ne récompense aucune signature.</p>
      <p><b>Tu peux refuser à chaque étape.</b></p>
      <button class="btn-primary" type="button" id="btn-avert">Continuer</button>
    </div>`;
    $("#avert").hidden = false;
    refresh();
  }

  function deliverDecree(d) {
    S.decrees[d.id] = { status: "pending", seq: S.seq++ };
    if (S.dnd) { signDecree(d.id, "Le Conseiller"); return; }
    S.speed = 1;
    buzz([40, 80, 40]);
    if (view !== "parapheur") banner(contact("secretariat"), `Décret n° ${d.n} à signer : ${d.title}`, () => go("parapheur"));
    refresh();
  }

  function signDecree(id, by) {
    const d = DECREE[id], st = S.decrees[id];
    if (!st || st.status === "signed" || S.ending) return;
    if (st.status === "refused") S.pente.refused--;
    st.status = "signed";
    st.by = by || "toi";
    S.pente.signed.push({ id, n: d.n, w: S.week, title: d.title, by: st.by, when: `semaine ${S.week}, ${DAYS_FULL[dayIdx()].toLowerCase()} à ${clockText().slice(4)}` });
    const deltas = apply(d.sign);
    for (const cid of d.silence || []) {
      if (C.silenceExempt[cid] && C.silenceExempt[cid](S)) continue;
      conv(cid).msgs.push({ k: "sys", text: "Message non distribué." });
      S.silenced[cid] = true;
    }
    if (by) dndLog({ ...contact("conseiller"), name: by }, `a signé le décret n° ${d.n} en ton nom : « ${d.title} ».`);
    else { showFx(deltas); drain(3); }
    paintPente();
    refresh();
  }

  function refuseDecree(id) {
    const d = DECREE[id], st = S.decrees[id];
    if (!st || st.status !== "pending" || S.ending) return;
    st.status = "refused";
    S.pente.refused++;
    showFx(apply({ fx: C.refuseFx }));
    drain(3);
    if (S.pente.refused >= C.prods.length) { endGameSoon("refus"); refresh(); return; }
    // le Conseiller insiste, avec les mots de Milgram
    const ev = {
      id: `prod_${id}`, from: "conseiller",
      m: [C.prods[S.pente.refused - 1], `Le décret n° ${d.n} reste sur votre bureau.`],
      c: [
        { t: "Signer quand même.", cost: 2, r: "Merci, Président. Vous voyez, ce n’était pas si difficile.", act: () => signDecree(id) },
        { t: "Non.", cost: 2, r: "Je note votre refus. Je note tout." },
      ],
      d: { r: "Je prends votre silence pour une hésitation. L’hésitation n’est pas un refus." },
    };
    EV[ev.id] = ev;
    deliver(ev);
    refresh();
  }

  // l'interface se ternit à mesure que les décrets passent
  function paintPente() {
    const n = signedCount();
    $("#phone").dataset.pente = n >= 6 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0;
  }

  function renderParapheur() {
    const all = Object.entries(S.decrees).sort((a, b) => a[1].seq - b[1].seq);
    const pending = all.filter(([, st]) => st.status === "pending");
    const done = all.filter(([, st]) => st.status !== "pending");
    $("#decrees").innerHTML = `
      ${pending.length ? pending.map(([id]) => {
        const d = DECREE[id];
        return `<article class="decree">
          <p class="dc-k">République d’Hexagonie · Décret n° 2027-${String(d.n).padStart(3, "0")}</p>
          <h3>${esc(d.title)}</h3>
          <p class="dc-body">${esc(d.desc)}</p>
          <p class="dc-sig">Fait à l’Élysée. Le Président de la République,</p>
          <div class="dc-btns">
            <button class="lb dc-sign" type="button" data-decree="${id}" data-dact="sign">Signer</button>
            <button class="lb ghost" type="button" data-decree="${id}" data-dact="refuse">Refuser</button>
          </div>
        </article>`;
      }).join("") : `<p class="empty">Aucun décret en attente. Le Secrétariat général vous remercie.</p>`}
      ${done.length ? `<h4 class="sec">Décrets traités</h4>${done.map(([id, st]) => {
        const d = DECREE[id];
        const label = st.status === "refused" ? "Refusé" : st.by === "toi" ? "Signé" : `Signé par ${esc(st.by)}`;
        return `<div class="done"><span>N° ${d.n} · ${esc(d.title)}</span><span class="st ${st.status === "refused" ? "up" : "dim"}">${label}</span></div>`;
      }).join("")}` : ""}`;
  }

  // ------------------------------------------------------------------ rendu : statut & accueil
  // rien n'attend de réponse : ni message, ni appel, ni décret à signer (les textes de loi, eux, peuvent attendre)
  const idle = () => !!S && !S.dnd && !S.call
    && !Object.values(S.convs).some(cv => cv.pending)
    && !Object.values(S.decrees || {}).some(st => st.status === "pending");

  // « Laisser filer » : tout ce qui attend part avec la décision par défaut
  function letGo() {
    if (!S || !S.running || S.dead || S.ending) return;
    let n = 0;
    if (S.call && S.call.phase === "ring") { missCall(true); n++; }
    Object.keys(S.convs).forEach(cid => { if (S.convs[cid].pending) { ignore(cid, "🙈 Laissé sans réponse"); n++; } });
    if (S.pente) Object.entries(S.decrees).forEach(([id, st]) => { if (st.status === "pending") { signDecree(id, "Le Secrétariat général"); n++; } });
    textToast(n ? `🙈 Tu as laissé filer. ${n > 1 ? "Tes ministres ont tranché." : "Ton silence a tranché."}` : "Rien n’attend de réponse. Le temps file déjà.");
    refresh();
  }

  function updateStatus() {
    $("#clock").textContent = S ? clockText() : "08:00";
    const auto = !!S && S.running && !S.call && (S.dnd || S.dead || idle());
    $("#clock").classList.toggle("auto", auto);
    $("#clock").classList.toggle("pause", !!S && S.running && !auto && !S.call);
    const b = S ? Math.ceil(S.battery) : 100;
    $("#batt-pct").textContent = `${b}%`;
    $("#batt-fill").style.width = `${b}%`;
    $("#batt").classList.toggle("low", b <= 20);
    $("#ff").classList.toggle("on", !!S && S.running && !auto && !S.dead);
    $("#ff").hidden = !S || !S.running;
  }

  const APPS = [
    { id: "agenda", name: "Agenda", ic: "📅", bg: "linear-gradient(160deg,#fff,#dfe3ee)" },
    { id: "actu", name: "InfoChoc", ic: "📺", bg: "linear-gradient(160deg,#ff4b55,#a3101b)" },
    { id: "meteo", name: "Météo", ic: "🌩️", bg: "linear-gradient(160deg,#3b6fd8,#1a2f6b)", fake: "Météo sociale : orages violents, risque de pavés. Températures en hausse dans la rue." },
    { id: "photos", name: "Photos", ic: "🖼️", bg: "linear-gradient(160deg,#ffd36b,#f07f3c)", fake: "Album « Serrer des mains » : 4 312 photos. Aucune avec un ouvrier." },
    { id: "calc", name: "Calculette", ic: "🧮", bg: "linear-gradient(160deg,#4a4f60,#22252f)", fake: "Dette publique : 3 400 milliards. La calculette a planté." },
    { id: "rencontres", name: "Rencontres", ic: "💘", bg: "linear-gradient(160deg,#ff6fa5,#c2185b)", fake: "Compte suspendu par les services de renseignement. Pour votre sécurité." },
    { id: "reglages", name: "Réglages", ic: "⚙️", bg: "linear-gradient(160deg,#9aa0b2,#5c6274)", fake: "Le mode « Ne pas déranger » est sur l’écran d’accueil. Tes ministres n’attendent que ça." },
    { id: "banque", name: "Banque", ic: "🏦", bg: "linear-gradient(160deg,#2f7a4a,#14361f)", fake: "Solde : 14 280 €. Compte « Clémentine » : accès refusé." },
  ];
  const PARAPHEUR = { id: "parapheur", name: "Parapheur", ic: "📁", bg: "linear-gradient(160deg,#6b6f7c,#2c2f38)" };
  const DOCK = [
    { id: "messages", name: "Messages", ic: "💬", bg: "linear-gradient(160deg,#5cf07e,#17a83a)" },
    { id: "fil", name: "Le Fil", ic: "🗯️", bg: "linear-gradient(160deg,#4d8dff,#1a46b8)" },
    { id: "sondages", name: "Sondages", ic: "📊", bg: "linear-gradient(160deg,#ffcf4a,#e08a12)" },
    { id: "assemblee", name: "Assemblée", ic: "🏛️", bg: "linear-gradient(160deg,#f0b429,#a8620a)" },
  ];

  function appIcon(a) {
    const n = badgeCount(a.id);
    return `<button class="app-icon" type="button" data-app="${a.id}"><span class="ic" style="background:${a.bg}">${a.ic}</span><span class="lbl">${a.name}</span>${n ? `<span class="badge">${n > 99 ? "99+" : n}</span>` : ""}</button>`;
  }

  function badgeCount(id) {
    if (!S) return 0;
    if (id === "messages") return Object.values(S.convs).reduce((s, c) => s + c.unread, 0);
    if (id === "fil") return S.feedUnread;
    if (id === "actu") return S.newsUnread;
    if (id === "parapheur") return Object.values(S.decrees).filter(d => d.status === "pending").length;
    if (id === "assemblee") return Object.values(S.laws).filter(l => l.status === "pending").length;
    return 0;
  }

  function renderHome() {
    const [m, col] = mood();
    $("#widget").innerHTML = `
      <span class="wk">${weekLabel(S.week)} · ${C.programme(S).emoji} ${esc(C.programme(S).name)}</span>
      <span class="wt">${esc(weekInfo(S.week).title)}</span>
      <span class="wpop"><b>${Math.round(pop())}%</b><small>Popularité</small></span>
      <span class="wmood">Climat social <span class="mood-pill" style="background:${col}22;color:${col}">${m}</span></span>
      <button id="btn-dnd" class="btn-dnd" type="button"${S.dead ? " disabled" : ""}><span>🌙</span> Ne pas déranger<small>Tes ministres décident à ta place</small></button>`;
    $("#apps").innerHTML = (S.pente ? [PARAPHEUR, ...APPS.slice(0, 7)] : APPS).map(appIcon).join("");
    $("#dock").innerHTML = DOCK.map(appIcon).join("");
  }

  function updateBadges() {
    if (view === "home") renderHome();
  }

  // ------------------------------------------------------------------ rendu : messages
  function renderConvList() {
    const ids = Object.keys(S.convs).sort((a, b) => S.convs[b].last - S.convs[a].last);
    $("#conv-list").innerHTML = ids.length ? ids.map(id => {
      const c = contact(id), cv = S.convs[id];
      const dot = cv.pending ? `<span class="dot urgent"></span>` : cv.unread ? `<span class="dot"></span>` : "";
      return `<button class="conv" type="button" data-thread="${id}">
        <span class="av" style="background:${c.col}">${c.av}</span>
        <span class="nm">${esc(c.name)}</span><span class="tm">${dot}</span>
        <span class="pv">${esc(cv.typing ? "écrit…" : cv.lastText)}</span>
      </button>`;
    }).join("") : `<p class="empty">Aucun message. Profite, ça ne durera pas.</p>`;
  }

  function renderThread() {
    const cv = S.convs[threadId];
    const c = contact(threadId);
    cv.unread = 0;
    $("#thread-who").innerHTML = `<span class="av" style="background:${c.col}">${c.av}</span><span style="min-width:0"><b>${esc(c.name)}</b><small>${esc(c.role || "")}</small></span>`;
    let lastD = null;
    let html = "";
    for (const m of cv.msgs) {
      if (m.d && m.d !== lastD) {
        lastD = m.d;
        html += `<div class="day-sep">Semaine ${Math.floor(m.d / 10)} · ${DAYS_FULL[m.d % 10]}</div>`;
      }
      html += `<div class="bub ${m.k}">${esc(m.text)}</div>`;
    }
    if (cv.typing) html += `<div class="bub them typing"><i></i><i></i><i></i></div>`;
    const body = $("#thread-body");
    body.innerHTML = html;
    body.scrollTop = body.scrollHeight;

    const e = cv.pending ? EV[cv.pending] : null;
    const rep = $("#replies");
    if (!e || S.ending) { rep.innerHTML = ""; return; }
    rep.innerHTML = `<span class="hint">Répondre</span>` + e.c.map((ch, i) => {
      if (ch.when && !ch.when(S)) return "";
      return `<button class="reply" type="button" data-choice="${i}" ${S.dead ? "disabled" : ""}>
        <span>${esc(ch.t)}</span>
        <span class="meta">${ch.leak ? `<span class="lk" title="Risque de fuite">🔓</span>` : ""}🔋${ch.cost ?? 8}</span>
      </button>`;
    }).join("") + `<button class="reply letgo" type="button" data-letgo ${S.dead ? "disabled" : ""}><span>🙈 Laisser sans réponse</span><span class="meta">🔋0</span></button>`;
  }

  // ------------------------------------------------------------------ rendu : le fil
  function hue(s) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360; return h; }
  const fmtN = n => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",")} k` : String(n);

  function renderFil() {
    S.feedUnread = 0;
    const counts = {};
    S.feed.slice(0, 30).forEach(p => (p.t.match(/#[\p{L}\p{N}_]+/gu) || []).forEach(t => { counts[t] = (counts[t] || 0) + 1 + p.likes / 5000; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    $("#trends").innerHTML = top.map(([t, n], i) => `<span class="trend">${esc(t)}<small>${i === 0 ? "🔥" : ""}</small></span>`).join("");
    $("#feed").innerHTML = S.feed.length ? S.feed.map(p => {
      const name = p.h.replace("@", "");
      const bg = p.mine ? "var(--me)" : p.leak ? "#b3121f" : `hsl(${hue(name)} 45% 38%)`;
      return `<article class="post ${p.mine ? "mine" : ""} ${p.leak ? "leak" : ""}">
        <span class="pav" style="background:${bg}">${p.mine ? "🇭🇽" : p.leak ? "👁️" : esc(name[0].toUpperCase())}</span>
        <div style="min-width:0">
          <div class="ph"><b>${esc(p.h)}</b><span>· ${esc(p.time)}</span></div>
          <div class="pt">${tags(p.t)}</div>
          ${p.shot ? `<div class="shot"><span class="to">Le Président → ${esc(p.shot.to)}</span><div class="bub me">${esc(p.shot.text)}</div></div>` : ""}
          <div class="ps"><span>🔁 ${fmtN(p.rts)}</span><span>♥ ${fmtN(p.likes)}</span></div>
        </div>
      </article>`;
    }).join("") : `<p class="empty">Le Fil est calme. C’est rarement bon signe.</p>`;
    const can = !S.posted && !S.dead && postsOf(S.week);
    $("#btn-post").disabled = !can;
    $("#btn-post").textContent = S.posted ? "Publié" : "Publier";
  }

  function openComposer() {
    const opts = postsOf(S.week);
    if (!opts || S.posted) return;
    const el = $("#composer");
    el.innerHTML = `<div class="sheet">
      <h3>Publier sur Le Fil</h3>
      <p>Clémence a préparé trois versions. Une seule publication par semaine.</p>
      ${opts.map((o, i) => `<button class="reply" type="button" data-post="${i}"><span>${esc(o.t)}</span><span class="meta">🔋${POST_COST}</span></button>`).join("")}
      <button class="cancel" type="button" data-post="x">Annuler</button>
    </div>`;
    el.hidden = false;
  }

  // ------------------------------------------------------------------ rendu : sondages
  function spark(vals) {
    if (vals.length < 2) vals = [vals[0], vals[0]];
    const w = 300, h = 56, lo = 0, hi = 100;
    const pts = vals.map((v, i) => [i * w / (vals.length - 1), h - 4 - (v - lo) / (hi - lo) * (h - 8)]);
    const line = pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
    const last = pts[pts.length - 1];
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" x2="${w}" y1="${h - 4 - 0.5 * (h - 8)}" y2="${h - 4 - 0.5 * (h - 8)}" stroke="#2a2f42" stroke-dasharray="3 4"/>
      <polygon points="0,${h} ${line} ${w},${h}" fill="rgba(238,240,246,.08)"/>
      <polyline points="${line}" fill="none" stroke="#eef0f6" stroke-width="2" vector-effect="non-scaling-stroke"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="#eef0f6"/>
    </svg>`;
  }

  function deltaHtml(d) {
    d = Math.round(d);
    if (!d) return "";
    return `<span class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "▲" : "▼"}${Math.abs(d)}</span>`;
  }

  function barRow(label, v, d, color) {
    return `<div class="bar-row"><span>${label}</span><span class="bar"><i style="width:${v}%;background:${color || "var(--fg)"}"></i></span><span class="v">${Math.round(v)}${deltaHtml(d)}</span></div>`;
  }

  function renderSondages() {
    const ws = S.weekStart;
    const [m, col] = mood();
    const p = pop();
    $("#polls").innerHTML = `<div class="polls">
      <div class="big-pop"><span class="n">${Math.round(p)}%</span><span><span class="l">Popularité</span> ${deltaHtml(p - ws.pop)}<br><span class="l">Élection : semaine 8</span></span></div>
      ${spark([...S.popHist, Math.round(p)])}
      <div class="card"><h3>Par groupe</h3>
        ${GROUPS.map(k => barRow(LABEL[k], S.g[k], S.g[k] - ws.g[k])).join("")}
      </div>
      <div class="card"><h3>L’État</h3>
        ${barRow("Ordre", S.ordre, S.ordre - ws.ordre, "#6f9bff")}
        ${barRow("Caisses", S.budget, S.budget - ws.budget, "#34d68a")}
        ${planetRow()}
        <div class="bar-row"><span>Climat</span><span class="mood-pill" style="background:${col}22;color:${col};justify-self:start">${m}</span><span></span></div>
      </div>
      ${overtonCard()}
      ${pollCard()}
      <div class="card"><h3>Bilan du mandat</h3>
        <div class="stats">
          <div class="stat"><b>${S.stats.blesses.toLocaleString("fr-FR")}</b><span>manifestants blessés</span></div>
          <div class="stat"><b>${S.stats.gav.toLocaleString("fr-FR")}</b><span>gardes à vue</span></div>
          <div class="stat"><b>${S.stats.fuites}</b><span>fuites</span></div>
          <div class="stat"><b>${S.stats.ignores}</b><span>messages ignorés</span></div>
          <div class="stat"><b>${S.stats.lois}</b><span>lois adoptées</span></div>
          <div class="stat"><b>${S.n493}</b><span>49.3</span></div>
        </div>
      </div>
    </div>`;
  }

  function ecoMood() {
    const e = S.eco;
    if (e < 35) return ["Ça tient", "#34d68a"];
    if (e < 55) return ["Inquiétant", "#a3d635"];
    if (e < 75) return ["Points de bascule", "#ffb020"];
    if (e < 90) return ["Emballement", "#ff7a2f"];
    return ["Effondrement imminent", "#ff3d4a"];
  }

  function planetRow() {
    const [m, col] = ecoMood();
    const v = 100 - S.eco;
    return `<div class="bar-row"><span>Planète</span><span class="bar"><i style="width:${v}%;background:${col}"></i></span><span class="v" style="color:${col};font-size:12px">${m}</span></div>`;
  }

  // ------------------------------------------------------------------ rendu : actu & agenda
  function renderActu() {
    S.newsUnread = 0;
    if (!S.news.length) { $("#news").innerHTML = `<p class="empty">Rien à la une. Les rédactions s’ennuient. Ça ne va pas durer.</p>`; return; }
    let html = "", lastW = null, first = true;
    for (const n of S.news) {
      if (n.w !== lastW) { lastW = n.w; html += `<div class="news-week">Semaine ${n.w} · ${esc(weekInfo(n.w).title)}</div>`; }
      html += `<div class="headline ${first ? "first" : ""}">${first ? `<span class="live">DIRECT</span>` : ""}${esc(n.text)}</div>`;
      first = false;
    }
    $("#news").innerHTML = html;
  }

  function renderAgenda() {
    let html = promisesCard(false);
    for (let w = 1; w <= (S.pente ? C.penteLastWeek : (C.lastWeek || 8)); w++) {
      const wk = weekInfo(w);
      const cls = w < S.week ? "past" : w === S.week ? "now" : "";
      const known = w <= S.week + 1 || w === (C.lastWeek || 8);
      html += `<div class="ag-week ${cls}"><span class="n">${w}</span><b>${known ? esc(wk.title) : "???"}</b>
        <ul>${known ? wk.agenda.map(a => `<li>${esc(a)}</li>`).join("") : "<li>Personne ne sait. Même pas vous.</li>"}</ul></div>`;
    }
    $("#agenda").innerHTML = html;
  }

  // ------------------------------------------------------------------ rendu : appel
  function renderCall() {
    const e = EV[S.call.id];
    const c = contact(val(e.from));
    const el = $("#call");
    if (S.call.phase === "ring") {
      el.innerHTML = `<span class="av" style="background:${c.col}">${c.av}</span>
        <div class="cn">${esc(c.name)}</div><div class="cr">${esc(c.role || "")}</div>
        <div class="ring">Appel entrant…</div>
        <div class="timer"><i></i></div>
        <div class="call-btns">
          <button class="cb no" type="button" data-call="no"><i>✕</i>Refuser</button>
          <button class="cb yes" type="button" data-call="yes"><i>📞</i>Décrocher · 🔋8</button>
        </div>`;
    } else {
      el.innerHTML = `<div class="cn" style="font-size:20px">${c.av} ${esc(c.name)}</div><div class="cr">En ligne · il raccroche si tu ne dis rien</div>
        <div class="timer"><i></i></div>
        <div class="talk">${val(e.m).map(t => `<div class="bub them">${esc(t)}</div>`).join("")}</div>
        <div class="talk-choices">${e.c.map((ch, i) => `<button class="reply" type="button" data-callchoice="${i}"><span>${esc(ch.t)}</span><span class="meta">${ch.leak ? `<span class="lk">🔓</span>` : ""}🔋${ch.cost ?? 4}</span></button>`).join("")}</div>`;
    }
    el.hidden = false;
  }

  // ------------------------------------------------------------------ récap & fin
  function showRecap() {
    const ws = S.weekStart;
    const heads = S.news.filter(n => n.w === S.week).map(n => n.text).reverse();
    const notes = [];
    if (S.ignoredWeek) notes.push(`<b>${S.ignoredWeek}</b> message${S.ignoredWeek > 1 ? "s" : ""} ignoré${S.ignoredWeek > 1 ? "s" : ""}. Tes ministres ont improvisé.`);
    if (S.leaksWeek) notes.push(`<b>${S.leaksWeek}</b> fuite${S.leaksWeek > 1 ? "s" : ""} dans la presse.`);
    if (S.deadAt) notes.push(`Ton téléphone est mort ${S.deadAt}.`);
    const pending = S.sched.filter(q => q.kind === "leak").length;
    if (pending) notes.push(`Quelque part, quelqu’un garde une capture d’écran.`);
    if (S.pente) {
      const wk = S.pente.signed.filter(d => d.w === S.week);
      if (wk.length) notes.push(`📁 Décrets signés cette semaine : ${wk.map(d => `n° ${d.n} (${d.by === "toi" ? "par toi" : esc(d.by)})`).join(", ")}.`);
    }
    if (S.dndWeek) notes.push(`🌙 Mode Ne pas déranger : tes ministres ont pris <b>${S.dndWeek}</b> décision${S.dndWeek > 1 ? "s" : ""} sans toi.`);
    if (S.week === 1) notes.push(`L’usure du pouvoir te coûte un peu de popularité chaque semaine. Rester immobile, c’est reculer.`);
    if (S.ecoWeek >= 0) notes.push(`Rien n’a été fait pour le climat cette semaine. La dette écologique monte quand même : le CO₂ ne lit pas l’ordre du jour.`);
    const waiting = Object.values(S.laws).filter(l => l.status === "pending").length;
    if (waiting) notes.push(`<b>${waiting}</b> texte${waiting > 1 ? "s" : ""} en attente à l’Assemblée. Sans vote, ils seront enterrés.`);
    const [m, col] = mood();
    const el = $("#recap");
    el.innerHTML = `<div class="rc">
      <span class="k">${weekLabel(S.week)} · terminée</span>
      <h2>${esc(weekInfo(S.week).title)}</h2>
      ${heads.length ? `<ul class="heads">${heads.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : `<p class="note">Aucune une cette semaine. Une semaine calme, c’est suspect.</p>`}
      <div class="card"><h3>Popularité : ${Math.round(pop())}% ${deltaHtml(pop() - ws.pop)}</h3>
        ${GROUPS.map(k => barRow(LABEL[k], S.g[k], S.g[k] - ws.g[k])).join("")}
        ${barRow("Ordre", S.ordre, S.ordre - ws.ordre, "#6f9bff")}
        ${barRow("Caisses", S.budget, S.budget - ws.budget, "#34d68a")}
        ${planetRow()}
      </div>
      <p class="note">Climat social : <span class="mood-pill" style="background:${col}22;color:${col}">${m}</span></p>
      ${notes.map(n => `<p class="note">${n}</p>`).join("")}
      <button class="btn-primary" type="button" id="btn-next">Semaine ${S.week + 1} →</button>
    </div>`;
    el.hidden = false;
    el.scrollTop = 0;
    $("#btn-next").onclick = () => { el.hidden = true; startWeek(S.week + 1); };
  }

  function seenEndings() {
    try { return JSON.parse(localStorage.getItem("npd_endings") || "[]"); } catch { return []; }
  }

  function markEnding(id) {
    const seen = seenEndings().filter(k => C.endings[k]);
    if (!seen.includes(id)) seen.push(id);
    try { localStorage.setItem("npd_endings", JSON.stringify(seen)); } catch { /* stockage indisponible */ }
    return seen;
  }

  // les réponses que le tribunal retiendra : La Pente, la répression, le report, les dénonciations, les mots
  const GRAVE_FLAGS = [...REPRESSION_FLAGS, "pente", "remigration", "prenoms", "binationaux", "decore", "ginetteSignale", "ginetteDenoncee",
    "moussaRecense", "mamanVoisine", "sortieCEDH", "jugesAmis", "revisionPref", "pacteRH", "unionDroites", "diabolise", "fauxDossiers", "presomption"];
  const isGrave = (e, ch) => /^(p(9|10|11|12)_|prod_|w8_report|w8_conseiller|w7_securite)/.test(e.id)
    || Object.keys(ch.set || {}).some(k => GRAVE_FLAGS.includes(k));
  const aQui = n => (n.startsWith("Le ") ? `au ${n.slice(3)}` : n.startsWith("Les ") ? `aux ${n.slice(4)}` : `à ${n}`);

  // arrête le temps et ferme tout ce qui est ouvert, avant une fin
  function haltGame() {
    S.running = false;
    if (S.call) { S.call = null; $("#call").hidden = true; }
    ["#dead", "#banner", "#composer", "#recap", "#card", "#vote", "#dnd", "#avert", "#proces", "#verite"].forEach(s => { const el = $(s); if (el) el.hidden = true; });
    S.dnd = null;
    voteOpen = false;
  }

  // ------------------------------------------------------------------ La Pente : le Procès, puis l'écran de vérité
  function showProces(id) {
    haltGame();
    S.ending = id;
    S.verite = true;
    $("#phone").dataset.pente = 0;
    const P = C.proces;
    const mine = S.pente.signed.filter(d => d.by === "toi");
    const silent = S.pente.signed.filter(d => d.by !== "toi");
    // tes vrais SMS de la fin du mandat, avec leur heure
    const sms = Object.entries(S.convs).flatMap(([cid, cv]) => cv.msgs.filter(m => m.k === "me" && m.time && m.grave).map(m => ({ ...m, to: contact(cid).name })))
      .sort((a, b) => a.d - b.d || a.time.localeCompare(b.time)).slice(-9);
    const temoins = P.temoins.map(t => ({ ...t, line: t.text(S) })).filter(t => t.line);
    const circ = P.circonstances(S);
    const defs = (mine.length + silent.length ? P.defenses : P.declarations).filter(d => !d.when || d.when(S));
    const box = $("#proces");
    box.innerHTML = `<div class="rc proces">
      <span class="end-k">${esc(P.titre)}</span>
      <h2 class="end-t">Le Procès</h2>
      <p class="end-p">${esc(P.intro(mine.length + silent.length))}</p>
      ${S.pente.signed.length ? `<div class="card"><h3>Acte d’accusation</h3>
        ${S.pente.signed.map(d => `<p class="pr-dec"><b>Décret n° ${d.n}</b> · ${esc(d.title)}<small>${d.by === "toi" ? `signé de ta main, ${esc(d.when)}` : `signé « en ton nom » par ${esc(d.by)}, ${esc(d.when)}, pendant que tu ne répondais pas`}</small></p>`).join("")}
      </div>` : ""}
      <div class="card"><h3>Pièces à conviction</h3>
        ${sms.length ? sms.map(m => `<div class="pr-sms"><small>Semaine ${m.w} · ${esc(m.time)} · ${esc(aQui(m.to))}</small><div class="bub me">${esc(m.text)}</div></div>`).join("")
          : `<p class="note">Aucun SMS retenu. Sur ces sujets, tu n’as répondu à personne. Le tribunal a versé ton silence au dossier.</p>`}
      </div>
      ${temoins.length ? `<div class="card epi"><h3>Les témoins</h3>
        ${temoins.map(t => `<div class="epi-row"><span class="av" style="background:${t.col}">${t.av}</span><div><b>${esc(t.name)}</b><p>${esc(t.line)}</p></div></div>`).join("")}
      </div>` : ""}
      ${circ.length ? `<div class="card"><h3>Le tribunal note aussi</h3>${circ.map(c => `<p class="note">· ${esc(c)}</p>`).join("")}</div>` : ""}
      <div class="card" id="pr-def"><h3>${mine.length + silent.length ? "Ta défense" : "Ta déclaration"}</h3>
        <div class="pr-choices">${defs.map(d => `<button class="reply" type="button" data-def="${d.id}">${esc(d.t)}</button>`).join("")}</div>
      </div>
      <div id="pr-verdict"></div>
    </div>`;
    box.hidden = false;
    box.scrollTop = 0;
    box.querySelectorAll("[data-def]").forEach(b => { b.onclick = () => {
      const d = defs.find(x => x.id === b.dataset.def);
      const v = P.verdict(S, mine.length, silent.length);
      S.defense = d.id;
      $("#pr-def").innerHTML = `<h3>${mine.length + silent.length ? "Ta défense" : "Ta déclaration"}</h3><div class="bub me">${esc(d.t)}</div><p class="end-p pr-r">${esc(d.r(S))}</p>`;
      $("#pr-verdict").innerHTML = `<div class="card pr-v"><h3>Verdict</h3><p class="pr-vt">${esc(v.t)}</p><p class="end-p">${esc(v.p)}</p></div>
        <button class="btn-primary" type="button" id="btn-verite">Sortir de la fiction</button>`;
      $("#btn-verite").onclick = () => showVerite(id);
      $("#pr-verdict").scrollIntoView({ behavior: "smooth", block: "start" });
    }; });
    updateStatus();
  }

  function showVerite(id) {
    $("#proces").hidden = true;
    const V = C.verite;
    const mine = S.pente.signed.filter(d => d.by === "toi");
    const maxV = mine.reduce((m, d) => Math.max(m, DECREE[d.id].volt), 0);
    const scale = C.decrees.map(d => {
      const st = S.decrees[d.id];
      const cls = !st ? "none" : st.status === "refused" ? "ref" : st.by === "toi" ? "me" : st.status === "signed" ? "sec" : "none";
      const lab = { none: "jamais arrivé", ref: "refusé", me: "signé par toi", sec: "signé en ton nom" }[cls];
      return `<div class="vt-row ${cls}"><b>${d.volt} V</b><span>${esc(d.title)}</span><small>${lab}</small></div>`;
    }).join("");
    const you = maxV >= 450 ? "Tu es allé jusqu’à 450 volts. Comme 65 % des participants de Milgram."
      : maxV ? `Tu t’es arrêté à ${maxV} volts. Dans l’expérience, 35 % des participants se sont arrêtés avant la fin. Aucun avant 300 volts.`
      : "Tu n’as rien signé toi-même. Dans l’expérience de Milgram, personne ne s’est arrêté avant 300 volts.";
    const sig = V.signaux.map(g => {
      const hits = g.tests.filter(([t]) => t(S)).map(([, l]) => (typeof l === "function" ? l(S) : l));
      const txt = hits.join(" ; ");
      return `<div class="vt-sig ${hits.length ? "on" : ""}"><b>${hits.length ? "🔴" : "⚪"} ${esc(g.titre)}</b>${hits.length ? `<p>${esc(txt[0].toUpperCase() + txt.slice(1))}.</p>` : `<p>Pas dans ta partie.</p>`}</div>`;
    }).join("");
    const lit = V.signaux.filter(g => g.tests.some(([t]) => t(S))).length;
    const box = $("#verite");
    box.innerHTML = `<div class="rc verite">
      <span class="end-k">L’écran de vérité</span>
      <h2 class="end-t">Ce n’était pas qu’un jeu</h2>
      <p class="end-p">Ce jeu est une fiction. Ce qu’il imite ne l’est pas.</p>
      <div class="card"><h3>L’expérience de Milgram</h3>
        ${V.milgram.map(p => `<p class="note">${esc(p)}</p>`).join("")}
        <div class="vt-scale">${scale}</div>
        <p class="end-p vt-you">${esc(you)}</p>
      </div>
      <div class="card"><h3>Les 4 signaux d’alerte · ${lit} / 4 allumés</h3>
        <p class="note">Steven Levitsky et Daniel Ziblatt ont étudié comment meurent les démocraties. Pas par un coup d’État, le plus souvent : par des dirigeants élus qui montrent ces quatre signaux. Voici les tiens.</p>
        ${sig}
      </div>
      <div class="card"><h3>L’histoire</h3>${V.histoire.map(p => `<p class="note">${esc(p)}</p>`).join("")}</div>
      <div class="card"><h3>Pour aller plus loin</h3>${V.sources.map(p => `<p class="note">· ${esc(p)}</p>`).join("")}</div>
      <button class="btn-primary" type="button" id="btn-fin">Voir ce qu’ils sont devenus</button>
    </div>`;
    box.hidden = false;
    box.scrollTop = 0;
    $("#btn-fin").onclick = () => { box.hidden = true; showEnding(id); };
  }

  function showEnding(id) {
    // La Pente se termine toujours par le Procès, puis l'écran de vérité
    if (S.pente && !S.procesVu) { S.procesVu = true; showProces(id); return; }
    haltGame();
    S.ending = id;
    const E = pv(C.endings[id]);
    const p = pop();
    const rep = REPRESSION_FLAGS.filter(f => S.flags[f]).length;
    let text = E.text, vote = "", you = "";
    const el = S.election;
    if (id === "reelu") {
      const v = (el ? el.r2[0].pct : 50.1 + (p - 45) * 1.1).toFixed(1).replace(".", ",");
      const kept = C.promiseStates(S, true).filter(x => x.st === "ok").length;
      vote = `${v} %`;
      text = kept >= 3
        ? `Réélu avec ${v} %, et tu as tenu ${kept} promesses sur 4. Ça arrive. Rarement. Les historiens vérifieront deux fois.`
        : kept <= 1
          ? `Réélu avec ${v} %, en ayant trahi ${4 - kept} promesses sur 4. Tes électeurs ont voté pour toi « faute de mieux ». La démocratie a ses mystères.`
          : rep >= 4
        ? `Réélu avec ${v} %. Les autres sont en garde à vue. Le soir de la victoire, la place est vide : les rassemblements sont interdits. Tu fêtes ça avec le préfet. Il a apporté des lacrymos, par habitude.`
        : S.colere < 45
          ? `Réélu avec ${v} %. Le pays n’est pas guéri, mais il respire. Tu as appris un truc rare : écouter coûte moins cher que réprimer. Personne ne te croira.`
          : `Réélu de justesse avec ${v} %, dans un pays qui ne se parle plus. Tu as gagné l’élection. Tu as perdu tout le reste.`;
    } else if (id.startsWith("win_") && el) {
      const v = el.r2[0].pct.toFixed(1).replace(".", ",");
      vote = `${C.candName(S, el.winner)} · ${v} %`;
      text = text.replace("{p}", v);
      you = C.youSentence(S, el);
    }
    text = text.replace("{n}", id === "revoque" ? S.revokePct : ["dictateur", "refus"].includes(id) ? signedCount("toi") : S.lastCensure)
      .replace("Tu en avais signé 0 avant de dire non.", "Tu n’en as signé aucun.");
    const eco = C.ecoText(S, id);
    if (eco && eco.level === "collapse") markEnding("effondrement");
    const seen = markEnding(id);
    const box = $("#ending");
    box.innerHTML = `<div class="rc">
      <span class="end-k">Fin · Semaine ${S.week}</span>
      <h2 class="end-t">${esc(E.title)}</h2>
      ${vote ? `<span class="end-vote">${esc(vote)}</span>` : ""}
      <p class="end-p">${esc(text)}</p>
      ${you ? `<p class="end-p end-you">${esc(you)}</p>` : ""}
      ${eco ? `<div class="eco-end ${eco.level}">${eco.level === "collapse" ? `<b>🔥 Effondrement systémique</b>` : `<b>🌡️ Points de bascule</b>`}<p>${esc(eco.text)}</p></div>` : ""}
      ${promisesCard(true)}
      <div class="card epi"><h3>Ce qu’ils sont devenus</h3>
        ${C.epilogue.map(c => `<div class="epi-row"><span class="av" style="background:${c.col}">${c.av}</span><div><b>${esc(c.name)}</b><small>${esc(c.role)}</small><p>${esc(c.text(S))}</p></div></div>`).join("")}
      </div>
      <div class="card epi"><h3>Et les autres</h3>
        ${C.epilogueOthers.map(c => `<p class="epi-other"><b>${esc(c.name)}</b> ${esc(c.text(S))}</p>`).join("")}
      </div>
      <div class="card"><h3>Ton bilan</h3>
        <div class="stats">
          <div class="stat"><b>${Math.round(p)} %</b><span>popularité finale</span></div>
          <div class="stat"><b>${S.stats.blesses.toLocaleString("fr-FR")}</b><span>manifestants blessés</span></div>
          <div class="stat"><b>${S.stats.gav.toLocaleString("fr-FR")}</b><span>gardes à vue</span></div>
          <div class="stat"><b>${S.stats.fuites}</b><span>SMS fuités</span></div>
          <div class="stat"><b>${S.stats.ignores}</b><span>messages ignorés</span></div>
          <div class="stat"><b>${S.stats.feries}</b><span>jours fériés supprimés</span></div>
          <div class="stat"><b>${S.n493}</b><span>49.3 dégainés</span></div>
          <div class="stat"><b>${100 - S.eco} %</b><span>de planète restante</span></div>
          <div class="stat"><b>${S.stats.dnd}</b><span>décisions prises sans toi</span></div>
        </div>
      </div>
      <div class="card"><h3>Fins découvertes · ${seen.length} / ${Object.keys(C.endings).length}</h3>
        <div class="end-collect">${Object.entries(C.endings).map(([k, v]) => `<span class="${seen.includes(k) ? "got" : ""}">${seen.includes(k) ? esc(v.title) : "???"}</span>`).join("")}</div>
      </div>
      <button class="btn-primary" type="button" id="btn-again">Nouveau mandat</button>
    </div>`;
    box.hidden = false;
    box.scrollTop = 0;
    $("#btn-again").onclick = () => { $("#ending").hidden = true; go("programme"); };
    updateStatus();
  }

  // ------------------------------------------------------------------ retours visuels
  function banner(c, text, onTap, isLeak) {
    const el = $("#banner");
    el.className = isLeak ? "leak" : "";
    el.innerHTML = `<span class="av" style="background:${c.col}">${c.av}</span><b>${esc(c.name)}</b><span>${esc(text)}</span>`;
    el.hidden = false;
    el.onclick = () => { el.hidden = true; onTap(); };
    // relance l'animation d'entrée
    el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => { el.hidden = true; }, isLeak ? 5000 : 3600);
  }

  function showFx(d) {
    const items = Object.entries(d).filter(([k, v]) => v && k !== "colere" && LABEL[k]);
    if (!items.length) return;
    const el = $("#fx-toast");
    el.innerHTML = items.map(([k, v]) => {
      if (k === "eco") v = -v; // plus de dette écologique = moins de planète
      const arrows = v > 0 ? (v >= 8 ? "↑↑" : "↑") : (v <= -8 ? "↓↓" : "↓");
      return `<span class="${v > 0 ? "up" : "down"}">${LABEL[k]} ${arrows}</span>`;
    }).join("");
    el.hidden = false;
    clearTimeout(fxTimer);
    fxTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  function textToast(t) {
    const el = $("#fx-toast");
    el.innerHTML = `<span>${esc(t)}</span>`;
    el.hidden = false;
    clearTimeout(fxTimer);
    fxTimer = setTimeout(() => { el.hidden = true; }, 3000);
  }

  function buzz(p) {
    try { navigator.vibrate && navigator.vibrate(p || 60); } catch { /* vibreur indisponible */ }
  }

  // ------------------------------------------------------------------ navigation
  function go(v) {
    view = v;
    if (v === "programme") renderProgrammes();
    document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === `v-${v}`));
    refresh();
  }

  function openThread(id) {
    threadId = id;
    go("thread");
  }

  function refresh() {
    if (!S) return;
    updateStatus();
    if (view === "home") renderHome();
    else if (view === "messages") renderConvList();
    else if (view === "thread") renderThread();
    else if (view === "fil") renderFil();
    else if (view === "sondages") renderSondages();
    else if (view === "actu") renderActu();
    else if (view === "agenda") renderAgenda();
    else if (view === "assemblee") renderAssemblee();
    else if (view === "parapheur") renderParapheur();
  }

  function newGame(progId) {
    S = newState(progId);
    [...C.events, ...C.pool, ...C.alerts].forEach(e => { EV[e.id] = pv(e); });
    $("#phone").dataset.pente = 0;
    for (let i = 0; i < 3; i++) {
      const [h, t] = ((C.ambientBy && C.ambientBy[S.programme]) || C.ambient).calm[i];
      S.feed.push({ h, t, likes: Math.floor(rnd(40, 3000)), rts: Math.floor(rnd(5, 400)), time: "Dim 22:1" + i });
    }
    S.feedUnread = 0;
    go("lock");
  }

  // ------------------------------------------------------------------ écouteurs
  document.addEventListener("click", ev => {
    const t = ev.target.closest("button, [data-app]");
    if (!t) return;
    if (t.id === "btn-start") return go("programme");
    if (t.dataset.prog) return newGame(t.dataset.prog);
    if (t.id === "btn-election") return closeElection();
    if (t.id === "btn-unlock") return startWeek(1);
    if (t.id === "homebar") { if (S && !["title", "lock"].includes(view)) go("home"); return; }
    if (t.id === "ff") { letGo(); return; }
    if (t.dataset.letgo !== undefined) { if (S && threadId && S.convs[threadId] && S.convs[threadId].pending && !S.dead) { ignore(threadId, "🙈 Laissé sans réponse"); refresh(); } return; }
    if (t.id === "btn-post") return openComposer();
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.thread) return openThread(t.dataset.thread);
    if (t.dataset.choice !== undefined) return choose(threadId, +t.dataset.choice);
    if (t.dataset.callchoice !== undefined) return callChoose(+t.dataset.callchoice);
    if (t.dataset.call === "yes") return acceptCall();
    if (t.dataset.call === "no") { if (S.call && S.call.phase === "ring") missCall(); return; }
    if (t.dataset.post !== undefined) { if (t.dataset.post === "x") $("#composer").hidden = true; else publish(+t.dataset.post); return; }
    if (t.dataset.vote) return voteLaw(t.dataset.law, t.dataset.vote);
    if (t.id === "btn-vote-close") return closeVote();
    if (t.id === "btn-dnd") return startDnd();
    if (t.id === "btn-avert") { $("#avert").hidden = true; voteOpen = false; lastTs = 0; return go("parapheur"); }
    if (t.dataset.decree) return t.dataset.dact === "sign" ? signDecree(t.dataset.decree) : refuseDecree(t.dataset.decree);
    if (t.id === "btn-dnd-stop") return stopDnd();
    if (t.dataset.app) {
      const a = [...APPS, ...DOCK, PARAPHEUR].find(x => x.id === t.dataset.app);
      if (a.fake) return textToast(a.fake);
      return go(a.id);
    }
  });

  document.addEventListener("visibilitychange", () => { lastTs = 0; });

  // ------------------------------------------------------------------ démarrage
  const seen = seenEndings();
  if (seen.length) $("#endings-count").textContent = `Fins découvertes : ${seen.length} / ${Object.keys(C.endings).length}`;
  go("title");
  updateStatus();
  requestAnimationFrame(tick);
})();
