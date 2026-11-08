/* Schematische Übungsanimation als 3D-Strichfigur, schräg von vorn gesehen.
 *
 * Welt: x = vorn (Blickrichtung der Figur im Stand), y = oben, z = zur Kamera hin. Boden bei y = 0. Maße in cm.
 * "N" = nahe Körperseite (+z im Stand), "F" = ferne Seite.
 *
 * Pose-Felder:
 *   P:[x,y,z]     Beckenmitte
 *   t             Rumpfwinkel in der x/y-Ebene: 180 = aufrecht, 90 = nach vorn (Bauchlage, Kopf vorn),
 *                 -90 = nach hinten (Rückenlage, Kopf hinten)
 *   lat           seitliche Neigung des Rumpfs Richtung +z (Grad)
 *   tw            Drehung der Schulterachse um die Wirbelsäule (Grad)
 *   yaw, roll     Drehung der Beckenachse (roll = -90: Seitlage, oben liegt die nahe Seite)
 *   hd            Kopfneigung in der x/y-Ebene relativ zum Rumpf
 *   hN,hF,fN,fF   Ziel für Hand/Fuß: [x,y] oder [x,y,z] (Welt) oder
 *                 {at:"shN"|"shF"|"S"|"head"|"P"|"hipN"|"hipF", d:[f,u,s] (Rumpf-lokal), w:[x,y,z] (Welt)}
 *   eN,eF,kN,kF   Richtung, in die Ellbogen/Knie zeigen: [x,y,z] (Welt) oder {l:[f,u,s]} (Rumpf-lokal)
 *
 * Animation: { frames:[{p, d, hold}], cam:{yaw,pitch}, mark:"lowback"|"P"|"S"|"fN"|"kN"|..., label }
 */
