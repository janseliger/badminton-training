/* Intervall-Timer für alle Einheiten.
 * Lädt workouts/<id>.js anhand von ?w=<id>. Die Datei ruft WORKOUT({...}) auf.
 */
(function () {
  const $ = id => document.getElementById(id);
  const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const id = new URLSearchParams(location.search).get("w") || "";
  if (!/^[a-z0-9-]+$/.test(id)) { fail("Keine Einheit ausgewählt."); return; }

  window.WORKOUT = w => start(w);
  const sc = document.createElement("script");
  sc.src = "workouts/" + id + ".js?v=7";
  sc.onerror = () => fail("Diese Einheit gibt es nicht.");
  document.head.appendChild(sc);

  function fail(msg) {
    $("title").textContent = msg;
    document.querySelector(".grid").hidden = true;
    $("meta").innerHTML = '<a href="./">Zur Übersicht</a>';
  }

  function start(W) {
    const VID = W.videos;
    const vurl = x => `https://youtu.be/${VID[x.k].id}?t=${x.t}`;
    const segEnd = x => x.e || x.t + 40;
    document.title = W.title;
    $("title").textContent = W.title;

    /* Zeitleiste */
    const TL = [], PLAN = [];
    W.parts.forEach((p, pi) => {
      const rounds = p.rounds || 1;
      PLAN.push({ part: p, items: [] });
      for (let r = 1; r <= rounds; r++) {
        p.steps.forEach((s, si) => {
          let dur = p.prep, label = p.prep >= 30 ? "Pause" : "Wechsel";
          if (TL.length === 0) { dur = 20; label = "Bereit machen"; }
          else if (si === 0 && r > 1) { dur = p.roundRest || 60; label = "Rundenpause"; }
          else if (si === 0) { label = "Pause"; }
          const i0 = TL.length;
          TL.push({ type: "prep", dur, s, p, r, rounds, label });
          TL.push({ type: "work", dur: s.work || p.work, s, p, r, rounds });
          if (r === 1) PLAN[pi].items.push({ s, idx: i0 });
        });
      }
    });
    TL.push({ type: "done", dur: 0 });
    const TOTAL = TL.reduce((a, e) => a + e.dur, 0);
    const before = []; { let acc = 0; TL.forEach((e, i) => { before[i] = acc; acc += e.dur; }); }

    $("meta").textContent = `${W.subtitle ? W.subtitle + " · " : ""}${Math.round(TOTAL / 60)} Min.`;
    $("src").innerHTML = "Videos: " + Object.values(VID).map(v => `<a href="https://youtu.be/${esc(v.id)}" target="_blank" rel="noopener">${esc(v.name)}</a>`).join(" · ") +
      ". Die Figur zeigt die Bewegung schematisch, der orange Ring die Stelle, auf die man achtet. Mit „Video“ läuft der Ausschnitt aus dem Originalvideo. Tipp dafür: Seite ein, zwei Minuten vorher öffnen, dann ist die YouTube-Werbung durch.";

    /* Ablauf-Liste */
    const box = $("planList");
    PLAN.forEach(g => {
      const d = document.createElement("div"); d.className = "part";
      const secs = TL.filter(e => e.p === g.part).reduce((a, e) => a + e.dur, 0);
      d.innerHTML = `<h3><span>${esc(g.part.name)}${g.part.rounds ? ` · ${g.part.rounds} Runden` : ""}</span><em>${fmt(secs)}</em></h3>`;
      const ol = document.createElement("ol");
      g.items.forEach(it => {
        const li = document.createElement("li"); li.dataset.idx = it.idx;
        li.innerHTML = `<button class="jump" type="button"><span class="jn">${esc(it.s.n)}</span><span class="jd">${esc(it.s.dose)}</span></button>` +
          `<a class="mini" href="${vurl(it.s.v)}" target="_blank" rel="noopener" aria-label="Video zu ${esc(it.s.n)}">▶ ${fmt(it.s.v.t)}</a>`;
        li.querySelector(".jump").addEventListener("click", () => go(it.idx));
        ol.appendChild(li);
      });
      d.appendChild(ol); box.appendChild(d);
    });

    /* Ton & Ansage */
    let actx = null, sound = true, speech = false;
    function beep(f = 880, d = .12, when = 0) {
      if (!sound) return;
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; o.type = "sine";
        const t = actx.currentTime + when;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02);
      } catch (e) {}
    }
    function say(t) { if (!speech) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "de-DE"; u.rate = 1.02; speechSynthesis.speak(u); } catch (e) {} }

    /* Bildschirm wach halten */
    let wl = null, running = false;
    async function lock() { try { wl = await navigator.wakeLock?.request("screen"); } catch (e) {} }
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && running) lock(); });

    /* Videoausschnitte: ein Player pro Video, alle schon beim Öffnen geladen.
       So läuft YouTube-Werbung vor dem Training im Hintergrund und nicht in den Pausen.
       Jeder Player wiederholt stumm seinen Abschnitt; sichtbar ist nur der aktive. */
    const firstSeg = {};
    TL.forEach(e => { if (e.s && !firstSeg[e.s.v.k]) firstSeg[e.s.v.k] = e.s.v; });
    const P = {};          // k -> { yt, seg, ok, box }
    let ytOk = false, curV = null;
    window.onYouTubeIframeAPIReady = () => {
      Object.keys(firstSeg).forEach(k => {
        const box = document.createElement("div"); box.className = "yp";
        const inner = document.createElement("div"); box.appendChild(inner);
        $("player").appendChild(box);
        const rec = P[k] = { seg: firstSeg[k], ok: false, box };
        rec.yt = new YT.Player(inner, {
          host: "https://www.youtube-nocookie.com", width: "100%", height: "100%", videoId: VID[k].id,
          playerVars: { rel: 0, playsinline: 1, modestbranding: 1, mute: 1, autoplay: 1, controls: 1, iv_load_policy: 3, start: firstSeg[k].t },
          events: {
            onReady: ev => {
              rec.ok = true; ev.target.mute(); ev.target.playVideo();
              if (!ytOk) { ytOk = true; render(); }
              else if (curV && curV.k === k) show(curV);
            },
            onStateChange: ev => { if (ev.data === 0) { ev.target.seekTo(rec.seg.t, true); ev.target.playVideo(); } }
          }
        });
      });
    };
    let ytLoading = false;
    function loadYT() { if (ytLoading) return; ytLoading = true; const ys = document.createElement("script"); ys.src = "https://www.youtube.com/iframe_api"; ys.async = true; document.head.appendChild(ys); }

    /* Ansicht: animierte Figur (Standard) oder Videoausschnitt */
    const fig = window.FigurePlayer && window.FIGS ? FigurePlayer($("figc")) : null;
    let mode = "fig";
    try { if (localStorage.getItem("bt-mode") === "vid") mode = "vid"; } catch (e) {}
    function setMode(m) {
      mode = m; try { localStorage.setItem("bt-mode", m); } catch (e) {}
      $("mFig").setAttribute("aria-pressed", m === "fig"); $("mVid").setAttribute("aria-pressed", m === "vid");
      if (m === "vid") loadYT();
      Object.values(P).forEach(r => { try { r.ok && (m === "vid" ? r.yt.playVideo() : r.yt.pauseVideo()); } catch (e) {} });
      render();
    }
    $("mFig").addEventListener("click", () => setMode("fig"));
    $("mVid").addEventListener("click", () => setMode("vid"));
    function show(x) {
      const rec = P[x.k];
      Object.values(P).forEach(r => r.box.classList.toggle("on", r === rec));
      if (!rec || !rec.ok) return;
      rec.seg = x;
      try { rec.yt.mute(); rec.yt.seekTo(x.t, true); rec.yt.playVideo(); } catch (e) {}
    }
    function cue(x) {
      if (!ytOk) return;
      if (curV && curV.k === x.k && curV.t === x.t) return;
      curV = x; show(x);
    }
    setInterval(() => {
      if (mode !== "vid") return;
      Object.values(P).forEach(r => {
        if (!r.ok) return;
        try {
          const st = r.yt.getPlayerState(), t = r.yt.getCurrentTime();
          if (st === 1 && (t > segEnd(r.seg) - .3 || t < r.seg.t - 2)) r.yt.seekTo(r.seg.t, true);
          if (st === 2 || st === 5) r.yt.playVideo();
        } catch (e) {}
      });
    }, 500);

    /* Zustand */
    let idx = 0, rem = TL[0].dur, last = 0, swDone = false, lastSec = null;
    const C = 2 * Math.PI * 88; $("fgc").style.strokeDasharray = C;

    function render() {
      const e = TL[idx], st = $("stage");
      $("alert").hidden = true;
      if (e.type === "done") {
        st.dataset.ph = "done"; $("chip").textContent = "Geschafft"; $("partl").textContent = "";
        $("lead").textContent = "Gut gemacht"; $("name").textContent = "Einheit beendet"; $("dose").textContent = `${Math.round(TOTAL / 60)} Minuten`;
        $("explain").hidden = true; $("num").textContent = "✓"; $("ringsub").textContent = "";
        $("play").textContent = "Start"; running = false;
        Object.values(P).forEach(r => { try { r.ok && r.yt.pauseVideo(); } catch (err) {} });
        markPlan(); update(); return;
      }
      $("explain").hidden = false;
      const s = e.s, isW = e.type === "work";
      st.dataset.ph = isW ? "work" : (e.label === "Wechsel" ? "switch" : "rest");
      $("chip").textContent = isW ? "Übung" : e.label;
      $("partl").textContent = e.p.name + (e.rounds > 1 ? ` · Runde ${e.r}/${e.rounds}` : "");
      $("lead").textContent = isW ? "Jetzt" : "Als Nächstes";
      $("name").textContent = s.n; $("dose").textContent = s.dose || "";
      $("how").textContent = s.how || "";
      $("focus").textContent = s.focus || ""; $("focusP").hidden = !s.focus;
      $("light").textContent = s.light || ""; $("lightP").hidden = !s.light;
      const hasFig = !!(fig && s.fig && FIGS[s.fig]);
      const showFig = hasFig && mode === "fig";
      $("figbox").hidden = !showFig; $("player").hidden = showFig || !ytOk;
      document.querySelector(".viewsw").hidden = !hasFig;
      if (showFig) fig.set(FIGS[s.fig]);
      if (!hasFig && mode === "fig") loadYT();
      const a = $("vid"); a.href = vurl(s.v); a.classList.toggle("small", isW || ytOk || showFig);
      $("vidt").textContent = (ytOk || showFig) ? "Auf YouTube öffnen" : (isW ? "Video" : "Video ansehen ab " + fmt(s.v.t));
      $("vids").textContent = " " + VID[s.v.k].name;
      $("ringsub").textContent = isW ? (s.work ? "Sek." : (e.p.workLabel || "Sek.")) : "Pause";
      if (!showFig) cue(s.v);
      markPlan(); update();
    }
    function markPlan() {
      const e = TL[idx];
      document.querySelectorAll(".plan li").forEach(li => {
        const i = +li.dataset.idx, cur = e.s && TL[i].s === e.s;
        li.classList.toggle("cur", !!cur);
        li.classList.toggle("past", !cur && (e.type === "done" || (i < idx && !(e.p === TL[i].p && e.r > 1))));
      });
    }
    function update() {
      const e = TL[idx];
      if (e.type !== "done") { $("num").textContent = Math.ceil(rem); $("fgc").style.strokeDashoffset = C * (1 - rem / e.dur); }
      else $("fgc").style.strokeDashoffset = 0;
      const el = before[idx] + (e.dur - rem);
      $("elapsed").textContent = fmt(el); $("remainTotal").textContent = "noch " + fmt(TOTAL - el);
      $("pbar").style.width = (el / TOTAL * 100) + "%";
    }
    function go(i, auto) {
      idx = Math.max(0, Math.min(TL.length - 1, i)); rem = TL[idx].dur; swDone = false; lastSec = null; render();
      const e = TL[idx];
      if (!auto) return;
      if (e.type === "work") { beep(1175, .35); say("Los"); }
      else if (e.type === "prep") { beep(660, .25); say((e.label === "Rundenpause" ? "Rundenpause. " : "") + "Als Nächstes: " + e.s.n); }
      else { beep(880, .2); beep(1175, .4, .25); say("Geschafft"); }
    }
    function frame(t) {
      if (running) {
        const dt = (t - last) / 1000; last = t; rem -= dt;
        const e = TL[idx], sec = Math.ceil(rem);
        if (sec !== lastSec) { if (sec <= 3 && sec >= 1) beep(880, .1); lastSec = sec; }
        if (e.type === "work" && e.s.sw && !swDone && e.dur - rem >= e.s.sw) {
          swDone = true; $("alert").hidden = false; beep(988, .12); beep(988, .12, .18); say("Seite wechseln");
        }
        if (rem <= 0) go(idx + 1, true); else update();
      }
      requestAnimationFrame(frame);
    }
    function toggle() {
      if (TL[idx].type === "done") go(0);
      running = !running;
      $("play").textContent = running ? "Pause" : "Weiter";
      if (running) {
        last = performance.now();
        try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
        lock();
                if (idx === 0 && rem === TL[0].dur) say("Als Nächstes: " + TL[0].s.n);
      } else { try { wl?.release(); wl = null; } catch (e) {} }
    }
    $("play").addEventListener("click", toggle);
    $("next").addEventListener("click", () => go(idx + 1));
    $("prev").addEventListener("click", () => { const e = TL[idx]; if (e.dur - rem > 3) go(idx); else go(idx - 1); });
    $("reset").addEventListener("click", () => { running = false; $("play").textContent = "Start"; go(0); });
    function tog(btn, set) { btn.addEventListener("click", () => { const on = btn.getAttribute("aria-pressed") !== "true"; btn.setAttribute("aria-pressed", on); set(on); }); }
    tog($("tSound"), on => sound = on);
    tog($("tSpeech"), on => { speech = on; if (!on) try { speechSynthesis.cancel(); } catch (e) {} });
    document.addEventListener("keydown", ev => {
      if (ev.target.closest("a,input,button")) return;
      if (ev.code === "Space") { ev.preventDefault(); toggle(); }
      else if (ev.key === "ArrowRight") go(idx + 1);
      else if (ev.key === "ArrowLeft") go(idx - 1);
    });

    $("mFig").setAttribute("aria-pressed", mode === "fig"); $("mVid").setAttribute("aria-pressed", mode === "vid");
    if (mode === "vid") loadYT();
    render(); requestAnimationFrame(frame);
  }
})();
