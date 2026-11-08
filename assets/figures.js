/* Bibliothek der Übungsfiguren. Schlüssel werden in den Einheiten als  fig: "<schlüssel>"  verwendet.
 * Format siehe assets/figure.js.
 */
window.FIGS = (function () {
  const up = [0, 1, 0], fwd = [1, 0, 0], back = [-1, 0, 0];

  /* gemeinsame Ausgangsposen */
  const tallKneel = (o = {}) => Object.assign({ P: [2, 45], t: 180, fN: [-36, 3], fF: [-36, 3], kN: [1, -.3, 0] }, o);
  const supine = (o = {}) => Object.assign({ P: [0, 9], t: -90 }, o);
  const plank = (o = {}) => Object.assign({ P: [0, 32], t: 112, hd: 8, hN: [50, 0], hF: [50, 0], fN: [-70, 0], fF: [-70, 0], kN: [1, -.6, 0] }, o);
  const lunge = (o = {}) => Object.assign({ P: [0, 24], t: 116, fN: [42, 0], fF: [-58, 2], kN: [1, .3, 0], kF: [1, -1, 0] }, o);
  const sideLie = (o = {}) => Object.assign({ P: [0, 17], t: 90, roll: -90, hd: 0,
    fN: [-38, 14, 40], fF: [-38, 3, 40], kN: [0, 0, 1], hN: [52, 8, 46], hF: [52, 2, 46], eN: [0, 0, 1], eF: [0, 0, 1] }, o);

  return {
    fersensitz: { trail: "P", mark: "lowback", cam: { yaw: -26, pitch: 12 }, frames: [
      { d: 1.1, hold: 2.2, p: { P: [-18, 21], t: 172, fN: [-26, 2, 14], fF: [-26, 2, -14], kN: fwd } },
      { d: 1.2, hold: .8, p: { P: [14, 46], t: 180, fN: [-26, 2, 14], fF: [-26, 2, -14], kN: [1, -1, 0] } }
    ]},

    sprunggelenk: { trail: "kN", mark: "fN", cam: { yaw: -16, pitch: 10 }, frames: [
      { d: 1, hold: .5, p: { P: [0, 44], t: 180, fN: [36, 0], fF: [-40, 3], kN: [1, .2, 0], kF: [.3, -1, 0], hN: { at: "S", w: [24, -50, 10] }, hF: { at: "S", w: [24, -50, 2] } } },
      { d: 1.2, hold: .9, p: { P: [22, 42], t: 174, fN: [36, 0], fF: [-40, 3], kN: [1, .1, 0], kF: [.3, -1, 0], hN: { at: "S", w: [26, -48, 10] }, hF: { at: "S", w: [26, -48, 2] } } }
    ]},

    "9090-haende": { trail: ["kN", "kF"], cam: { yaw: -78, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 194, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "9090-frei": { trail: ["kN", "kF"], cam: { yaw: -78, pitch: 26 }, frames: [
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: 6, hN: { at: "shN", d: [46, -8, 0] }, hF: { at: "shF", d: [46, -8, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11], t: 180, hN: { at: "shN", d: [46, -8, 0] }, hF: { at: "shF", d: [46, -8, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, 1, 0] } },
      { d: 1.0, hold: .5, p: { P: [0, 11], t: 180, lat: -6, hN: { at: "shN", d: [46, -8, 0] }, hF: { at: "shF", d: [46, -8, 0] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "9090-streck": { trail: ["P"], mark: "P", cam: { yaw: -78, pitch: 24 }, frames: [
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.2, hold: .8, p: { P: [6, 36, 16], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.6, 1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, 1] } },
      { d: 1.0, hold: .4, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } },
      { d: 1.2, hold: .8, p: { P: [6, 36, -16], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.6, -1] } },
      { d: 1.0, hold: .2, p: { P: [0, 11, 0], t: 180, hN: { at: "S", d: [16, -18, 4] }, hF: { at: "S", d: [16, -18, -4] }, fN: [32, 0, 26], fF: [32, 0, -26], kN: [0, -.7, -1] } }
    ]},

    "ausfall-rotation": { cam: { yaw: -14, pitch: 14 }, frames: [
      { d: 1, hold: .5, p: lunge({ hN: [36, 0, 0], hF: [36, 0, -14] }) },
      { d: 1.3, hold: .9, p: lunge({ tw: -75, hd: -28, hN: { at: "shN", w: [-4, 50, 8] }, hF: [36, 0, -14] }) }
    ]},

    bws: { trail: ["eN", "eF"], cam: { yaw: -30, pitch: 18 }, frames: [
      { d: 1, hold: .3, p: tallKneel({ hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1.3, hold: .7, p: tallKneel({ tw: 55, lat: -18, t: 172, hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1, hold: .3, p: tallKneel({ hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: 1.3, hold: .7, p: tallKneel({ tw: -55, lat: 18, t: 172, hN: { at: "head", d: [-6, 0, 11] }, hF: { at: "head", d: [-6, 0, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) }
    ]},

    "situp-drehung": { cam: { yaw: -28, pitch: 18 }, frames: [
      { d: 1, hold: .3, p: supine({ fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: [-4, 2, -18] }) },
      { d: 1.1, hold: .5, p: supine({ t: -205, tw: -60, fN: [32, 0], fF: [32, 0], kN: up, hN: { at: "shN", w: [0, 50, 0] }, hF: { at: "S", w: [24, -24, -8] } }) }
    ]},

    "vsit-einbeinig": { trail: [], cam: { yaw: -30, pitch: 18 }, frames: [
      { d: .9, hold: .4, p: supine({ fN: [80, 4], fF: [80, 4], hN: [2, 2, 18], hF: [0, 2, -18] }) },
      { d: 1, hold: .6, p: supine({ t: -140, hd: 18, fN: [44, 72], fF: [80, 4], hN: [38, 58, 13], hF: [38, 58, 6], eN: [0, -1, 0] }) },
      { d: .9, hold: .4, p: supine({ fN: [80, 4], fF: [80, 4], hN: [2, 2, 18], hF: [0, 2, -18] }) },
      { d: 1, hold: .6, p: supine({ t: -140, hd: 18, fN: [80, 4], fF: [44, 72], hN: [38, 58, -6], hF: [38, 58, -13], eN: [0, -1, 0] }) }
    ]},

    "hollow-rocks": { trail: ["fN", "head"], mark: "lowback", cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .8, hold: 0, p: { P: [0, 8], t: -116, hd: 10, fN: [80, 15], fF: [80, 15], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } },
      { d: .8, hold: 0, p: { P: [0, 8], t: -100, hd: 10, fN: [75, 35], fF: [75, 35], hN: { at: "shN", d: [0, 50, 0] }, hF: { at: "shF", d: [0, 50, 0] }, eN: up } }
    ]},

    fahrrad: { trail: ["kN", "kF"], cam: { yaw: -26, pitch: 22 }, frames: [
      { d: .8, hold: .2, p: supine({ t: -114, tw: 42, hd: 14, fN: [16, 32], fF: [74, 18], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) },
      { d: .8, hold: .2, p: supine({ t: -114, tw: -42, hd: 14, fN: [74, 18], fF: [16, 32], kN: up, hN: { at: "head", d: [-4, -2, 11] }, hF: { at: "head", d: [-4, -2, -11] }, eN: { l: [0, 0, 1] }, eF: { l: [0, 0, -1] } }) }
    ]},

    "knie-anziehen": { cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .9, hold: .2, p: { P: [0, 10], t: 200, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [24, 24], fF: [24, 24], kN: up } },
      { d: .9, hold: .2, p: { P: [0, 10], t: 208, hN: [-30, 1, 18], hF: [-30, 1, -18], fN: [74, 26], fF: [74, 26], kN: up } }
    ]},

    "russian-twist": { trail: ["hN"], cam: { yaw: -40, pitch: 30 }, frames: [
      { d: .9, hold: .3, p: { P: [0, 10], t: 216, tw: 55, fN: [34, 4], fF: [34, 4], kN: up, hN: [12, 8, 30], hF: [12, 8, 26] } },
      { d: .9, hold: .3, p: { P: [0, 10], t: 216, tw: -55, fN: [34, 4], fF: [34, 4], kN: up, hN: [12, 8, -26], hF: [12, 8, -30] } }
    ]},

    "flutter-kicks": { trail: [], mark: "lowback", cam: { yaw: -24, pitch: 14 }, frames: [
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [76, 26], fF: [79, 8] }) },
      { d: .45, hold: 0, p: supine({ P: [0, 8], hN: [6, 2, 12], hF: [6, 2, -12], fN: [79, 8], fF: [76, 26] }) }
    ]},

    schulterklopfen: { trail: [], mark: "P", cam: { yaw: -40, pitch: 22 }, frames: [
      { d: .7, hold: .3, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18] }) },
      { d: .7, hold: .5, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18], hN: { at: "shF", d: [-7, -3, 0] }, eN: { l: [-.6, -1, .3] } }) },
      { d: .7, hold: .3, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18] }) },
      { d: .7, hold: .5, p: plank({ fN: [-70, 0, 18], fF: [-70, 0, -18], hF: { at: "shN", d: [-7, -3, 0] }, eF: { l: [-.6, -1, -.3] } }) }
    ]},

    "huefte-einbeinig": { trail: [], mark: "P", cam: { yaw: -26, pitch: 16 }, frames: [
      { d: .9, hold: .5, p: supine({ P: [0, 8], hN: [2, 2, 16], hF: [0, 2, -16], fN: [26, 0], kN: up, fF: { at: "hipF", w: [16, 20, 0] }, kF: [-1, 1.2, 0] }) },
      { d: 1, hold: 1, p: supine({ P: [0, 33], t: -62, hd: -14, hN: [-4, 2, 16], hF: [-6, 2, -16], eN: up, fN: [26, 0], kN: up, fF: { at: "hipF", w: [16, 20, 0] }, kF: [-1, 1.2, 0] }) }
    ]},

    "das-t": { trail: ["hN", "hF"], mark: "S", cam: { yaw: -82, pitch: 30 }, frames: [
      { d: .9, hold: .3, p: { P: [0, 8], t: 90, hd: 0, fN: [-80, 3], fF: [-80, 3], hN: { at: "shN", d: [4, 0, 50] }, hF: { at: "shF", d: [4, 0, -50] }, eN: up } },
      { d: .9, hold: 1, p: { P: [0, 8], t: 80, hd: -14, fN: [-80, 3], fF: [-80, 3], hN: { at: "shN", d: [-26, 0, 44] }, hF: { at: "shF", d: [-26, 0, -44] }, eN: up } }
    ]},

    "mountain-climber": { trail: ["kN", "kF"], cam: { yaw: -26, pitch: 14 }, frames: [
      { d: .3, hold: .2, p: plank() },
      { d: .9, hold: .4, p: plank({ P: [-3, 33], t: 110, fN: [-14, 18] }) },
      { d: .9, hold: .2, p: plank() },
      { d: .9, hold: .4, p: plank({ P: [-3, 33], t: 110, fF: [-14, 18], kF: [1, -.6, 0] }) }
    ]},

    "hueftbeuger": { trail: "P", mark: "hipF", cam: { yaw: -16, pitch: 10 }, frames: [
      { d: 1.4, hold: .6, p: { P: [2, 30], t: 178, fN: [42, 0], fF: [-52, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "hipN", w: [2, 4, 6] }, hF: { at: "hipF", w: [2, 4, -6] }, eN: [-1, 0, .4], eF: [-1, 0, -.4] } },
      { d: 1.6, hold: 1.2, p: { P: [10, 22], t: 176, fN: [42, 0], fF: [-52, 2], kN: [1, .3, 0], kF: [1, -1, 0], hN: { at: "hipN", w: [2, 4, 6] }, hF: { at: "hipF", w: [2, 4, -6] }, eN: [-1, 0, .4], eF: [-1, 0, -.4] } }
    ]},

    "open-book": { trail: "hN", cam: { yaw: 58, pitch: 24 }, frames: [
      { d: 1, hold: .6, p: sideLie() },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hd: -20, hN: { at: "S", w: [2, 64, 0] } }) },
      { d: 1.1, hold: 1, p: sideLie({ tw: -85, hd: -40, hN: [52, 14, -46] }) },
      { d: 1.1, hold: 0, p: sideLie({ tw: -45, hd: -20, hN: { at: "S", w: [2, 64, 0] } }) }
    ]},

    "grosse-kreise": { trail: "hN", cam: { yaw: 58, pitch: 24 }, frames: [
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
  "Knie zur Seite ablegen",
  "Hüfte hoch in den Kniestand",
  "Wieder absetzen",
  "Knie zur anderen Seite",
  "Hüfte hoch in den Kniestand",
  "Wieder absetzen"
 ],
 "ausfall-rotation": [
  "Beide Hände neben den vorderen Fuß",
  "Inneren Arm zur Decke aufdrehen"
 ],
 "bws": [
  "Mitte",
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
  "Bein hoch, Hände zum Bein",
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
  "Knie zur Brust",
  "Beine strecken"
 ],
 "russian-twist": [
  "Zu einer Seite drehen",
  "Zur anderen Seite drehen"
 ],
 "flutter-kicks": [
  "Beine im Wechsel heben",
  "Rücken bleibt am Boden"
 ],
 "schulterklopfen": [
  "Stütz halten",
  "Hand zur anderen Schulter",
  "Stütz halten",
  "Andere Hand"
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
  "Knie langsam zur Brust",
  "Stütz",
  "Anderes Knie"
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
