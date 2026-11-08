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
  function camera(c) {
    c = c || {}; const ya = R(c.yaw ?? -28), pi = R(c.pitch ?? 14);
    return p => {
      const x = p[0] * Math.cos(ya) + p[2] * Math.sin(ya);
      const z = -p[0] * Math.sin(ya) + p[2] * Math.cos(ya);
      return [x, p[1] * Math.cos(pi) - z * Math.sin(pi), z * Math.cos(pi) + p[1] * Math.sin(pi)];
    };
  }
  const MAT = [[-90, 0, -32], [90, 0, -32], [90, 0, 32], [-90, 0, 32]];
  function bounds(anim, cam, vi) {
    anim._b = anim._b || {};
    if (anim._b[vi]) return anim._b[vi];
    const pr = camera(cam); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    const T = total(anim), pts = [];
    for (let i = 0; i < 40; i++) { const J = jointsAt(anim, T * i / 40); ["P", "S", "head", "hN", "hF", "fN", "fF", "kN", "kF", "eN", "eF"].forEach(k => pts.push(J[k])); }
    pts.forEach(p => { const q = pr(p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    y1 += L.head + 4; y0 -= 6; x0 -= 14; x1 += 14;
    MAT.forEach(p => { const q = pr(p); y0 = Math.min(y0, q[1]); });
    return (anim._b[vi] = [x0, y0, x1, y1]);
  }

  const css = (n, el, d) => (getComputedStyle(el).getPropertyValue(n).trim() || d);
  function mixHex(a, b, k) {
    const h = c => { c = c.replace("#", ""); if (c.length === 3) c = c.split("").map(x => x + x).join(""); return /^[0-9a-f]{6}$/i.test(c) ? [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)) : null; };
    const A = h(a), B = h(b); if (!A || !B) return k > .5 ? b : a;
    return "rgb(" + A.map((x, i) => Math.round(x + (B[i] - x) * k)).join(",") + ")";
  }

  /* Bewegungsbahn: das Gelenk, das sich am meisten bewegt (oder anim.trail) */
  const TRAIL_KEYS = ["hN", "hF", "fN", "fF", "kN", "kF", "head"];
  function trailOf(anim) {
    if (anim._tr) return anim._tr;
    const T = total(anim), n = 72, samples = [];
    for (let i = 0; i <= n; i++) samples.push(jointsAt(anim, T * i / n));
    const pick = keys => keys.map(k => {
      const pts = samples.map(J => J[k]);
      const ext = [0, 1, 2].map(i => Math.max(...pts.map(p => p[i])) - Math.min(...pts.map(p => p[i])));
      return { k, pts, size: Math.hypot(ext[0], ext[1], ext[2]) };
    }).sort((x, y) => y.size - x.size);
    const list = anim.trail ? pick([].concat(anim.trail)) : pick(TRAIL_KEYS).slice(0, 1);
    return (anim._tr = list.filter(x => x.size > 8));
  }

  function drawView(ctx, w, h, anim, t, el, cam, vi) {
    const pr = camera(cam), b = bounds(anim, cam, vi);
    const s = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1])) * 0.94;
    const ox = w / 2 - (b[0] + b[2]) / 2 * s, oy = h / 2 + (b[1] + b[3]) / 2 * s;
    const X = p => { const q = pr(p); return [ox + q[0] * s, oy - q[1] * s, q[2]]; };
    const ink = css("--fig-ink", el, "#16211b"), far = css("--fig-far", el, "#9aa8a0"), mat = css("--fig-mat", el, "#d3dcd5"),
          acc = css("--fig-acc", el, "#1c6a49"), mark = css("--fig-mark", el, "#b9770f"), bg = css("--fig-bg", el, "transparent"),
          chest = css("--fig-chest", el, "#8eaabd"), halo = css("--fig-halo", el, "#ffffff"), contact = css("--fig-contact", el, "rgba(22,33,27,.45)");
    const path = (pts, close) => { ctx.beginPath(); pts.forEach((p, i) => { const q = X(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); if (close) ctx.closePath(); };
    // Matte
    ctx.fillStyle = mat; path(MAT, true); ctx.fill();
    const J = jointsAt(anim, t);

    // Füße: gestreckt, wenn das Schienbein flach liegt, sonst flach nach vorn
    const foot = side => {
      const k = J["k" + side], a = J["f" + side], d = v.norm(v.sub(a, k));
      const dir = Math.abs(d[1]) < .5 ? d : [1, 0, 0];
      let toe = v.add(a, v.mul(dir, 12)); if (toe[1] < 1.5) toe = [toe[0], 1.5, toe[2]];
      return toe;
    };
    J.toeN = foot("N"); J.toeF = foot("F");

    // Bodenkontakte: worauf der Körper ruht
    const touch = [];
    ["fN", "fF", "toeN", "toeF", "kN", "kF", "hN", "hF"].forEach(k => { if (J[k][1] < 6) touch.push(J[k]); });
    if (J.P[1] < 15) touch.push(J.P);
    if (J.S[1] < 15) touch.push(J.S);
    if (J.head[1] < 14) touch.push(J.head);
    ctx.fillStyle = contact;
    touch.forEach(p => { path(Array.from({ length: 17 }, (_, i) => { const a = i / 16 * Math.PI * 2; return [p[0] + Math.cos(a) * 7, 0, p[2] + Math.sin(a) * 7]; }), true); ctx.fill(); });

    // Bewegungsbahn
    trailOf(anim).forEach(tr => {
      ctx.save(); ctx.strokeStyle = mark; ctx.globalAlpha = .6; ctx.lineWidth = 2.2 * s; ctx.setLineDash([2.5 * s, 4.5 * s]); ctx.lineCap = "round";
      path(tr.pts); ctx.stroke(); ctx.restore();
    });

    // Teile nach Tiefe sortiert, jeweils mit hellem Rand, damit sich Kreuzungen trennen
    const parts = [];
    const limb = (pts, col, w1, w2, end) => parts.push({ z: pts.reduce((a, p) => a + X(p)[2], 0) / pts.length, fn: () => {
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      const q = pts.map(X);
      const stroke = (c, extra) => {
        ctx.strokeStyle = c;
        ctx.lineWidth = (w1 + extra) * s; ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.stroke();
        ctx.lineWidth = (w2 + extra) * s; ctx.beginPath(); ctx.moveTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0], q[2][1]); if (q[3]) ctx.lineTo(q[3][0], q[3][1]); ctx.stroke();
        if (end) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(q[2][0], q[2][1], (end + extra / 2) * s, 0, Math.PI * 2); ctx.fill(); }
      };
      stroke(halo, 3); stroke(col, 0);
    } });
    limb([J.hipF, J.kF, J.fF, J.toeF], far, 9, 7, 0);
    limb([J.shF, J.eF, J.hF], far, 6.5, 5.5, 3.6);
    limb([J.hipN, J.kN, J.fN, J.toeN], acc, 9, 7, 0);
    limb([J.shN, J.eN, J.hN], acc, 6.5, 5.5, 3.6);

    // Rumpf: Brust oben, Bauch unten; Vorderseite hell, Rücken dunkel
    const facing = n => { const a = pr([0, 0, 0]), b = pr(n); return b[2] - a[2]; };
    const mid = (a, b) => v.add(a, v.mul(v.sub(b, a), .5));
    const mN = mid(J.shN, J.hipN), mF = mid(J.shF, J.hipF);
    const torsoZ = [J.shN, J.shF, J.hipF, J.hipN].reduce((a, p) => a + X(p)[2], 0) / 4 - .5;
    parts.push({ z: torsoZ, fn: () => {
      ctx.lineJoin = "round";
      path([J.shN, J.shF, J.hipF, J.hipN], true); ctx.strokeStyle = halo; ctx.lineWidth = 11 * s; ctx.stroke();
      const quad = (pts, n) => { const col = mixHex(ink, chest, Math.max(.28, Math.min(1, (facing(n) + .55) / .8))); path(pts, true); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 8 * s; ctx.fill(); ctx.stroke(); };
      // die vom Betrachter abgewandte Hälfte zuerst
      const up = [[J.shN, J.shF, mF, mN], J.f], low = [[mN, mF, J.hipF, J.hipN], J.fLow];
      const zz = q => q[0].reduce((a, p) => a + X(p)[2], 0);
      (zz(up) < zz(low) ? [up, low] : [low, up]).forEach(q => quad(q[0], q[1]));
    } });
    // Kopf mit Nase in Blickrichtung
    parts.push({ z: X(J.head)[2], fn: () => {
      const q = X(J.head), n = X(J.S); ctx.lineCap = "round";
      ctx.strokeStyle = ink; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(n[0], n[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(q[0], q[1], (L.head + 1.5) * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(q[0], q[1], L.head * s, 0, Math.PI * 2); ctx.fill();
      const nz = X(v.add(J.head, v.mul(v.norm(v.cross(J.hu, v.cross(J.f, J.hu))), L.head + 2)));
      ctx.fillStyle = chest; ctx.beginPath(); ctx.arc(nz[0], nz[1], 3.6 * s, 0, Math.PI * 2); ctx.fill();
    } });
    parts.sort((a, b) => a.z - b.z).forEach(p => p.fn());

    // Fokus-Stelle
    if (anim.mark && J[anim.mark]) {
      const q = X(J[anim.mark]), ph = (t % 1.2) / 1.2;
      ctx.strokeStyle = mark; ctx.globalAlpha = 1 - ph * .7; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.arc(q[0], q[1], (9 + ph * 9) * s, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
    }
  }

  /* Beschriftung der aktuellen Bewegungsphase */
  function capAt(anim, t) {
    const F = anim.frames, T = total(anim); t = ((t % T) + T) % T;
    // Während der ersten Hälfte eines Übergangs gilt noch die Beschriftung der vorigen Phase
    for (let i = 0; i < F.length; i++) {
      const f = F[i], d = f.d || 0, h = f.hold || 0;
      if (t < d + h) return (t < d / 2 ? F[(i - 1 + F.length) % F.length].cap : f.cap) || "";
      t -= d + h;
    }
    return "";
  }

  function draw(ctx, w, h, anim, t, el) {
    const bg = css("--fig-bg", el, "transparent");
    ctx.clearRect(0, 0, w, h);
    if (bg !== "transparent") { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    const views = anim.views || [anim.cam || {}];
    const hasCap = anim.frames.some(f => f.cap);
    const top = hasCap ? Math.round(h * .15) : 0, H = h - top;
    const side = views.length > 1 && w > H * 1.15;
    const ink = css("--fig-ink", el, "#16211b"), muted = css("--fig-muted", el, "#5a6a61"), line = css("--fig-mat", el, "#d3dcd5");
    views.forEach((cam, i) => {
      const vw = side ? w / views.length : w, vh = side ? H : H / views.length;
      const x0 = side ? i * vw : 0, y0 = top + (side ? 0 : i * vh);
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, vw, vh); ctx.clip(); ctx.translate(x0, y0);
      drawView(ctx, vw, vh, anim, t, el, cam, i);
      if (views.length > 1 && cam.label) {
        ctx.font = `600 ${Math.round(Math.max(11, h * .05))}px Barlow, system-ui, sans-serif`;
        ctx.fillStyle = muted; ctx.textBaseline = "top"; ctx.fillText(cam.label, Math.round(h * .025), Math.round(h * .02));
      }
      ctx.restore();
      if (i > 0) { ctx.strokeStyle = line; ctx.lineWidth = Math.max(1, h * .006); ctx.beginPath(); if (side) { ctx.moveTo(x0, y0 + vh * .08); ctx.lineTo(x0, y0 + vh * .92); } else { ctx.moveTo(w * .06, y0); ctx.lineTo(w * .94, y0); } ctx.stroke(); }
    });
    if (hasCap) {
      const c = capAt(anim, t);
      if (c) {
        ctx.font = `700 ${Math.round(Math.max(14, top * .62))}px "Barlow Condensed", "Arial Narrow", sans-serif`;
        ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c, w / 2, top * .56); ctx.textAlign = "start";
      }
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
