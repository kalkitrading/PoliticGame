// Ne Pas Déranger — moteur du jeu.
(() => {
  "use strict";

  const C = window.CONTENT;
  const WEEK_MS = 110000;          // durée réelle d'une semaine à vitesse normale
  const FAST = 7;                   // multiplicateur en accéléré
  const CALL_RING_MS = 12000;       // temps pour décrocher
  const CALL_TALK_MS = 22000;       // temps pour répondre pendant l'appel
  const PASSIVE_DRAIN = 14;         // % de batterie perdus par semaine sans rien faire
  const POST_COST = 6;
  const GROUPS = ["jeunes", "ouvriers", "retraites", "patrons", "police"];
  const LABEL = { jeunes: "Jeunes", ouvriers: "Ouvriers", retraites: "Retraités", patrons: "Patrons", police: "Police", ordre: "Ordre", budget: "Caisses" };
  const WEIGHTS = { jeunes: .22, ouvriers: .28, retraites: .30, patrons: .08, police: .12 };
  const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const DAYS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const REPRESSION_FLAGS = ["repression", "carteBlanche", "charge", "requisition", "interdiction", "perquisition", "armee", "securiteAbsolue"];
  const EV = {};
  C.events.forEach(e => { EV[e.id] = e; });
  C.pool.forEach(e => { EV[e.id] = e; });

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const val = x => (typeof x === "function" ? x(S) : x);
  const tags = s => esc(s).replace(/#[\p{L}\p{N}_]+/gu, m => `<span class="tag">${m}</span>`);

  let S = null;
  let view = "title";
  let threadId = null;
  let bannerTimer = 0, fxTimer = 0, cardTimer = 0;

  // ------------------------------------------------------------------ état
  function newState() {
    return {
      week: 1, t: 0, speed: 1, running: false, battery: 100, dead: false, deadAt: null, lowWarned: false,
      g: { jeunes: 38, ouvriers: 32, retraites: 55, patrons: 62, police: 58 },
      ordre: 60, budget: 60, colere: 30,
      flags: {},
      stats: { blesses: 0, gav: 0, fuites: 0, ignores: 0, feries: 0 },
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
  const contact = id => C.contacts[id] || { name: id, av: "❓", col: "#444" };

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
    if (o.fx) {
      for (const [k, v] of Object.entries(o.fx)) {
        if (GROUPS.includes(k)) {
          const b = S.g[k]; S.g[k] = clamp(S.g[k] + v, 0, 100); d[k] = S.g[k] - b;
        } else if (k === "ordre" || k === "budget" || k === "colere") {
          const b = S[k]; S[k] = clamp(S[k] + v, 0, 100); d[k] = S[k] - b;
        } else if (k in S.stats) {
          S.stats[k] = Math.max(0, S.stats[k] + v);
        }
      }
    }
    if (o.set) Object.assign(S.flags, o.set);
    if (o.news) addNews(o.news);
    if (o.posts) o.posts.forEach((p, i) => schedulePost(p[0], p[1], 0.015 + i * 0.02));
    return d;
  }

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
    if (S && S.running && !document.hidden) {
      if (S.call && S.call.phase !== "end") {
        S.call.left -= dt;
        const bar = $("#call .timer i");
        if (bar) bar.style.width = `${clamp(S.call.left / (S.call.phase === "ring" ? CALL_RING_MS : CALL_TALK_MS), 0, 1) * 100}%`;
        const rt = $("#call .ring");
        if (rt && S.call.phase === "ring") rt.textContent = `Appel entrant… ${Math.ceil(S.call.left / 1000)} s`;
        if (S.call.left <= 0) missCall();
      }
      const speed = S.call ? 1 : S.speed;
      const dw = dt * speed / WEEK_MS;
      S.t += dw;
      drain(dw * PASSIVE_DRAIN);
      spawn();
      if (!S.ending) {
        const end = checkEnd();
        if (end) endGameSoon(end);
      }
      if (S.running && S.t >= 1) endWeek();
      updateStatus();
    }
    requestAnimationFrame(tick);
  }

  function spawn() {
    for (const e of C.events) {
      if (e.w !== S.week || S.spawned[e.id] || e.at > S.t) continue;
      S.spawned[e.id] = true;
      if (!e.when || e.when(S)) deliver(e);
    }
    const due = S.sched.filter(q => q.w === S.week && q.at <= S.t);
    if (due.length) S.sched = S.sched.filter(q => !due.includes(q));
    for (const q of due) {
      if (q.kind === "post") addPost({ h: q.h, t: q.t, mine: q.mine });
      else if (q.kind === "leak") fireLeak(q);
      else if (q.kind === "ev") deliver(EV[q.id]);
      else if (q.kind === "pool") {
        const e = EV[q.id];
        if (!e.when || e.when(S)) deliver(e); else S.poolUsed[q.id] = false;
      }
    }
    if (S.t >= S.nextAmb) {
      S.nextAmb += rnd(0.08, 0.14);
      ambientPost();
    }
  }

  // ------------------------------------------------------------------ messages
  function deliver(e) {
    if (e.call) {
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
    if (!S.dead) {
      S.speed = 1;
      buzz();
      if (!(view === "thread" && threadId === cid)) banner(contact(cid), msgs[0], () => openThread(cid));
    }
    refresh();
  }

  function missedWhileDead(e) {
    const cid = val(e.from);
    const cv = conv(cid);
    cv.msgs.push({ k: "sys", text: "📞 Appel manqué (téléphone éteint)", d: S.week * 10 + dayIdx() });
    const d = e.d || {};
    if (d.r) cv.msgs.push({ k: "them", text: d.r });
    cv.lastText = "Appel manqué"; cv.last = S.seq++; cv.unread++;
    S.stats.ignores++; S.ignoredWeek++;
    apply(d);
  }

  function ignore(cid) {
    const cv = S.convs[cid];
    const e = EV[cv.pending];
    cv.pending = null;
    if (!e) return;
    S.stats.ignores++; S.ignoredWeek++;
    cv.msgs.push({ k: "sys", text: "Sans réponse" });
    const d = e.d || {};
    if (d.r) { cv.msgs.push({ k: "them", text: d.r }); cv.lastText = d.r; }
    apply(d);
    if (d.end) endGameSoon(d.end);
  }

  function choose(cid, ci) {
    const cv = S.convs[cid];
    const e = EV[cv.pending];
    if (!e || S.dead || S.ending) return;
    const ch = e.c[ci];
    cv.msgs.push({ k: "me", text: ch.t, d: S.week * 10 + dayIdx() });
    cv.pending = null;
    cv.lastText = `Vous : ${ch.t}`;
    cv.last = S.seq++;
    const deltas = apply(ch);
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
    cv.msgs.push({ k: "me", text: ch.t, d });
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
    if (ch.leak && Math.random() < ch.leak.p) scheduleLeak(e, ci, cid);
    showFx(deltas);
    if (ch.end) endGameSoon(ch.end);
    drain(ch.cost ?? 4);
  }

  // ------------------------------------------------------------------ fuites
  function scheduleLeak(e, ci, to) {
    const L = e.c[ci].leak;
    if (L.soon || S.week >= 8) S.sched.push({ w: S.week, at: S.t + rnd(0.05, 0.12), kind: "leak", id: e.id, ci, to });
    else S.sched.push({ w: S.week + 1, at: rnd(0.1, 0.6), kind: "leak", id: e.id, ci, to });
  }

  function fireLeak(q) {
    const ch = EV[q.id].c[q.ci];
    const L = ch.leak;
    S.stats.fuites++; S.leaksWeek++;
    const deltas = apply({ fx: L.fx, news: L.news });
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
    const tier = S.colere < 40 ? "calm" : S.colere < 65 ? "tense" : "angry";
    const list = C.ambient[tier];
    const used = S.ambUsed[tier] || (S.ambUsed[tier] = []);
    if (used.length >= list.length) used.length = 0;
    let i;
    do { i = Math.floor(Math.random() * list.length); } while (used.includes(i));
    used.push(i);
    addPost({ h: list[i][0], t: list[i][1] });
  }

  function publish(i) {
    const opt = C.posts[S.week][i];
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
    S.speed = 1; S.posted = false; S.ignoredWeek = 0; S.leaksWeek = 0; S.nextAmb = rnd(0.03, 0.07);
    S.weekStart = { g: { ...S.g }, ordre: S.ordre, budget: S.budget, pop: pop() };
    $("#dead").hidden = true;
    if (w >= 2) {
      const cands = C.pool.filter(p => !S.poolUsed[p.id] && w >= (p.minW || 1)).sort(() => Math.random() - 0.5).slice(0, 2);
      cands.forEach(p => { S.poolUsed[p.id] = true; S.sched.push({ w, at: rnd(0.15, 0.88), kind: "pool", id: p.id }); });
    }
    showCard(w);
  }

  function showCard(w) {
    const wk = C.weeks[w];
    const el = $("#card");
    el.innerHTML = `<p class="k">Semaine ${w} / 8</p><p class="t">${esc(wk.title)}</p><p class="s">${esc(wk.agenda[0])}</p>`;
    el.hidden = false;
    const go2 = () => {
      clearTimeout(cardTimer);
      el.hidden = true;
      el.onclick = null;
      go("home");
      S.running = true;
      lastTs = 0;
    };
    el.onclick = go2;
    cardTimer = setTimeout(go2, 2600);
  }

  function endWeek() {
    S.running = false;
    S.t = 1;
    if (S.call && S.call.phase !== "end") missCall(true);
    S.call = null;
    $("#call").hidden = true;
    Object.keys(S.convs).forEach(cid => { if (S.convs[cid].pending) ignore(cid); });
    S.sched.forEach(q => {
      if (q.w === S.week) { q.w = S.week + 1; q.at = q.kind === "leak" ? rnd(0.05, 0.3) : rnd(0.01, 0.05); }
    });
    // la société bouge toute seule
    // la colère retombe si on ne l'alimente pas, sauf chez ceux qui n'en peuvent plus
    const avg = (S.g.jeunes + S.g.ouvriers) / 2;
    S.colere = clamp(S.colere + clamp(Math.round((40 - avg) * 0.15), -3, 5) - 3, 0, 100);
    // une colère maximale use les forces de l'ordre
    if (S.colere >= 90) S.ordre -= 6;
    S.ordre = clamp(Math.round(S.ordre + (50 - S.ordre) * 0.1), 0, 100);
    S.budget = clamp(S.budget - 1, 0, 100);
    S.popHist.push(Math.round(pop()));
    $("#dead").hidden = true;
    $("#banner").hidden = true;
    const end = checkEnd();
    if (end) return showEnding(end);
    if (S.week >= 8) return showEnding(pop() >= 45 ? "reelu" : "battu");
    showRecap();
  }

  function checkEnd() {
    // tant que l'ordre tient, la colère reste sous le couvercle
    if (S.colere >= 100 && S.ordre < 65) return "revolution";
    if (S.g.police <= 8) return "coup";
    if (S.budget <= 0) return "faillite";
    if (S.g.patrons <= 5) return "debranche";
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

  // ------------------------------------------------------------------ rendu : statut & accueil
  function updateStatus() {
    $("#clock").textContent = S ? clockText() : "08:00";
    const b = S ? Math.ceil(S.battery) : 100;
    $("#batt-pct").textContent = `${b}%`;
    $("#batt-fill").style.width = `${b}%`;
    $("#batt").classList.toggle("low", b <= 20);
    $("#ff").classList.toggle("on", !!S && S.speed > 1);
    $("#ff").hidden = !S || !S.running;
  }

  const APPS = [
    { id: "agenda", name: "Agenda", ic: "📅", bg: "linear-gradient(160deg,#fff,#dfe3ee)" },
    { id: "actu", name: "InfoChoc", ic: "📺", bg: "linear-gradient(160deg,#ff4b55,#a3101b)" },
    { id: "meteo", name: "Météo", ic: "🌩️", bg: "linear-gradient(160deg,#3b6fd8,#1a2f6b)", fake: "Météo sociale : orages violents, risque de pavés. Températures en hausse dans la rue." },
    { id: "photos", name: "Photos", ic: "🖼️", bg: "linear-gradient(160deg,#ffd36b,#f07f3c)", fake: "Album « Serrer des mains » : 4 312 photos. Aucune avec un ouvrier." },
    { id: "calc", name: "Calculette", ic: "🧮", bg: "linear-gradient(160deg,#4a4f60,#22252f)", fake: "Dette publique : 3 400 milliards. La calculette a planté." },
    { id: "rencontres", name: "Rencontres", ic: "💘", bg: "linear-gradient(160deg,#ff6fa5,#c2185b)", fake: "Compte suspendu par les services de renseignement. Pour votre sécurité." },
    { id: "reglages", name: "Réglages", ic: "⚙️", bg: "linear-gradient(160deg,#9aa0b2,#5c6274)", fake: "Mode « Ne pas déranger » indisponible pour le chef de l’État." },
    { id: "banque", name: "Banque", ic: "🏦", bg: "linear-gradient(160deg,#2f7a4a,#14361f)", fake: "Solde : 14 280 €. Compte « Clémentine » : accès refusé." },
  ];
  const DOCK = [
    { id: "messages", name: "Messages", ic: "💬", bg: "linear-gradient(160deg,#5cf07e,#17a83a)" },
    { id: "fil", name: "Le Fil", ic: "🗯️", bg: "linear-gradient(160deg,#4d8dff,#1a46b8)" },
    { id: "sondages", name: "Sondages", ic: "📊", bg: "linear-gradient(160deg,#ffcf4a,#e08a12)" },
    { id: "tel", name: "Téléphone", ic: "📞", bg: "linear-gradient(160deg,#5cf07e,#17a83a)", fake: "Les appels arrivent tout seuls. Toujours au pire moment." },
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
    return 0;
  }

  function renderHome() {
    const [m, col] = mood();
    $("#widget").innerHTML = `
      <span class="wk">Semaine ${S.week} / 8</span>
      <span class="wt">${esc(C.weeks[S.week].title)}</span>
      <span class="wpop"><b>${Math.round(pop())}%</b><small>Popularité</small></span>
      <span class="wmood">Climat social <span class="mood-pill" style="background:${col}22;color:${col}">${m}</span></span>`;
    $("#apps").innerHTML = APPS.map(appIcon).join("");
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
    }).join("");
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
    const can = !S.posted && !S.dead && C.posts[S.week];
    $("#btn-post").disabled = !can;
    $("#btn-post").textContent = S.posted ? "Publié" : "Publier";
  }

  function openComposer() {
    const opts = C.posts[S.week];
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
        <div class="bar-row"><span>Climat</span><span class="mood-pill" style="background:${col}22;color:${col};justify-self:start">${m}</span><span></span></div>
      </div>
      <div class="card"><h3>Bilan du mandat</h3>
        <div class="stats">
          <div class="stat"><b>${S.stats.blesses.toLocaleString("fr-FR")}</b><span>manifestants blessés</span></div>
          <div class="stat"><b>${S.stats.gav.toLocaleString("fr-FR")}</b><span>gardes à vue</span></div>
          <div class="stat"><b>${S.stats.fuites}</b><span>fuites</span></div>
          <div class="stat"><b>${S.stats.ignores}</b><span>messages ignorés</span></div>
        </div>
      </div>
    </div>`;
  }

  // ------------------------------------------------------------------ rendu : actu & agenda
  function renderActu() {
    S.newsUnread = 0;
    if (!S.news.length) { $("#news").innerHTML = `<p class="empty">Rien à la une. Les rédactions s’ennuient. Ça ne va pas durer.</p>`; return; }
    let html = "", lastW = null, first = true;
    for (const n of S.news) {
      if (n.w !== lastW) { lastW = n.w; html += `<div class="news-week">Semaine ${n.w} · ${esc(C.weeks[n.w].title)}</div>`; }
      html += `<div class="headline ${first ? "first" : ""}">${first ? `<span class="live">DIRECT</span>` : ""}${esc(n.text)}</div>`;
      first = false;
    }
    $("#news").innerHTML = html;
  }

  function renderAgenda() {
    let html = "";
    for (let w = 1; w <= 8; w++) {
      const wk = C.weeks[w];
      const cls = w < S.week ? "past" : w === S.week ? "now" : "";
      const known = w <= S.week + 1 || w === 8;
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
    const [m, col] = mood();
    const el = $("#recap");
    el.innerHTML = `<div class="rc">
      <span class="k">Semaine ${S.week} / 8 · terminée</span>
      <h2>${esc(C.weeks[S.week].title)}</h2>
      ${heads.length ? `<ul class="heads">${heads.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : `<p class="note">Aucune une cette semaine. Une semaine calme, c’est suspect.</p>`}
      <div class="card"><h3>Popularité : ${Math.round(pop())}% ${deltaHtml(pop() - ws.pop)}</h3>
        ${GROUPS.map(k => barRow(LABEL[k], S.g[k], S.g[k] - ws.g[k])).join("")}
        ${barRow("Ordre", S.ordre, S.ordre - ws.ordre, "#6f9bff")}
        ${barRow("Caisses", S.budget, S.budget - ws.budget, "#34d68a")}
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
    const seen = seenEndings();
    if (!seen.includes(id)) seen.push(id);
    try { localStorage.setItem("npd_endings", JSON.stringify(seen)); } catch { /* stockage indisponible */ }
    return seen;
  }

  function showEnding(id) {
    S.running = false;
    S.ending = id;
    if (S.call) { S.call = null; $("#call").hidden = true; }
    ["#dead", "#banner", "#composer", "#recap", "#card"].forEach(s => { $(s).hidden = true; });
    const E = C.endings[id];
    const p = pop();
    const rep = REPRESSION_FLAGS.filter(f => S.flags[f]).length;
    let text = E.text, vote = "";
    if (id === "reelu") {
      const v = (50.1 + (p - 45) * 1.1).toFixed(1).replace(".", ",");
      vote = `${v} %`;
      text = rep >= 4
        ? `Réélu avec ${v} %. Les autres sont en garde à vue. Le soir de la victoire, la place est vide : les rassemblements sont interdits. Tu fêtes ça avec le préfet. Il a apporté des lacrymos, par habitude.`
        : S.colere < 45
          ? `Réélu avec ${v} %. Le pays n’est pas guéri, mais il respire. Tu as appris un truc rare : écouter coûte moins cher que réprimer. Personne ne te croira.`
          : `Réélu de justesse avec ${v} %, dans un pays qui ne se parle plus. Tu as gagné l’élection. Tu as perdu tout le reste.`;
    } else if (id === "battu") {
      const v = clamp(49.9 - (45 - p) * 1.1, 4, 49.9).toFixed(1).replace(".", ",");
      vote = `${v} %`;
      text = `Tu perds avec ${v} %. Tu rejoins quatre conseils d’administration, tu écris un livre (« Ma vérité »), tu factures tes conférences 80 000 € l’heure. Finalement, perdre, c’est pas si mal. Pour toi.`;
    }
    const seen = markEnding(id);
    const el = $("#ending");
    el.innerHTML = `<div class="rc">
      <span class="end-k">Fin · Semaine ${S.week}</span>
      <h2 class="end-t">${esc(E.title)}</h2>
      ${vote ? `<span class="end-vote">${vote}</span>` : ""}
      <p class="end-p">${esc(text)}</p>
      <div class="card"><h3>Ton bilan</h3>
        <div class="stats">
          <div class="stat"><b>${Math.round(p)} %</b><span>popularité finale</span></div>
          <div class="stat"><b>${S.stats.blesses.toLocaleString("fr-FR")}</b><span>manifestants blessés</span></div>
          <div class="stat"><b>${S.stats.gav.toLocaleString("fr-FR")}</b><span>gardes à vue</span></div>
          <div class="stat"><b>${S.stats.fuites}</b><span>SMS fuités</span></div>
          <div class="stat"><b>${S.stats.ignores}</b><span>messages ignorés</span></div>
          <div class="stat"><b>${S.stats.feries}</b><span>jours fériés supprimés</span></div>
        </div>
      </div>
      <div class="card"><h3>Fins découvertes · ${seen.length} / ${Object.keys(C.endings).length}</h3>
        <div class="end-collect">${Object.entries(C.endings).map(([k, v]) => `<span class="${seen.includes(k) ? "got" : ""}">${seen.includes(k) ? esc(v.title) : "???"}</span>`).join("")}</div>
      </div>
      <button class="btn-primary" type="button" id="btn-again">Nouveau mandat</button>
    </div>`;
    el.hidden = false;
    el.scrollTop = 0;
    $("#btn-again").onclick = () => { el.hidden = true; newGame(); };
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
  }

  function newGame() {
    S = newState();
    for (let i = 0; i < 3; i++) {
      const [h, t] = C.ambient.calm[i];
      S.feed.push({ h, t, likes: Math.floor(rnd(40, 3000)), rts: Math.floor(rnd(5, 400)), time: "Dim 22:1" + i });
    }
    S.feedUnread = 0;
    go("lock");
  }

  // ------------------------------------------------------------------ écouteurs
  document.addEventListener("click", ev => {
    const t = ev.target.closest("button, [data-app]");
    if (!t) return;
    if (t.id === "btn-start") return newGame();
    if (t.id === "btn-unlock") return startWeek(1);
    if (t.id === "homebar") { if (S && !["title", "lock"].includes(view)) go("home"); return; }
    if (t.id === "ff") { if (S && S.running && !S.call && !S.dead) { S.speed = S.speed > 1 ? 1 : FAST; updateStatus(); } return; }
    if (t.id === "btn-post") return openComposer();
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.thread) return openThread(t.dataset.thread);
    if (t.dataset.choice !== undefined) return choose(threadId, +t.dataset.choice);
    if (t.dataset.callchoice !== undefined) return callChoose(+t.dataset.callchoice);
    if (t.dataset.call === "yes") return acceptCall();
    if (t.dataset.call === "no") { if (S.call && S.call.phase === "ring") missCall(); return; }
    if (t.dataset.post !== undefined) { if (t.dataset.post === "x") $("#composer").hidden = true; else publish(+t.dataset.post); return; }
    if (t.dataset.app) {
      const a = [...APPS, ...DOCK].find(x => x.id === t.dataset.app);
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
