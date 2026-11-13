/* 3D-Gliederpuppe für die Übungsanimationen.
 * Nutzt die Bewegungsdaten aus figure.js / figures.js (FIGURE_JOINTS) und zeichnet sie mit three.js
 * als Figur mit Körperform, Sportkleidung, Licht und Schatten. Zum Drehen der Ansicht mit Maus oder Finger ziehen.
 * Benötigt: three.js (global THREE), assets/figure.js, assets/figures.js
 */
(function () {
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const UP = new THREE.Vector3(0, 1, 0);

  function colors(el) {
    const cs = getComputedStyle(el);
    const g = (n, d) => (cs.getPropertyValue(n).trim() || d);
    return {
      skin: g("--mq-skin", "#d9a882"), shirt: g("--mq-shirt", "#1f7a55"), shorts: g("--mq-shorts", "#24303f"),
      sock: g("--mq-sock", "#f2f2ee"), shoe: g("--mq-shoe", "#ecedee"), sole: g("--mq-sole", "#3b3f45"),
      mat: g("--mq-mat", "#5f7f9a"), floor: g("--mq-floor", "#d8d2c6"),
      mark: g("--mq-mark", "#e0901a"), trail: g("--mq-trail", "#e0901a"), face: g("--mq-face", "#2d3b33"), hair: g("--mq-hair", "#3a2e26")
    };
  }

  window.MannequinPlayer = function (host) {
    const C = colors(host);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 16 / 9, 5, 2000);

    // Licht: weiches Umgebungslicht, Hauptlicht von oben vorn mit Schatten, Gegenlicht
    scene.add(new THREE.HemisphereLight(0xffffff, 0x6b665e, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 0.68);
    sun.position.set(60, 220, 140);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -160, right: 160, top: 160, bottom: -160, near: 10, far: 600 });
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffffff, 0.25); rim.position.set(-120, 80, -120); scene.add(rim);

    // Boden und Matte
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: C.floor, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.2; floor.receiveShadow = true; scene.add(floor);
    const mat = new THREE.Mesh(new THREE.BoxGeometry(180, 1.2, 64), new THREE.MeshStandardMaterial({ color: C.mat, roughness: .95 }));
    mat.position.y = -0.6; mat.receiveShadow = true; scene.add(mat);

    /* Menschlichere Figur: Haut, Sportshirt, kurze Hose, Socken, Schuhe.
       Gliedmaßen mit Muskelform (gedrehte Profile), Rumpf als biegsamer Körper,
       der sich zwischen Becken und Schultern krümmt und verdreht. */
    const skin = C.skin, shirt = C.shirt, shorts = C.shorts, sock = C.sock, shoe = C.shoe;
    const mSkin = new THREE.MeshStandardMaterial({ color: skin, roughness: .62 });
    const mHair = new THREE.MeshStandardMaterial({ color: C.hair, roughness: .85 });
    const mShoe = new THREE.MeshStandardMaterial({ color: shoe, roughness: .5 });
    const mSole = new THREE.MeshStandardMaterial({ color: C.sole, roughness: .7 });
    const mVC = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .62 });
    const sph = new THREE.SphereGeometry(1, 24, 18);
    const add = (geo, m) => { const o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true; scene.add(o); return o; };
    const col = c => new THREE.Color(c).convertSRGBToLinear();

    // Gliedmaß aus einem Profil r(y), y von 0 (Ansatz) bis 1 (Ende), Farbe je Höhe (Ärmel, Hosenbein, Socke)
    function limbGeo(profile, colorAt) {
      const pts = []; const N = 18;
      for (let i = 0; i <= N; i++) { const y = i / N; pts.push(new THREE.Vector2(Math.max(.001, profile(y)), y)); }
      const g = new THREE.LatheGeometry(pts, 22);
      const pos = g.attributes.position, cols = [];
      for (let i = 0; i < pos.count; i++) { const c = col(colorAt(pos.getY(i))); cols.push(c.r, c.g, c.b); }
      g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      g.computeVertexNormals();
      return g;
    }
    const bump = (y, c, w) => Math.exp(-((y - c) * (y - c)) / (2 * w * w));
    const G = {
      upperArm: limbGeo(y => 4.3 + 1.0 * bump(y, .3, .18) - .8 * y, y => y < .42 ? shirt : skin),
      foreArm: limbGeo(y => 3.7 + .9 * bump(y, .22, .2) - 1.5 * y, () => skin),
      thigh: limbGeo(y => 7.6 + .7 * bump(y, .3, .2) - 2.6 * y, y => y < .5 ? shorts : skin),
      shin: limbGeo(y => 4.8 + 1.5 * bump(y, .28, .14) - 1.9 * y, y => y > .86 ? sock : skin),
      neck: limbGeo(y => 4.7 - .4 * y, () => skin)
    };
    function limb(geo, rA, rB) {
      const o = add(geo, mVC), a = add(sph, mVC), b = add(sph, mVC);
      // Gelenkkugeln in der Farbe der angrenzenden Stelle
      const ca = geo.attributes.color, top = new THREE.Color(ca.getX(0), ca.getY(0), ca.getZ(0)), bot = new THREE.Color(ca.getX(ca.count - 1), ca.getY(ca.count - 1), ca.getZ(ca.count - 1));
      a.material = new THREE.MeshStandardMaterial({ color: top, roughness: .62 }); b.material = new THREE.MeshStandardMaterial({ color: bot, roughness: .62 });
      return {
        set(p, q) {
          const P = V(p), Q = V(q), d = Q.clone().sub(P), len = Math.max(d.length(), .01);
          o.position.copy(P); o.quaternion.setFromUnitVectors(UP, d.normalize()); o.scale.set(1, len, 1);
          a.position.copy(P); a.scale.setScalar(rA); b.position.copy(Q); b.scale.setScalar(rB);
        }
      };
    }
    function blob(m) {
      const o = add(sph, m);
      return {
        mesh: o,
        set(center, x, y, z, sx, sy, sz) {
          o.position.copy(V(center));
          o.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(x).normalize(), V(y).normalize(), V(z).normalize()));
          o.scale.set(sx, sy, sz);
        }
      };
    }
    // Schuh: abgerundeter Körper mit Sohle
    function shoeMesh() {
      const up = add(sph, mShoe), so = add(new THREE.BoxGeometry(1, 1, 1), mSole);
      return {
        // Ferse, Zehenspitze und Fußrücken-Richtung kommen aus der Pose
        set(heel, toe, top) {
          const H = V(heel), T = V(toe), d = T.clone().sub(H); const len = d.length() + 2;
          const fwd = d.clone().normalize();
          let upv = V(top); upv.addScaledVector(fwd, -upv.dot(fwd)); if (upv.lengthSq() < 1e-4) upv.set(0, 1, 0); upv.normalize();
          const lat = new THREE.Vector3().crossVectors(fwd, upv).normalize();
          const m = new THREE.Matrix4().makeBasis(fwd, upv, lat);
          up.quaternion.setFromRotationMatrix(m); so.quaternion.copy(up.quaternion);
          const c = H.clone().add(T).multiplyScalar(.5);
          up.position.copy(c).addScaledVector(upv, .5).addScaledVector(fwd, .3); up.scale.set(len / 2, 3.7, 4.3);
          so.position.copy(c).addScaledVector(upv, -2.3); so.scale.set(len * .9, 1.1, 7.4);
        }
      };
    }

    // Rumpf: Ringe entlang einer Kurve vom Becken zu den Schultern
    const RINGS = 16, SEG = 26;
    const torsoGeo = new THREE.BufferGeometry();
    const tPos = new Float32Array((RINGS * SEG + 2) * 3), tCol = [];
    const idx = [];
    for (let r = 0; r < RINGS; r++) {
      const y = r / (RINGS - 1), c = col(y < .36 ? shorts : shirt);
      for (let k = 0; k < SEG; k++) tCol.push(c.r, c.g, c.b);
    }
    { const c1 = col(shorts), c2 = col(shirt); tCol.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b); }
    for (let r = 0; r < RINGS - 1; r++) for (let k = 0; k < SEG; k++) {
      const a = r * SEG + k, b = r * SEG + (k + 1) % SEG, c = a + SEG, d = b + SEG;
      idx.push(a, c, b, b, c, d);
    }
    const bottom = RINGS * SEG, top = bottom + 1;
    for (let k = 0; k < SEG; k++) { idx.push(bottom, k, (k + 1) % SEG); idx.push(top, (RINGS - 1) * SEG + (k + 1) % SEG, (RINGS - 1) * SEG + k); }
    torsoGeo.setIndex(idx);
    torsoGeo.setAttribute("position", new THREE.BufferAttribute(tPos, 3));
    torsoGeo.setAttribute("color", new THREE.Float32BufferAttribute(tCol, 3));
    const torso = add(torsoGeo, mVC);
    torso.frustumCulled = false;
    // Breite (seitlich) und Tiefe (vorn/hinten) des Rumpfs von Becken (0) bis Schultern (1)
    const prof = (y, tab) => { for (let i = 1; i < tab.length; i++) if (y <= tab[i][0]) { const a = tab[i - 1], b = tab[i], k = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (k * k * (3 - 2 * k)); } return tab[tab.length - 1][1]; };
    const WID = [[0, 12.5], [.1, 16], [.3, 14.8], [.45, 13], [.65, 14.8], [.85, 16.6], [.95, 16.4], [1, 15]];
    const DEP = [[0, 8.5], [.1, 10.4], [.3, 9.8], [.45, 9], [.65, 10.8], [.85, 9.8], [.95, 8.4], [1, 6.6]];

    const parts = {
      uaN: limb(G.upperArm, 4.4, 3.6), faN: limb(G.foreArm, 3.6, 2.3),
      uaF: limb(G.upperArm, 4.4, 3.6), faF: limb(G.foreArm, 3.6, 2.3),
      thN: limb(G.thigh, 7.6, 5.0), shinN: limb(G.shin, 5.0, 2.9),
      thF: limb(G.thigh, 7.6, 5.0), shinF: limb(G.shin, 5.0, 2.9),
      neck: limb(G.neck, 4.7, 4.3),
      head: blob(mSkin), hair: blob(mHair), nose: blob(mSkin), earN: blob(mSkin), earF: blob(mSkin),
      handN: blob(mSkin), handF: blob(mSkin), thumbN: blob(mSkin), thumbF: blob(mSkin),
      shoeN: shoeMesh(), shoeF: shoeMesh()
    };

    // Fokus-Ring und Bewegungsbahn
    const ring = new THREE.Mesh(new THREE.TorusGeometry(11, 1.2, 10, 48), new THREE.MeshBasicMaterial({ color: C.mark, transparent: true, opacity: .9, depthTest: false }));
    ring.renderOrder = 10; scene.add(ring);
    let trailLines = [];

    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
    const lerp = (a, b, k) => addv(a, mul(sub(b, a), k));
    const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return mul(a, 1 / l); };
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const slerpV = (a, b, k) => { a = nrm(a); b = nrm(b); const d = Math.max(-1, Math.min(1, dot(a, b))), w = Math.acos(d); if (w < 1e-3) return nrm(lerp(a, b, k)); const s = Math.sin(w); return addv(mul(a, Math.sin((1 - k) * w) / s), mul(b, Math.sin(k * w) / s)); };

    let breath = 0;
    function pose(J) {
      const sAx = nrm(sub(J.shN, J.shF)), pAx = nrm(sub(J.hipN, J.hipF));
      const curl = J.curlV ? J.curlV[0] : 0;
      // Rumpfkurve: Becken unten, Schultern oben, Mitte nach hinten (Rundrücken) oder vorn (Hohlkreuz) verschoben
      const A = addv(J.P, mul(J.u, -6)), B = addv(J.S, mul(J.u, 2.4));
      const backDir = nrm(addv(mul(J.f, -1), mul(J.fLow, -1)));
      const Cc = addv(lerp(A, B, .5), mul(backDir, curl * 1.5));
      const bez = t => addv(addv(mul(A, (1 - t) * (1 - t)), mul(Cc, 2 * t * (1 - t))), mul(B, t * t));
      const br = 1 + .025 * Math.sin(breath);
      for (let r = 0; r < RINGS; r++) {
        const y = r / (RINGS - 1);
        const c = bez(y), tan = nrm(sub(bez(Math.min(1, y + .02)), bez(Math.max(0, y - .02))));
        let side = slerpV(pAx, sAx, Math.max(0, Math.min(1, (y - .2) / .7)));
        side = nrm(sub(side, mul(tan, dot(side, tan))));
        const fr = nrm(cross(tan, side));
        const wx = prof(y, WID), wz = prof(y, DEP) * (y > .5 ? br : 1);
        for (let k = 0; k < SEG; k++) {
          const a = k / SEG * Math.PI * 2;
          const p = addv(c, addv(mul(side, Math.cos(a) * wx), mul(fr, Math.sin(a) * wz)));
          tPos.set(p, (r * SEG + k) * 3);
        }
      }
      tPos.set(addv(bez(0), mul(J.u, -1)), bottom * 3); tPos.set(addv(bez(1), mul(J.u, 1)), top * 3);
      torsoGeo.attributes.position.needsUpdate = true; torsoGeo.computeVertexNormals(); torsoGeo.computeBoundingSphere();

      // Arme und Beine
      parts.uaN.set(J.shN, J.eN); parts.faN.set(J.eN, J.hN);
      parts.uaF.set(J.shF, J.eF); parts.faF.set(J.eF, J.hF);
      parts.thN.set(J.hipN, J.kN); parts.shinN.set(J.kN, J.fN);
      parts.thF.set(J.hipF, J.kF); parts.shinF.set(J.kF, J.fF);
      // Füße: gestreckt, wenn das Schienbein flach liegt, sonst flach nach vorn
      parts.shoeN.set(J.heelN, J.toeN, J.ftopN); parts.shoeF.set(J.heelF, J.toeF, J.ftopF);
      // Hände: flach, Daumen innen
      const hand = (key, e, side, hb, tb) => {
        let d = nrm(sub(J[key], J[e]));
        // aufgestützte Hand liegt flach, Finger zeigen nach vorn (Richtung Kopf) bzw. vom Körper weg
        const w = Math.max(0, Math.min(1, (6 - J[key][1]) / 3));
        if (w > 0) {
          const hz = x => [x[0], 0, x[2]];
          let fd = hz(J.u); if (Math.hypot(fd[0], fd[2]) < .3) fd = hz(d); if (Math.hypot(fd[0], fd[2]) < .05) fd = [1, 0, 0];
          d = nrm(slerpV(d, nrm(fd), w * .9));
        }
        let lat = nrm(sub(sAx, mul(d, dot(sAx, d)))); const pal = nrm(cross(d, lat));
        hb.set(addv(J[key], mul(d, 4.6)), lat, d, pal, 3.9, 6.6, 2.0);
        tb.set(addv(addv(J[key], mul(d, 1.2)), mul(lat, -side * 3.2)), lat, d, pal, 1.2, 2.6, 1.2);
      };
      hand("hN", "eN", 1, parts.handN, parts.thumbN); hand("hF", "eF", -1, parts.handF, parts.thumbF);

      // Hals und Kopf; der Blick folgt dem Blickziel (z. B. der Hand)
      const neckBase = addv(B, mul(J.u, -2));
      let hu = J.hu;
      const lookDir = nrm(sub(J.look, J.head));
      let hf = nrm(cross(hu, cross(J.f, hu)));
      // Kopf bis zu 60 % zum Ziel drehen und neigen
      const tgtF = nrm(sub(lookDir, mul(hu, dot(lookDir, hu) * .5)));
      hf = slerpV(hf, tgtF, .6);
      hu = nrm(sub(hu, mul(hf, dot(hu, hf))));
      const hs = nrm(cross(hu, hf));
      const headC = addv(neckBase, mul(hu, 17));
      parts.neck.set(neckBase, addv(headC, mul(hu, -7)));
      parts.head.set(headC, hs, hu, hf, 8.2, 10.6, 9.4);
      parts.hair.set(addv(headC, addv(mul(hf, -1.4), mul(hu, 3.2))), hs, hu, hf, 8.9, 8.6, 10.2);
      parts.nose.set(addv(headC, addv(mul(hf, 9.1), mul(hu, -2.6))), hs, hu, hf, 1.5, 2.5, 2.3);
      parts.earN.set(addv(headC, addv(mul(hs, 8), mul(hf, -.6))), hs, hu, hf, 1.1, 2.6, 1.7);
      parts.earF.set(addv(headC, addv(mul(hs, -8), mul(hf, -.6))), hs, hu, hf, 1.1, 2.6, 1.7);
    }

    /* Kamera: Ausgangswinkel aus der Übung, dann mit Ziehen frei drehbar */
    let anim = null, t0 = performance.now(), yaw = 0, pitch = 0.3, dist = 300, center = new THREE.Vector3(), userMoved = false;
    function setCam() {
      const d = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      camera.position.copy(center).add(d.multiplyScalar(dist));
      camera.lookAt(center);
    }
    function frameAnim() {
      // Mittelpunkt und Größe über die ganze Bewegung
      const T = FIGURE_TOTAL(anim); let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
      for (let i = 0; i < 30; i++) {
        const J = FIGURE_JOINTS(anim, T * i / 30);
        ["P", "S", "head", "hN", "hF", "fN", "fF", "kN", "kF"].forEach(k => J[k].forEach((x, j) => { lo[j] = Math.min(lo[j], x); hi[j] = Math.max(hi[j], x); }));
      }
      center.set((lo[0] + hi[0]) / 2, Math.max(18, (lo[1] + hi[1]) / 2), (lo[2] + hi[2]) / 2);
      const size = Math.max(hi[0] - lo[0], hi[1] - lo[1] + 20, hi[2] - lo[2]);
      dist = (size * 2.35 + 70) / (anim.zoom || 1);
      const c = anim.cam3d || (anim.views && anim.views[0]) || anim.cam || {};
      yaw = (c.yaw ?? -28) * Math.PI / 180; pitch = Math.max(.12, Math.min(1.35, (c.pitch ?? 14) * Math.PI / 180 + .12));
      // Bewegungsbahn
      trailLines.forEach(l => scene.remove(l)); trailLines = [];
      const keys = anim.trail === undefined ? null : [].concat(anim.trail);
      const pick = keys || ["hN", "hF", "fN", "fF", "kN", "kF"];
      const tracks = pick.map(k => { const pts = []; for (let i = 0; i <= 80; i++) pts.push(FIGURE_JOINTS(anim, T * i / 80)[k]); let s = 0; pts.forEach(p => s = Math.max(s, Math.hypot(...sub(p, pts[0])))); return { pts, s }; })
        .sort((a, b) => b.s - a.s).slice(0, keys ? pick.length : 1).filter(x => x.s > 10);
      tracks.forEach(tr => {
        const g = new THREE.BufferGeometry().setFromPoints(tr.pts.map(V));
        const l = new THREE.Line(g, new THREE.LineDashedMaterial({ color: C.trail, dashSize: 3, gapSize: 3, transparent: true, opacity: .8 }));
        l.computeLineDistances(); scene.add(l); trailLines.push(l);
      });
      setCam();
    }

    // Ziehen zum Drehen
    let drag = null;
    const el = renderer.domElement;
    el.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, yaw, pitch }; el.setPointerCapture(e.pointerId); });
    el.addEventListener("pointermove", e => {
      if (!drag) return;
      yaw = drag.yaw - (e.clientX - drag.x) * .008;
      pitch = Math.max(.05, Math.min(1.45, drag.pitch + (e.clientY - drag.y) * .006));
      userMoved = true; setCam();
    });
    const end = () => { drag = null; };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);

    let raf = 0, speed = 1;
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let onCap = null, fixed = null;
    function loop(now) {
      const r = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      if (renderer.domElement.width !== Math.round(w * renderer.getPixelRatio()) || renderer.domElement.height !== Math.round(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      if (anim && r.width > 0) {
        const t = fixed !== null ? fixed : reduce ? .6 : (now - t0) / 1000 * speed;
        const J = FIGURE_JOINTS(anim, t);
        breath = t * 2 * Math.PI / 3.6;
        pose(J);
        if (anim.mark && J[anim.mark]) {
          ring.visible = true; ring.position.copy(V(J[anim.mark])); ring.lookAt(camera.position);
          const ph = (t % 1.2) / 1.2; ring.scale.setScalar(.9 + ph * .7); ring.material.opacity = .95 - ph * .6;
        } else ring.visible = false;
        if (onCap) onCap(FIGURE_CAP(anim, t));
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return {
      set(a) { if (a !== anim) { anim = a; t0 = performance.now(); userMoved = false; frameAnim(); } },
      resetView() { if (anim) frameAnim(); },
      onCaption(fn) { onCap = fn; },
      speed(x) { speed = x; },
      freeze(t) { fixed = t; },
      stop() { cancelAnimationFrame(raf); renderer.dispose(); }
    };
  };
})();
