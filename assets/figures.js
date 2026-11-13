/* Bibliothek der Übungsfiguren. Schlüssel werden in den Einheiten als  fig: "<schlüssel>"  verwendet.
 * Format siehe assets/figure.js.
 */
window.FIGS = (function () {
  const up = [0, 1, 0], fwd = [1, 0, 0], back = [-1, 0, 0];

  /* gemeinsame Ausgangsposen */
  const tallKneel = (o = {}) => Object.assign({ P: [2, 47], t: 180, fN: [-36, 3], fF: [-36, 3], kN: [1, -.3, 0] }, o);
  const supine = (o = {}) => Object.assign({ P: [0, 9], t: -90 }, o);
  const plank = (o = {}) => Object.assign({ P: [0, 39.5], t: 110, hd: 8, tuck: [1, 1], hN: [47, 0], hF: [47, 0], fN: [-84, 14], fF: [-84, 14], kN: [.5, -1, 0], eN: [-1, .1, .5], eF: [-1, .1, -.5] }, o);
  const lunge = (o = {}) => Object.assign({ P: [0, 26], t: 116, tuck: [0, 1], fN: [44, 0], fF: [-80, 16], kN: [1, .3, 0], kF: [1, -1, 0] }, o);
  const sideLie = (o = {}) => Object.assign({ P: [0, 17], t: 90, roll: -90, hd: 0,
    fN: [-38, 14, 40], fF: [-38, 3, 40], kN: [0, 0, 1], hN: [52, 8, 46], hF: [52, 2, 46], eN: [0, 0, 1], eF: [0, 0, 1] }, o);

  return {
    fersensitz: { trail: "P", mark: "lowback", cam: { yaw: -26, pitch: 12 }, frames: [
      { d: 1.1, hold: 2.2, p: { P: [-18, 21], t: 172, fN: [-26, 2, 14], fF: [-26, 2, -14], kN: fwd, hN: [4, 19, 12], hF: [4, 19, -12], eN: [-.3, 0, 1], eF: [-.3, 0, -1] } },
      { d: 1.2, hold: .8, p: { P: [14, 48], t: 180, fN: [-27, 2, 14], fF: [-26, 2, -14], kN: [1, -1, 0] } }
    ]},

    sprunggelenk: { trail: "kN", mark: "fN", cam: { yaw: -16, pitch: 10 }, frames: [
      { d: 1, hold: .5, p: { P: [0, 46], t: 180, fN: [37, 0], fF: [-42, 3], kN: [1, .2, 0], kF: [.3, -1, 0], hN: { at: "S", w: [24, -50, 10] }, hF: { at: "S", w: [24, -50, 2] } } },
      { d: 1.2, hold: .9, p: { P: [29, 43], t: 172, fN: [37, 0], fF: [-42, 3], kN: [1, .1, 0], kF: [.3, -1, 0], hN: { at: "S", w: [26, -48, 10] }, hF: { at: "S", w: [26, -48, 2] } } }
    ]},

    "9090-haende": { cam3d: { yaw: -55, pitch: 26 }, trail: ["kN", "kF"], cam: { yaw: -78, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-26, 1, 28], hF: [-26, 1, -28], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-26, 1, 28], hF: [-26, 1, -28], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-26, 1, 28], hF: [-26, 1, -28], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-26, 1, 28], hF: [-26, 1, -28], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "9090-frei": { trail: ["kN", "kF"], cam: { yaw: -78, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "shN", d: [46, 10, -4] }, hF: { at: "shF", d: [46, 10, 4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: 6, hN: { at: "shN", d: [46, 10, 0] }, hF: { at: "shF", d: [46, 10, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "shN", d: [46, 10, 0] }, hF: { at: "shF", d: [46, 10, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: -6, hN: { at: "shN", d: [46, 10, 0] }, hF: { at: "shF", d: [46, 10, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "9090-streck": { trail: ["P"], mark: "P", cam: { yaw: -78, pitch: 24 }, frames: [
      { d: .9, hold: .1, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.3, hold: .8, p: { P: [17, 44, 33], t: 180, yaw: -41, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [-.6, -1, 1], kF: [.6, -1, 0] } },
      { d: 1.1, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: .9, hold: .1, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } },
      { d: 1.3, hold: .8, p: { P: [17, 44, -33], t: 180, yaw: 41, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [.6, -1, 0], kF: [-.6, -1, -1] } },
      { d: 1.1, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "ausfall-rotation": { cam: { yaw: -14, pitch: 14 }, frames: [
      { d: .8, hold: .5, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 30], t: 122, hN: [38, 0, 4], eN: [1, 0, .5], hF: [38, 0, -12] }) },
      { d: .6, hold: 0, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 30.3], t: 122.5, tw: -25, hd: -8, hN: [42, 48, 14], eN: [1, 0, .5], hF: [38, 0, -12] }) },
      { d: .6, hold: 0, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 30.6], t: 123, tw: -55, hd: -18, hN: { at: "shN", w: [0, 12, 44] }, eN: [1, 0, .5], hF: [38, 0, -12] }) },
      { d: .6, hold: .9, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 31], t: 124, tw: -85, hd: -28, hN: { at: "shN", w: [-4, 50, 8] }, eN: [1, 0, .5], hF: [38, 0, -12] }) },
      { d: .6, hold: 0, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 30.6], t: 123, tw: -55, hd: -18, hN: { at: "shN", w: [0, 12, 44] }, eN: [1, 0, .5], hF: [38, 0, -12] }) },
      { d: .6, hold: 0, p: lunge({ fN: [44, 0, 26], kN: [1, .3, .7], P: [0, 30.3], t: 122.5, tw: -25, hd: -8, hN: [42, 48, 14], eN: [1, 0, .5], hF: [38, 0, -12] }) }
    ]},

    bws: { trail: ["eN", "eF"], cam: { yaw: -30, pitch: 20 }, frames: [
      { d: 1, hold: .4, p: { P: [0, 11], t: 180, fN: [22, 2, -12], fF: [24, 2, 12], kN: [.3, .3, 1], kF: [.3, .3, -1], hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } } },
      { d: 1.3, hold: .8, p: { P: [0, 11], t: 180, fN: [22, 2, -12], fF: [24, 2, 12], kN: [.3, .3, 1], kF: [.3, .3, -1], hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] }, tw: 55, lat: -28 } },
      { d: 1, hold: .4, p: { P: [0, 11], t: 180, fN: [22, 2, -12], fF: [24, 2, 12], kN: [.3, .3, 1], kF: [.3, .3, -1], hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } } },
      { d: 1.3, hold: .8, p: { P: [0, 11], t: 180, fN: [22, 2, -12], fF: [24, 2, 12], kN: [.3, .3, 1], kF: [.3, .3, -1], hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] }, tw: -55, lat: 28 } }
    ]},

    "situp-drehung": { cam: { yaw: -28, pitch: 18 }, frames: [
      { d: 1, hold: .3, p: supine({ fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: [-6, 2, -22] }) },
      { d: 1.1, hold: .5, p: supine({ t: -205, tw: -60, fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: { at: "S", w: [26, -20, -22] } }) }
    ]},

    "vsit-einbeinig": { trail: [], cam: { yaw: -30, pitch: 18 }, frames: [
      { d: .9, hold: .4, p: supine({ kN: [-.6, 1, 0], kF: [-.6, 1, 0], fN: [84, 4], fF: [84, 4], hN: [2, 2, 18], hF: [0, 2, -18] }) },
      { d: 1, hold: .6, p: supine({ kN: [-.6, 1, 0], kF: [-.6, 1, 0], t: -135, hd: 18, fN: [21, 89], fF: [84, 4], hN: [9, 62, 13], hF: [9, 62, 6], eN: [0, -1, 0] }) },
      { d: .9, hold: .4, p: supine({ kN: [-.6, 1, 0], kF: [-.6, 1, 0], fN: [84, 4], fF: [84, 4], hN: [2, 2, 18], hF: [0, 2, -18] }) },
      { d: 1, hold: .6, p: supine({ kN: [-.6, 1, 0], kF: [-.6, 1, 0], t: -135, hd: 18, fN: [84, 4], fF: [21, 89], hN: [9, 62, -6], hF: [9, 62, -13], eN: [0, -1, 0] }) }
    ]},

    "hollow-rocks": { trail: ["fN", "head"], mark: "lowback", cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .8, hold: 0, p: { P: [0, 8], t: -128, hd: 10, fN: [86, 12], fF: [86, 12], kN: [-.5, 1, 0], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } },
      { d: .8, hold: 0, p: { P: [0, 8], t: -102, hd: 10, fN: [70, 50], fF: [70, 50], kN: [-.5, 1, 0], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } }
    ]},

    fahrrad: { trail: ["kN", "kF"], cam: { yaw: -26, pitch: 22 }, frames: [
      { d: .8, hold: .2, p: supine({ t: -136, tw: 42, hd: 14, fN: [16, 32], fF: [74, 18], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: .8, hold: .2, p: supine({ t: -136, tw: -42, hd: 14, fN: [74, 18], fF: [16, 32], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) }
    ]},

    "knie-anziehen": { cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .9, hold: .2, p: { P: [0, 10], t: 205, hN: { at: "S", d: [11, -5, -7] }, hF: { at: "S", d: [11, -5, 7] }, fN: [28, 26], fF: [28, 26], kN: [0, 1, 0] } },
      { d: .9, hold: .2, p: { P: [0, 10], t: 212, hN: { at: "S", d: [11, -5, -7] }, hF: { at: "S", d: [11, -5, 7] }, fN: [76, 20], fF: [76, 20], kN: [0, 1, 0] } }
    ]},

    "russian-twist": { trail: ["hN"], cam: { yaw: -40, pitch: 30 }, frames: [
      { d: .9, hold: .3, p: { P: [0, 10], t: 220, tw: 50, fN: [36, 3], fF: [36, 3], kN: [0, 1, 0], hN: { at: "S", d: [26, -16, 3] }, hF: { at: "S", d: [26, -16, -3] } } },
      { d: .9, hold: .3, p: { P: [0, 10], t: 220, tw: -50, fN: [36, 3], fF: [36, 3], kN: [0, 1, 0], hN: { at: "S", d: [26, -16, 3] }, hF: { at: "S", d: [26, -16, -3] } } }
    ]},

    "flutter-kicks": { trail: [], mark: "lowback", cam: { yaw: -24, pitch: 14 }, frames: [
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [79, 27], fF: [83, 8] }) },
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [83, 8], fF: [79, 27] }) }
    ]},

    schulterklopfen: { cam3d: { yaw: -22, pitch: 14 }, trail: [], mark: "P", cam: { yaw: -40, pitch: 22 }, frames: [
      { d: .5, hold: .3, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14] }) },
      { d: .35, hold: 0, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hN: { at: "shN", d: [30, -4, -2] }, eN: [.3, -.2, 1] }) },
      { d: .4, hold: .4, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hN: { at: "shF", d: [3, 2, 6] }, eN: [1, -.5, .4] }) },
      { d: .4, hold: 0, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hN: { at: "shN", d: [30, -4, -2] }, eN: [.3, -.2, 1] }) },
      { d: .35, hold: .3, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14] }) },
      { d: .35, hold: 0, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hF: { at: "shF", d: [30, -4, 2] }, eF: [.3, -.2, -1] }) },
      { d: .4, hold: .4, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hF: { at: "shN", d: [3, 2, -6] }, eF: [1, -.5, -.4] }) },
      { d: .4, hold: 0, p: plank({ fN: [-84, 14, 14], fF: [-84, 14, -14], hF: { at: "shF", d: [30, -4, 2] }, eF: [.3, -.2, -1] }) }
    ]},

    "huefte-einbeinig": { trail: [], mark: "P", cam: { yaw: -26, pitch: 16 }, frames: [
      { d: .9, hold: .5, p: supine({ P: [0, 8], hN: [2, 2, 16], hF: [0, 2, -16], fN: [26, 0], kN: up, fF: { at: "hipF", w: [16, 20, 0] }, kF: [-1, 1.2, 0] }) },
      { d: 1, hold: 1, p: supine({ P: [0, 33], t: -62, hd: -14, hN: [-4, 2, 16], hF: [-6, 2, -16], eN: up, fN: [26, 0], kN: up, fF: { at: "hipF", w: [16, 20, 0] }, kF: [-1, 1.2, 0] }) }
    ]},

    "das-t": { cam3d: { yaw: -62, pitch: 18 }, trail: ["hN", "hF"], mark: "S", cam: { yaw: -82, pitch: 30 }, frames: [
      { d: .9, hold: .3, p: { P: [0, 8], t: 90, hd: 0, kN: [0, -1, 0], fN: [-84, 3], fF: [-84, 3], hN: { at: "shN", d: [4, 0, 50] }, hF: { at: "shF", d: [4, 0, -50] }, eN: up } },
      { d: .9, hold: 1, p: { P: [0, 8], t: 80, hd: -14, kN: [0, -1, 0], fN: [-84, 3], fF: [-84, 3], hN: { at: "shN", d: [-26, 0, 44] }, hF: { at: "shF", d: [-26, 0, -44] }, eN: up } }
    ]},

    "mountain-climber": { trail: ["kN", "kF"], cam3d: { yaw: -12, pitch: 12 }, cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .3, hold: .3, p: plank() },
      { d: .5, hold: 0, p: plank({ P: [-2, 41.5], t: 108, fN: [-48, 24], kN: [1, -.6, 0], tuck: [.3, 1] }) },
      { d: .5, hold: .5, p: plank({ P: [-3, 44], t: 106, fN: [-14, 19], kN: [1, -.3, 0], tuck: [0, 1] }) },
      { d: .5, hold: 0, p: plank({ P: [-2, 41.5], t: 108, fN: [-48, 24], kN: [1, -.6, 0], tuck: [.3, 1] }) },
      { d: .5, hold: .3, p: plank() },
      { d: .5, hold: 0, p: plank({ P: [-2, 41.5], t: 108, fF: [-48, 24], kF: [1, -.6, 0], tuck: [1, .3] }) },
      { d: .5, hold: .5, p: plank({ P: [-3, 44], t: 106, fF: [-14, 19], kF: [1, -.3, 0], tuck: [1, 0] }) },
      { d: .5, hold: 0, p: plank({ P: [-2, 41.5], t: 108, fF: [-48, 24], kF: [1, -.6, 0], tuck: [1, .3] }) }
    ]},

    "hueftbeuger": { trail: "P", mark: "hipF", cam: { yaw: -16, pitch: 10 }, frames: [
      { d: 1.4, hold: .6, p: { P: [2, 32], t: 178, fN: [44, 0], fF: [-54, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "hipN", w: [2, 4, 6] }, hF: { at: "hipF", w: [2, 4, -6] }, eN: [-1, 0, .4], eF: [-1, 0, -.4] } },
      { d: 1.6, hold: 1.2, p: { P: [10, 24], t: 176, fN: [44, 0], fF: [-54, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "hipN", w: [2, 4, 6] }, hF: { at: "hipF", w: [2, 4, -6] }, eN: [-1, 0, .4], eF: [-1, 0, -.4] } }
    ]},

    "open-book": { cam3d: { yaw: -15, pitch: 42 }, trail: "hN", cam: { yaw: 58, pitch: 24 }, frames: [
      { d: 1, hold: .6, p: sideLie() },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hd: -20, hN: { at: "S", w: [2, 64, 0] } }) },
      { d: 1.1, hold: 1, p: sideLie({ tw: -85, hd: -40, hN: [52, 14, -46] }) },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hd: -20, hN: { at: "S", w: [2, 64, 0] } }) }
    ]},

    "grosse-kreise": { cam3d: { yaw: -15, pitch: 42 }, trail: "hN", cam: { yaw: 58, pitch: 24 }, frames: [
      { d: .55, hold: 0, p: sideLie({ tw: 0, hN: { at: "S", w: [0, 14, 42] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -13, hN: { at: "S", w: [33, 22, 30] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -45, hN: { at: "S", w: [46, 30, 0] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -77, hN: { at: "S", w: [33, 22, -30] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -90, hN: { at: "S", w: [0, 14, -42] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -77, hN: { at: "S", w: [-33, 22, -30] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -45, hN: { at: "S", w: [-46, 30, 0] } }) },
      { d: .55, hold: 0, p: sideLie({ tw: -13, hN: { at: "S", w: [-33, 22, 30] } }) }
    ]}
  };
})();

/* Beschriftungen pro Bewegungsphase und zusätzliche Blickwinkel */
(function (F) {
  const caps = {
 "fersensitz": [
  "Auf die Fersen setzen, ruhig atmen",
  "Hüfte nach vorn strecken"
 ],
 "sprunggelenk": [
  "Zurück, Ferse bleibt am Boden",
  "Knie über die Zehen schieben"
 ],
 "9090-haende": [
  "Mitte",
  "Knie zu einer Seite ablegen",
  "Mitte",
  "Knie zur anderen Seite ablegen"
 ],
 "9090-frei": [
  "Mitte",
  "Knie zu einer Seite ablegen",
  "Mitte",
  "Knie zur anderen Seite ablegen"
 ],
 "9090-streck": [
  "Mitte",
  "Knie zur Seite ablegen",
  "Hüfte hoch in den Kniestand",
  "Wieder absetzen",
  "Mitte",
  "Knie zur anderen Seite",
  "Hüfte hoch in den Kniestand",
  "Wieder absetzen"
 ],
 "ausfall-rotation": [
  "Beide Hände neben den vorderen Fuß",
  "Innere Hand löst sich",
  "Arm öffnet zur Seite",
  "Arm zur Decke, Blick folgt der Hand",
  "Zurück zur Seite",
  "Hand zurück zum Fuß"
 ],
 "bws": [
  "Schneidersitz, Hände am Kopf",
  "Drehen, Ellbogen nach hinten unten",
  "Mitte",
  "Zur anderen Seite drehen"
 ],
 "situp-drehung": [
  "Ablegen, Arm zur Decke",
  "Hochkommen, oben zur Seite drehen"
 ],
 "vsit-einbeinig": [
  "Ablegen",
  "Bein senkrecht hoch, Hände zum Bein",
  "Ablegen",
  "Anderes Bein"
 ],
 "hollow-rocks": [
  "Körper fest, nach vorn schaukeln",
  "Nach hinten schaukeln"
 ],
 "fahrrad": [
  "Ellbogen zum anderen Knie",
  "Seite wechseln"
 ],
 "knie-anziehen": [
  "Knie zur Brust, Arme vor der Brust",
  "Beine strecken, Füße bleiben in der Luft"
 ],
 "russian-twist": [
  "Hände vor der Brust, zu einer Seite drehen",
  "Zur anderen Seite drehen"
 ],
 "flutter-kicks": [
  "Beine im Wechsel heben",
  "Rücken bleibt am Boden"
 ],
 "schulterklopfen": [
  "Stütz halten",
  "Hand abheben",
  "Hand zur anderen Schulter",
  "Zurück",
  "Stütz halten",
  "Andere Hand abheben",
  "Hand zur anderen Schulter",
  "Zurück"
 ],
 "huefte-einbeinig": [
  "Ablegen",
  "Hüfte hoch, Knie bleibt an der Brust"
 ],
 "das-t": [
  "Arme seitlich ablegen",
  "Arme heben, Daumen nach oben"
 ],
 "mountain-climber": [
  "Stütz",
  "Fuß abheben",
  "Knie langsam zur Brust",
  "Zurück",
  "Stütz",
  "Anderen Fuß abheben",
  "Anderes Knie zur Brust",
  "Zurück"
 ],
 "hueftbeuger": [
  "Aufrecht knien",
  "Hüfte nach vorn sinken lassen"
 ],
 "open-book": [
  "Seitlage, Knie gestapelt, Arme vorn",
  "Oberen Arm nach oben öffnen",
  "Arm und Brust nach hinten öffnen",
  "Langsam zurück"
 ],
 "grosse-kreise": [
  "Arm vorn",
  "Arm vorn",
  "Über den Kopf kreisen",
  "Über den Kopf kreisen",
  "Nach hinten",
  "Nach hinten",
  "Am Körper vorbei nach vorn",
  "Am Körper vorbei nach vorn"
 ]
};
  const views = {"open-book": [{"yaw": -90, "pitch": 24, "label": "Vom Kopf aus"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "grosse-kreise": [{"yaw": -90, "pitch": 24, "label": "Vom Kopf aus"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "russian-twist": [{"yaw": -40, "pitch": 30, "label": "Schräg"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "fersensitz": [{"yaw": -2, "pitch": 6}], "9090-haende": [{"yaw": -78, "pitch": 26, "label": "Von vorn"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "9090-frei": [{"yaw": -78, "pitch": 26, "label": "Von vorn"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "9090-streck": [{"yaw": -78, "pitch": 24, "label": "Von vorn"}, {"yaw": -2, "pitch": 6, "label": "Von der Seite"}], "das-t": [{"yaw": -90, "pitch": 36, "label": "Vom Kopf aus"}, {"yaw": -2, "pitch": 6, "label": "Von der Seite"}], "bws": [{"yaw": -30, "pitch": 18, "label": "Schräg"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}], "situp-drehung": [{"yaw": -28, "pitch": 18, "label": "Schräg"}, {"yaw": 0, "pitch": 86, "label": "Von oben"}]};
  Object.keys(caps).forEach(k => F[k] && F[k].frames.forEach((f, i) => { if (caps[k][i]) f.cap = caps[k][i]; }));
  Object.keys(views).forEach(k => { if (F[k]) F[k].views = views[k]; });
})(window.FIGS);

/* Natürlichere Haltung: Rundrücken bei Bauchübungen, Blick folgt der Hand bei Drehungen */
(function (F) {
  const set = (k, fn) => F[k] && F[k].frames.forEach((fr, i) => fn(fr.p, i));
  set("situp-drehung", (p, i) => { p.curl = i === 1 ? 7 : 3; });
  set("vsit-einbeinig", (p, i) => { p.curl = i % 2 ? 11 : 1; });
  set("hollow-rocks", p => { p.curl = 9; });
  set("fahrrad", p => { p.curl = 9; });
  set("knie-anziehen", (p, i) => { p.curl = i === 0 ? 8 : 5; });
  set("russian-twist", p => { p.curl = 6; });
  set("flutter-kicks", p => { p.curl = 2; });
  set("mountain-climber", (p, i) => { p.curl = [1, 3, 5, 3, 1, 3, 5, 3][i]; });
  set("fersensitz", (p, i) => { p.curl = i === 0 ? 3 : -2; });
  set("das-t", (p, i) => { p.curl = i === 1 ? -6 : 0; });
  set("ausfall-rotation", (p, i) => { if (i > 0) p.look = "hN"; });
  set("open-book", (p, i) => { p.look = "hN"; });
  set("grosse-kreise", p => { p.look = "hN"; });
  set("situp-drehung", (p, i) => { if (i === 0) p.look = "hN"; });
})(window.FIGS);
