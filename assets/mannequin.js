/* 3D-Gliederpuppe für die Übungsanimationen.
 * Nutzt die Bewegungsdaten aus figure.js / figures.js (FIGURE_JOINTS) und zeichnet sie mit three.js
 * als Puppe mit Volumen, Licht und Schatten. Zum Drehen der Ansicht mit Maus oder Finger ziehen.
 * Benötigt: three.js (global THREE), assets/figure.js, assets/figures.js
 */
(function () {
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const UP = new THREE.Vector3(0, 1, 0);

  function colors(el) {
    const cs = getComputedStyle(el);
    const g = (n, d) => (cs.getPropertyValue(n).trim() || d);
    return {
      body: g("--mq-body", "#d9b98f"), near: g("--mq-near", "#1f7a55"), far: g("--mq-far", "#7f938a"),
      joint: g("--mq-joint", "#c9b291"), mat: g("--mq-mat", "#5f7f9a"), floor: g("--mq-floor", "#d8d2c6"),
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

    const mBody = new THREE.MeshStandardMaterial({ color: C.body, roughness: .55, metalness: 0 });
    const mJoint = new THREE.MeshStandardMaterial({ color: C.joint, roughness: .5 });
    const mNear = new THREE.MeshStandardMaterial({ color: C.near, roughness: .55 });
    const mFar = new THREE.MeshStandardMaterial({ color: C.far, roughness: .6 });
    const mFace = new THREE.MeshStandardMaterial({ color: C.face, roughness: .4 });
    const mHair = new THREE.MeshStandardMaterial({ color: C.hair, roughness: .8 });

    const cyl = new THREE.CylinderGeometry(1, 1, 1, 18);
    const sph = new THREE.SphereGeometry(1, 22, 16);
    const add = (geo, m) => { const o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true; scene.add(o); return o; };

    // Gliedmaßen als Kapseln (Zylinder + Kugeln an den Enden)
    function capsule(m, r1, r2) {
      const c = add(cyl, m), a = add(sph, m), b = add(sph, m);
      return {
        set(p, q) {
          const P = V(p), Q = V(q), d = Q.clone().sub(P), len = Math.max(d.length(), .01);
          c.position.copy(P).add(Q).multiplyScalar(.5);
          c.quaternion.setFromUnitVectors(UP, d.clone().normalize());
          c.scale.set((r1 + r2) / 2, len, (r1 + r2) / 2);
          a.position.copy(P); a.scale.setScalar(r1);
          b.position.copy(Q); b.scale.setScalar(r2);
        }
      };
    }
    // Körperteile mit eigener Ausrichtung (Brustkorb, Becken)
    function blob(m) {
      const o = add(sph, m);
      return {
        set(center, x, y, z, sx, sy, sz) {
          o.position.copy(V(center));
          const X = V(x).normalize(), Y = V(y).normalize(), Z = V(z).normalize();
          o.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
          o.scale.set(sx, sy, sz);
        }
      };
    }

    const parts = {
      thN: capsule(mNear, 6.2, 4.6), shinN: capsule(mNear, 4.6, 3.4),
      thF: capsule(mFar, 6.2, 4.6), shinF: capsule(mFar, 4.6, 3.4),
      uaN: capsule(mNear, 4.0, 3.2), faN: capsule(mNear, 3.2, 2.4),
      uaF: capsule(mFar, 4.0, 3.2), faF: capsule(mFar, 3.2, 2.4),
      footN: capsule(mNear, 3.0, 2.2), footF: capsule(mFar, 3.0, 2.2),
      neck: capsule(mBody, 3.4, 3.4), waist: capsule(mBody, 9, 9.5),
      chest: blob(mBody), pelvis: blob(mBody), head: blob(mBody),
      handN: blob(mNear), handF: blob(mFar), nose: blob(mBody), hair: blob(mHair)
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

    function pose(J) {
      // Füße: gestreckt, wenn das Schienbein flach liegt, sonst flach nach vorn
      const toe = (k, f) => { const d = nrm(sub(J[f], J[k])); const dir = Math.abs(d[1]) < .5 ? d : [1, 0, 0]; const t = addv(J[f], mul(dir, 12)); t[1] = Math.max(t[1], 2.2); return t; };
      const toeN = toe("kN", "fN"), toeF = toe("kF", "fF");
      parts.thN.set(J.hipN, J.kN); parts.shinN.set(J.kN, J.fN); parts.footN.set(J.fN, toeN);
      parts.thF.set(J.hipF, J.kF); parts.shinF.set(J.kF, J.fF); parts.footF.set(J.fF, toeF);
      parts.uaN.set(J.shN, J.eN); parts.faN.set(J.eN, J.hN);
      parts.uaF.set(J.shF, J.eF); parts.faF.set(J.eF, J.hF);
      const sAx = nrm(sub(J.shN, J.shF)), pAx = nrm(sub(J.hipN, J.hipF));
      // Brustkorb
      const chestC = lerp(J.S, J.P, .28);
      parts.chest.set(chestC, sAx, J.u, J.f, 17.5, 19, 10.5);
      // Becken
      const pelC = lerp(J.P, J.S, .02);
      parts.pelvis.set(pelC, pAx, J.u, J.fLow, 14.5, 10, 9.5);
      parts.waist.set(lerp(J.P, J.S, .18), lerp(J.P, J.S, .55));
      // Hals und Kopf mit Gesicht
      const neckTop = addv(J.S, mul(J.hu, 6));
      parts.neck.set(lerp(J.S, J.P, -.02), neckTop);
      const hf = nrm(cross(J.hu, cross(J.f, J.hu)));
      const hs = nrm(cross(J.hu, hf));
      parts.head.set(J.head, hs, J.hu, hf, 8.2, 10, 9);
      parts.nose.set(addv(J.head, addv(mul(hf, 8.4), mul(J.hu, -1.2))), hs, J.hu, hf, 1.8, 2.6, 2.6);
      // Haare hinten und oben: zeigen eindeutig, wohin das Gesicht schaut
      parts.hair.set(addv(J.head, addv(mul(hf, -1.6), mul(J.hu, 1.4))), hs, J.hu, hf, 8.6, 9.6, 8.2);
      parts.handN.set(J.hN, sAx, J.u, J.f, 3.6, 4.2, 2.4);
      parts.handF.set(J.hF, sAx, J.u, J.f, 3.6, 4.2, 2.4);
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
      dist = size * 2.35 + 70;
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