(function () {
  const L = { torso: 50, neck: 6, head: 9, ua: 27, fa: 25, th: 41, sh: 40, hipW: 20, shW: 32 };
  const R = a => a * Math.PI / 180;
  const v = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    len: a => Math.hypot(a[0], a[1], a[2]),
    norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  };
  const rot = (x, axis, ang) => { // Rodrigues
    const c = Math.cos(ang), s = Math.sin(ang), k = v.norm(axis);
    return v.add(v.add(v.mul(x, c), v.mul(v.cross(k, x), s)), v.mul(k, v.dot(k, x) * (1 - c)));
  };

  function ik(root, target, l1, l2, pole) {
    let d = v.sub(target, root), dist = v.len(d);
    const dmax = l1 + l2 - 0.05, dmin = Math.abs(l1 - l2) + 0.05;
    dist = Math.max(dmin, Math.min(dmax, dist));
    const n = v.norm(d);
    let q = v.sub(pole, v.mul(n, v.dot(pole, n)));
    if (v.len(q) < 1e-4) q = Math.abs(n[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
    q = v.norm(q);
    const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist))));
    const joint = v.add(root, v.add(v.mul(n, l1 * Math.cos(a)), v.mul(q, l1 * Math.sin(a))));
    const end = v.add(joint, v.mul(v.norm(v.sub(v.add(root, v.mul(n, dist)), joint)), l2));
    return { joint, end };
  }

  function solve(p) {
    const P = p.P.length === 2 ? [p.P[0], p.P[1], 0] : p.P;
    const ta = R(p.t ?? 180), la = R(p.lat || 0);
    let u = [Math.sin(ta) * Math.cos(la), -Math.cos(ta) * Math.cos(la), Math.sin(la)];
    u = v.norm(u);
    // Beckenachse
    const ro = R(p.roll || 0), ya = R(p.yaw || 0);
    let ax = [0, -Math.sin(ro), Math.cos(ro)];
    ax = [ax[0] * Math.cos(ya) + ax[2] * Math.sin(ya), ax[1], -ax[0] * Math.sin(ya) + ax[2] * Math.cos(ya)];
    // Schulterachse senkrecht zur Wirbelsäule, dann verdreht
    let s = v.sub(ax, v.mul(u, v.dot(ax, u)));
    if (v.len(s) < 1e-3) s = [0, 0, 1];
    s = rot(v.norm(s), u, R(p.tw || 0));
    const f = v.norm(v.cross(u, s));
    const S = v.add(P, v.mul(u, L.torso));
    const hu = v.norm(rot(u, s, R(-(p.hd || 0))));
    const head = v.add(S, v.mul(hu, L.neck + L.head));
    const J = {
      P, S, head,
      hipN: v.add(P, v.mul(ax, L.hipW / 2)), hipF: v.add(P, v.mul(ax, -L.hipW / 2)),
      shN: v.add(S, v.mul(s, L.shW / 2)), shF: v.add(S, v.mul(s, -L.shW / 2)),
      lowback: v.add(P, v.mul(u, 12))
    };
    const loc = d => v.add(v.add(v.mul(f, d[0]), v.mul(u, d[1])), v.mul(s, d[2]));
    const tgt = (x, side, kind) => {
      if (!x) {
        if (kind === "h") return v.add(J[side === 1 ? "shN" : "shF"], v.mul(u, -(L.ua + L.fa - 6)));
        return null;
      }
      if (Array.isArray(x)) return x.length === 3 ? x : [x[0], x[1], side * (kind === "h" ? L.shW / 2 : L.hipW / 2)];
      let b = J[x.at] || P;
      if (x.d) b = v.add(b, loc(x.d));
      if (x.w) b = v.add(b, x.w);
      return b;
    };
    const pole = (x, def) => !x ? def : (x.l ? loc(x.l) : x);
    const defK = v.add(f, v.mul(u, -0.15)), defE = v.add(v.mul(f, -1), v.mul(u, -0.2));
    const aN = ik(J.shN, tgt(p.hN, 1, "h"), L.ua, L.fa, pole(p.eN, defE));
    const aF = ik(J.shF, tgt(p.hF, -1, "h"), L.ua, L.fa, pole(p.eF, p.eN ? pole(p.eN) : defE));
    const fN = tgt(p.fN, 1, "f") || v.add(J.hipN, v.mul(u, -80));
    const fF = tgt(p.fF, -1, "f") || v.add(J.hipF, v.mul(u, -80));
    const lN = ik(J.hipN, fN, L.th, L.sh, pole(p.kN, defK));
    const lF = ik(J.hipF, fF, L.th, L.sh, pole(p.kF, p.kN ? pole(p.kN) : defK));
    Object.assign(J, { eN: aN.joint, hN: aN.end, eF: aF.joint, hF: aF.end, kN: lN.joint, fN: lN.end, kF: lF.joint, fF: lF.end });
    ["eN", "hN", "eF", "hF", "kN", "fN", "kF", "fF"].forEach(k => { if (J[k][1] < 2) J[k] = [J[k][0], 2, J[k][2]]; });
    // Blickrichtung (Brust) und Bauchrichtung für die Darstellung
    let sl = v.sub(ax, v.mul(u, v.dot(ax, u))); sl = v.len(sl) < 1e-3 ? s : v.norm(sl);
    J.f = f; J.fLow = v.norm(v.cross(u, sl)); J.u = u; J.hu = hu;
    return J;
  }

  /* Interpolation */
  function lerp(a, b, k) {
    if (a === undefined) return b; if (b === undefined) return a;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return k < .5 ? a : b;
      return a.map((x, i) => lerp(x, b[i], k));
    }
    if (typeof a === "number" && typeof b === "number") return a + (b - a) * k;
    if (a && b && typeof a === "object" && typeof b === "object") {
      const o = {}; new Set([...Object.keys(a), ...Object.keys(b)]).forEach(key => o[key] = lerp(a[key], b[key], k)); return o;
    }
    return k < .5 ? a : b;
  }
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const total = a => a.frames.reduce((s, f) => s + (f.d || 0) + (f.hold || 0), 0);
  // Gelenkpositionen interpolieren statt Posen: stabiler bei Zielen in verschiedenen Formaten
  function jointsAt(anim, t) {
    const F = anim.frames; t = ((t % total(anim)) + total(anim)) % total(anim);
    for (let i = 0; i < F.length; i++) {
      const f = F[i], prev = F[(i - 1 + F.length) % F.length], d = f.d || 0, h = f.hold || 0;
      if (t < d) return blendPose(prev.p, f.p, ease(t / d));
      t -= d; if (t < h) return solve(f.p); t -= h;
    }
    return solve(F[F.length - 1].p);
  }
  function blendPose(p, q, k) {
    // Ziele, die relativ angegeben sind, erst in Weltkoordinaten auflösen
    const A = solve(p), B = solve(q);
    const flat = (pp, J) => Object.assign({}, pp, { hN: J.hN, hF: J.hF, fN: J.fN, fF: J.fF, P: J.P });
    const pa = flat(p, A), pb = flat(q, B);
    // Beugerichtungen als tatsächliche Richtung Gelenk minus Ansatz übernehmen
    const root = { eN: "shN", eF: "shF", kN: "hipN", kF: "hipF" };
    Object.keys(root).forEach(key => {
      const mid = (J, key) => v.sub(v.sub(J[key], J[root[key]]), v.mul(v.norm(v.sub(J[key[0] === "e" ? "h" + key[1] : "f" + key[1]], J[root[key]])), v.dot(v.sub(J[key], J[root[key]]), v.norm(v.sub(J[key[0] === "e" ? "h" + key[1] : "f" + key[1]], J[root[key]])))));
      pa[key] = mid(A, key); pb[key] = mid(B, key);
    });
    return solve(lerp(pa, pb, k));
  }

  /* Projektion */
  function camera(anim) {
    const c = anim.cam || {}, ya = R(c.yaw ?? -28), pi = R(c.pitch ?? 14);
    return p => {
      const x = p[0] * Math.cos(ya) + p[2] * Math.sin(ya);
      const z = -p[0] * Math.sin(ya) + p[2] * Math.cos(ya);
      return [x, p[1] * Math.cos(pi) - z * Math.sin(pi), z * Math.cos(pi) + p[1] * Math.sin(pi)];
    };
  }
  const MAT = [[-90, 0, -32], [90, 0, -32], [90, 0, 32], [-90, 0, 32]];
  function bounds(anim) {
    if (anim._b) return anim._b;
    const pr = camera(anim); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    const T = total(anim), pts = [];
    for (let i = 0; i < 40; i++) { const J = jointsAt(anim, T * i / 40); ["P", "S", "head", "hN", "hF", "fN", "fF", "kN", "kF", "eN", "eF"].forEach(k => pts.push(J[k])); }
    pts.forEach(p => { const q = pr(p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    y1 += L.head + 4; y0 -= 6; x0 -= 14; x1 += 14;
    MAT.forEach(p => { const q = pr(p); y0 = Math.min(y0, q[1]); });
    return (anim._b = [x0, y0, x1, y1]);
  }

  const css = (n, el, d) => (getComputedStyle(el).getPropertyValue(n).trim() || d);

  function draw(ctx, w, h, anim, t, el) {
    const pr = camera(anim), b = bounds(anim);
    const s = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1])) * 0.94;
    const ox = w / 2 - (b[0] + b[2]) / 2 * s, oy = h / 2 + (b[1] + b[3]) / 2 * s;
    const X = p => { const q = pr(p); return [ox + q[0] * s, oy - q[1] * s, q[2]]; };
    const ink = css("--fig-ink", el, "#16211b"), far = css("--fig-far", el, "#9aa8a0"), mat = css("--fig-mat", el, "#d3dcd5"),
          acc = css("--fig-acc", el, "#1c6a49"), mark = css("--fig-mark", el, "#b9770f"), bg = css("--fig-bg", el, "transparent");
    ctx.clearRect(0, 0, w, h);
    if (bg !== "transparent") { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    // Matte
    ctx.fillStyle = mat; ctx.beginPath(); MAT.forEach((p, i) => { const q = X(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.fill();
    const J = jointsAt(anim, t);
    // Schatten
    ctx.fillStyle = "rgba(0,0,0,.10)"; ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2; const q = X([J.P[0] + 6 + Math.cos(a) * 42, 0, J.P[2] + Math.sin(a) * 16]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
    ctx.fill();
    // Teile nach Tiefe sortiert zeichnen
    const parts = [];
    const seg = (pts, col, wd) => parts.push({ z: pts.reduce((a, p) => a + X(p)[2], 0) / pts.length, fn: () => {
      ctx.strokeStyle = col; ctx.lineWidth = wd * s; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
      pts.forEach((p, i) => { const q = X(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); } });
    const chest = css("--fig-chest", el, "#8eaabd");
    seg([J.hipF, J.kF, J.fF], far, 7.5);
    seg([J.shF, J.eF, J.hF], far, 6);
    seg([J.hipN, J.kN, J.fN], acc, 7.5);
    seg([J.shN, J.eN, J.hN], acc, 6);
    // Rumpf in zwei Teilen: Brust oben, Bauch unten. Zur Kamera zeigende Vorderseite hell, Rücken dunkel.
    const facing = n => { const a = pr([0, 0, 0]), b = pr(n); return b[2] - a[2]; };
    const mid = (a, b) => v.add(a, v.mul(v.sub(b, a), .5));
    const mN = mid(J.shN, J.hipN), mF = mid(J.shF, J.hipF);
    const quad = (pts, n) => parts.push({ z: pts.reduce((a, p) => a + X(p)[2], 0) / 4, fn: () => {
      const q = pts.map(X), col = facing(n) > -0.12 ? chest : ink;
      ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 8 * s; ctx.lineJoin = "round";
      ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.stroke();
    } });
    quad([J.shN, J.shF, mF, mN], J.f);
    quad([mN, mF, J.hipF, J.hipN], J.fLow);
    // Kopf mit Nase in Blickrichtung
    parts.push({ z: X(J.head)[2], fn: () => {
      const q = X(J.head), n = X(J.S); ctx.strokeStyle = ink; ctx.lineWidth = 6 * s; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(n[0], n[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(q[0], q[1], L.head * s, 0, Math.PI * 2); ctx.fill();
      const nz = X(v.add(J.head, v.mul(v.norm(v.cross(J.hu, v.cross(J.f, J.hu))), L.head + 2)));
      ctx.fillStyle = chest; ctx.beginPath(); ctx.arc(nz[0], nz[1], 3.6 * s, 0, Math.PI * 2); ctx.fill();
    } });
    parts.sort((a, b) => a.z - b.z).forEach(p => p.fn());
    // Markierung der Fokus-Stelle
    if (anim.mark && J[anim.mark]) {
      const q = X(J[anim.mark]), ph = (t % 1.2) / 1.2;
      ctx.strokeStyle = mark; ctx.globalAlpha = 1 - ph * .7; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.arc(q[0], q[1], (9 + ph * 9) * s, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
    }
  }

  window.FigurePlayer = function (canvas) {
    const ctx = canvas.getContext("2d"); let anim = null, t0 = performance.now(), raf = 0, speed = 1;
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function frame(now) {
      const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (anim && r.width > 0) draw(ctx, w, h, anim, reduce ? 0.6 : (now - t0) / 1000 * speed, canvas);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return { set(a) { if (a !== anim) { anim = a; t0 = performance.now(); } }, speed(x) { speed = x; }, stop() { cancelAnimationFrame(raf); } };
  };
  window.FIGURE_DRAW = (canvas, anim, t) => draw(canvas.getContext("2d"), canvas.width, canvas.height, anim, t, canvas);
  window.FIGURE_TOTAL = total;
})();
