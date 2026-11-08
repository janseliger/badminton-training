/* Bibliothek der Übungsfiguren. Schlüssel werden in den Einheiten als  fig: "<schlüssel>"  verwendet.
 * Format siehe assets/figure.js.
 */
window.FIGS = (function () {
  const up = [0, 1, 0], fwd = [1, 0, 0], back = [-1, 0, 0];

  /* gemeinsame Ausgangsposen */
  const tallKneel = (o = {}) => Object.assign({ P: [2, 45], t: 180, fN: [-36, 3], fF: [-36, 3], kN: [1, -.3, 0] }, o);
  const supine = (o = {}) => Object.assign({ P: [0, 9], t: -90 }, o);
  const plank = (o = {}) => Object.assign({ P: [0, 40], t: 101, hd: 8, hN: [50, 0], hF: [50, 0], fN: [-70, 0], fF: [-70, 0], kN: [1, -.6, 0] }, o);
  const lunge = (o = {}) => Object.assign({ P: [0, 26], t: 122, fN: [42, 0], fF: [-58, 2], kN: [1, .3, 0], kF: [1, -1, 0] }, o);
  const sideLie = (o = {}) => Object.assign({ P: [0, 17], t: 90, roll: -90, hd: 0,
    fN: [-38, 14, 40], fF: [-38, 3, 40], kN: [0, 0, 1], hN: [52, 8, 46], hF: [52, 2, 46], eN: [0, 0, 1], eF: [0, 0, 1] }, o);

  return {
    fersensitz: { mark: "lowback", cam: { yaw: -30, pitch: 12 }, frames: [
      { d: 1, hold: 2.2, p: { P: [-16, 24], t: 180, fN: [-24, 2], fF: [-24, 2], kN: fwd, hN: [12, 30], hF: [12, 30] } },
      { d: 1.1, hold: .7, p: { P: [12, 45], t: 180, fN: [-24, 2], fF: [-24, 2], kN: fwd } }
    ]},

    sprunggelenk: { mark: "fN", cam: { yaw: -32, pitch: 12 }, frames: [
      { d: 1, hold: .5, p: { P: [0, 47], t: 180, fN: [36, 0], fF: [-38, 3], kN: [1, .2, 0], kF: [1, -1, 0], hN: { at: "S", w: [24, -50, 10] }, hF: { at: "S", w: [24, -50, 2] } } },
      { d: 1.2, hold: .9, p: { P: [17, 45], t: 176, fN: [36, 0], fF: [-38, 3], kN: [1, .1, 0], kF: [1, -1, 0], hN: { at: "S", w: [26, -48, 10] }, hF: { at: "S", w: [26, -48, 2] } } }
    ]},

    "9090-haende": { cam: { yaw: -42, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, -1] } }
    ]},

    "9090-frei": { cam: { yaw: -42, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: 6, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: -6, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, -1] } }
    ]},

    "9090-streck": { mark: "P", cam: { yaw: -42, pitch: 22 }, frames: [
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, 1] } },
      { d: 1.2, hold: .8, p: { P: [6, 36, 16], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.6, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, 1] } },
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, -1] } },
      { d: 1.2, hold: .8, p: { P: [6, 36, -16], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.6, -1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.2, -1] } }
    ]},

    "ausfall-rotation": { cam: { yaw: -26, pitch: 16 }, frames: [
      { d: 1, hold: .5, p: lunge({ hN: [36, 0, 0], hF: [36, 0, -14] }) },
      { d: 1.3, hold: .9, p: lunge({ tw: -80, hd: -10, hN: { at: "shN", d: [0, 0, 50] }, hF: [36, 0, -14] }) }
    ]},

    bws: { cam: { yaw: -30, pitch: 18 }, frames: [
      { d: 1, hold: .3, p: tallKneel({ hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1.3, hold: .7, p: tallKneel({ tw: 70, lat: -22, t: 172, hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1, hold: .3, p: tallKneel({ hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1.3, hold: .7, p: tallKneel({ tw: -70, lat: 22, t: 172, hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) }
    ]},

    "situp-drehung": { cam: { yaw: -28, pitch: 18 }, frames: [
      { d: 1, hold: .3, p: supine({ fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: [-4, 2, -18] }) },
      { d: 1.1, hold: .5, p: supine({ t: -205, tw: -35, fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: { at: "S", w: [24, -24, -8] } }) }
    ]},

    "vsit-einbeinig": { cam: { yaw: -26, pitch: 16 }, frames: [
      { d: .9, hold: .3, p: supine({ fN: [80, 4], fF: [80, 4], hN: [-96, 6, 16], hF: [-96, 6, -16], eN: up }) },
      { d: .9, hold: .3, p: supine({ t: -138, hd: 15, fN: [40, 72], fF: [80, 4], hN: [34, 58, 10], hF: [34, 58, 2], eN: [0, -1, 0] }) },
      { d: .9, hold: .3, p: supine({ fN: [80, 4], fF: [80, 4], hN: [-96, 6, 16], hF: [-96, 6, -16], eN: up }) },
      { d: .9, hold: .3, p: supine({ t: -138, hd: 15, fN: [80, 4], fF: [40, 72], hN: [34, 58, -2], hF: [34, 58, -10], eN: [0, -1, 0] }) }
    ]},

    "hollow-rocks": { mark: "lowback", cam: { yaw: -24, pitch: 14 }, frames: [
      { d: .8, hold: 0, p: { P: [0, 8], t: -112, hd: 12, fN: [76, 12], fF: [76, 12], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } },
      { d: .8, hold: 0, p: { P: [0, 8], t: -97, hd: 12, fN: [72, 32], fF: [72, 32], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } }
    ]},

    fahrrad: { cam: { yaw: -26, pitch: 22 }, frames: [
      { d: .8, hold: .2, p: supine({ t: -128, tw: 30, hd: 10, fN: [16, 32], fF: [74, 18], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: .8, hold: .2, p: supine({ t: -128, tw: -30, hd: 10, fN: [74, 18], fF: [16, 32], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) }
    ]},

    "knie-anziehen": { cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .9, hold: .2, p: { P: [0, 10], t: 200, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [24, 24], fF: [24, 24], kN: up } },
      { d: .9, hold: .2, p: { P: [0, 10], t: 208, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [74, 26], fF: [74, 26], kN: up } }
    ]},

    "russian-twist": { cam: { yaw: -30, pitch: 34 }, frames: [
      { d: .9, hold: .2, p: { P: [0, 10], t: 212, tw: 38, fN: [34, 3], fF: [34, 3], kN: up, hN: [26, 46, 26], hF: [26, 46, 20] } },
      { d: .9, hold: .2, p: { P: [0, 10], t: 212, tw: -38, fN: [34, 3], fF: [34, 3], kN: up, hN: [26, 46, -20], hF: [26, 46, -26] } }
    ]},

    "flutter-kicks": { mark: "lowback", cam: { yaw: -24, pitch: 14 }, frames: [
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [76, 26], fF: [79, 8] }) },
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [79, 8], fF: [76, 26] }) }
    ]},

    schulterklopfen: { mark: "P", cam: { yaw: -28, pitch: 16 }, frames: [
      { d: .7, hold: .3, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18] }) },
      { d: .7, hold: .4, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18], hN: { at: "shF", d: [6, 0, 0] }, eN: { l: [-1, 0, .3] } }) },
      { d: .7, hold: .3, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18] }) },
      { d: .7, hold: .4, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18], hF: { at: "shN", d: [6, 0, 0] }, eF: { l: [-1, 0, -.3] } }) }
    ]},

    "huefte-einbeinig": { mark: "P", cam: { yaw: -26, pitch: 16 }, frames: [
      { d: .9, hold: .5, p: supine({ P: [0, 8], hN: [2, 2, 16], hF: [0, 2, -16], fN: [26, 0], kN: up, fF: [6, 36], kF: [-.3, 1, 0] }) },
      { d: 1, hold: 1, p: supine({ P: [0, 33], t: -62, hd: -14, hN: [-4, 2, 16], hF: [-6, 2, -16], eN: up, fN: [26, 0], kN: up, fF: [6, 62], kF: [-.3, 1, 0] }) }
    ]},

    "das-t": { mark: "S", cam: { yaw: -34, pitch: 46 }, frames: [
      { d: .9, hold: .3, p: { P: [0, 8], t: 90, hd: 0, fN: [-80, 3], fF: [-80, 3], hN: { at: "shN", d: [4, 0, 50] }, hF: { at: "shF", d: [4, 0, -50] }, eN: up } },
      { d: .9, hold: 1, p: { P: [0, 8], t: 86, hd: -8, fN: [-80, 3], fF: [-80, 3], hN: { at: "shN", d: [-14, 0, 48] }, hF: { at: "shF", d: [-14, 0, -48] }, eN: up } }
    ]},

    "mountain-climber": { cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .3, hold: .2, p: plank() },
      { d: .9, hold: .4, p: plank({ P: [-3, 42], t: 100, fN: [-12, 20] }) },
      { d: .9, hold: .2, p: plank() },
      { d: .9, hold: .4, p: plank({ P: [-3, 42], t: 100, fF: [-12, 20], kF: [1, -.6, 0] }) }
    ]},

    "hueftbeuger": { mark: "hipF", cam: { yaw: -28, pitch: 12 }, frames: [
      { d: 1.4, hold: .6, p: { P: [2, 30], t: 178, fN: [42, 0], fF: [-52, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "S", w: [30, -46, 10] }, hF: { at: "S", w: [30, -46, 2] } } },
      { d: 1.6, hold: 1.2, p: { P: [10, 22], t: 176, fN: [42, 0], fF: [-52, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "S", w: [32, -38, 10] }, hF: { at: "S", w: [32, -38, 2] } } }
    ]},

    "open-book": { cam: { yaw: -18, pitch: 36 }, frames: [
      { d: 1, hold: .5, p: sideLie() },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hN: { at: "S", w: [4, 52, 0] } }) },
      { d: 1.1, hold: .8, p: sideLie({ tw: -85, hN: [52, 12, -46] }) },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hN: { at: "S", w: [4, 52, 0] } }) }
    ]},

    "grosse-kreise": { cam: { yaw: -18, pitch: 40 }, frames: [
      { d: .9, hold: .2, p: sideLie() },
      { d: 1, hold: 0, p: sideLie({ tw: -20, hN: { at: "S", w: [50, 26, 10] } }) },
      { d: 1, hold: 0, p: sideLie({ tw: -70, hN: { at: "S", w: [10, 30, -44] } }) },
      { d: 1, hold: 0, p: sideLie({ tw: -60, hN: { at: "S", w: [-46, 14, -30] } }) },
      { d: 1, hold: 0, p: sideLie({ tw: -15, hN: { at: "S", w: [-40, 14, 30] } }) }
    ]}
  };
})();
