/* Einheit: Core & Beweglichkeit (Erwachsene, ca. 30 Min., nur Körpergewicht)
 * Übungen aus Videos von Tobias Wadenka und Badminton Insight.
 * v: { k: Video-Kürzel aus "videos", t: Start in Sekunden, e: Ende in Sekunden }
 * sw: nach so vielen Sekunden "Seite wechseln"
 * fig: Schlüssel der animierten Figur aus assets/figures.js
 */
WORKOUT({
  id: "core-beweglichkeit",
  title: "Core & Beweglichkeit",
  subtitle: "Erwachsene · nur Körpergewicht · eine Matte pro Person",
  videos: {
    MOB:  { id: "2HYgg0_Le7k", name: "Wadenka · Mobility Routine" },
    CORE: { id: "YTBr32DfgU8", name: "Wadenka · Core Stability" },
    LEG:  { id: "683L5zMYuiQ", name: "Wadenka · Legs & Core" },
    UP:   { id: "xfXq_B5dQ5U", name: "Wadenka · Upper Body" },
    BI:   { id: "wp2G1J0K4YU", name: "Badminton Insight · Core Circuit" }
  },
  parts: [
    { name: "Mobilisation", prep: 15, steps: [
      { n: "Ankommen im Fersensitz", fig: "fersensitz", work: 60, dose: "6 Atemzüge, dann 3 Hüftstreckungen", v: { k: "MOB", t: 22, e: 40 },
        how: "Auf die Fersen setzen, Hände auf die Oberschenkel. Durch die Nase in Bauch und Flanken einatmen, lang ausatmen. Zum Schluss dreimal langsam die Hüfte nach vorn strecken und zurück in den Fersensitz.",
        focus: "Ausatmen länger als einatmen. Das ist die Grundspannung für den Core-Teil." },
      { n: "Sprunggelenk im Kniestand", fig: "sprunggelenk", work: 80, dose: "3× je Seite nach vorn, 3× je Seite zur Seite", v: { k: "MOB", t: 28, e: 133 },
        how: "Aus dem Fersensitz einen Fuß vorn aufstellen, kleiner Ausfallschritt. Das Knie so weit wie möglich über die Zehen nach vorn schieben, zurück in den Fersensitz, Seite wechseln. Danach dasselbe mit dem Fuß zur Seite gestellt.",
        focus: "Ferse bleibt unten. Das ist die Beweglichkeit für den Ausfallschritt am Netz." },
      { n: "90/90-Hüftwechsel mit Händen", fig: "9090-haende", work: 45, dose: "6 Wechsel", v: { k: "MOB", t: 135, e: 180 },
        how: "Sitzen, Hände hinten aufstützen, Füße weit auseinander. Beide Knie zur einen Seite ablegen (neben den Fuß, nicht auf ihn), aufrichten, zur anderen Seite ablegen.",
        focus: "Brust raus, aufrecht bleiben." },
      { n: "90/90 ohne Hände", fig: "9090-frei", work: 45, dose: "6 Wechsel", v: { k: "MOB", t: 180, e: 233 },
        how: "Dieselbe Bewegung, die Hände lösen sich vom Boden.",
        focus: "Fersen bleiben am Platz. Rücken beim Wechsel nicht rund machen.", light: "Eine Hand hinten aufstützen." },
      { n: "90/90 mit Hüftstreckung", fig: "9090-streck", work: 60, dose: "4× je Seite", v: { k: "MOB", t: 233, e: 291 },
        how: "In jeder 90/90-Position aus der Hüfte hoch in den Kniestand drücken, wieder absenken, Seite wechseln.",
        focus: "Langsam hoch, langsam runter, aufrecht bleiben." },
      { n: "Tiefer Ausfallschritt mit Rotation", fig: "ausfall-rotation", work: 120, sw: 60, dose: "je Seite: 30 Sek. sinken, dann 6 Rotationen", v: { k: "MOB", t: 291, e: 432 },
        how: "Großer Ausfallschritt, vorderer Fuß vor dem Knie, hinten auf den Zehen. Mit jedem Ausatmen etwas tiefer sinken. Dann beide Hände auf den Boden und den inneren Arm (Seite des vorderen Beins) zur Decke drehen, zurück.",
        focus: "Blick folgt der Hand.", light: "Hinteres Knie ablegen. Die Ellbogen müssen nicht bis zum Boden." },
      { n: "Brustwirbelsäule im Schneidersitz", fig: "bws", work: 80, dose: "3 Durchgänge je Seite", v: { k: "MOB", t: 435, e: 540 },
        how: "Im Schneidersitz die Hände an den Kopf. So weit wie möglich zu einer Seite drehen, den hinteren Ellbogen Richtung Boden führen, hoch. Dreimal hintereinander, jedes Mal etwas weiter drehen, dann Seite wechseln.",
        focus: "Aufrecht bleiben, Brust raus. Diese Drehung braucht man im Hinterfeld und für den Überkopfball in der Rückhandecke." }
    ]},
    { name: "Core-Circuit", prep: 15, work: 25, rounds: 2, roundRest: 120, workLabel: "Sek. max.", steps: [
      { n: "Sit-up mit Drehung", fig: "situp-drehung", dose: "6 Wdh.", v: { k: "BI", t: 50, e: 84 },
        how: "Rückenlage, Knie aufgestellt, Schlägerarm zur Decke. Hochkommen und oben zur Seite drehen, langsam ablegen.",
        focus: "Nur so weit hoch, wie es geht.", light: "Nur bis die Schulterblätter abheben." },
      { n: "Einbeinige V-Sits", fig: "vsit-einbeinig", dose: "6 Wdh.", v: { k: "BI", t: 86, e: 116 },
        how: "Rückenlage, Beine gestreckt. Ein gestrecktes Bein senkrecht hochheben und gleichzeitig mit dem Oberkörper hochkommen, mit beiden Händen zum Bein greifen, ablegen, anderes Bein.",
        focus: "Bein so gestreckt wie möglich, muss aber nicht ganz.", light: "Knie leicht gebeugt." },
      { n: "Hollow Rocks", fig: "hollow-rocks", dose: "6 Wdh.", v: { k: "BI", t: 117, e: 142 },
        how: "Rückenlage, Arme gestreckt über dem Kopf, Füße knapp über dem Boden, Körper wie eine flache Schale. In dieser Spannung vor und zurück schaukeln.",
        focus: "Die schwerste Übung im Circuit. Unterer Rücken bleibt am Boden.", light: "Hollow Hold: Knie gebeugt, Arme neben dem Körper, nur halten." },
      { n: "Fahrrad", fig: "fahrrad", dose: "6 Wdh.", v: { k: "BI", t: 144, e: 177 },
        how: "Knie und Füße vom Boden, Hände am Kopf, leicht zurücklehnen. Rechten Ellbogen zum linken Knie, dann linken Ellbogen zum rechten Knie.",
        focus: "Nicht am Kopf ziehen.", light: "Langsam, Füße höher." },
      { n: "Knie anziehen im Sitz", fig: "knie-anziehen", dose: "8 Wdh.", v: { k: "BI", t: 179, e: 206 },
        how: "Sitzen, leicht zurückgelehnt, Arme vor der Brust gekreuzt, Füße vom Boden. Beine nach vorn strecken, Knie wieder zur Brust ziehen.",
        focus: "Rücken bleibt gerade.", light: "Hände hinten aufstützen." },
      { n: "Russian Twist", fig: "russian-twist", dose: "10 Wdh.", v: { k: "BI", t: 208, e: 238 },
        how: "Sitzen, Knie angewinkelt, Oberkörper deutlich zurückgelehnt, Hände vor der Brust zusammen. Langsam den Oberkörper von Seite zu Seite drehen.",
        focus: "Langsam. Die schrägen Bauchmuskeln arbeiten.", light: "Füße bleiben am Boden." },
      { n: "Flutter Kicks", fig: "flutter-kicks", dose: "10 Wdh. (= 20 Kicks)", v: { k: "BI", t: 240, e: 272 },
        how: "Rückenlage, Rücken in den Boden drücken. Die gestreckten Beine im Wechsel kurz anheben.",
        focus: "Rücken flach auf den Boden drücken.", light: "Hände unter das Gesäß, Beine höher halten." }
    ]},
    { name: "Stabilität im Stütz", prep: 30, work: 30, steps: [
      { n: "Stütz mit Schulterklopfen", fig: "schulterklopfen", dose: "30 Sek.", v: { k: "LEG", t: 224, e: 272 },
        how: "Liegestützposition. Abwechselnd mit einer Hand die gegenüberliegende Schulter antippen.",
        focus: "Hüfte bleibt ruhig und dreht nicht mit.", light: "Auf den Knien." },
      { n: "Einbeinige Hüftbrücke", fig: "huefte-einbeinig", dose: "15 Sek. je Seite", sw: 15, v: { k: "LEG", t: 158, e: 216 },
        how: "Rückenlage, ein Fuß aufgestellt, das andere Bein gestreckt zur Decke. Über die Ferse des aufgestellten Fußes die Hüfte hochdrücken, bis Knie, Hüfte und Schulter in einer Linie sind, langsam ablegen.",
        focus: "Oben halten, langsam ab.", light: "Beidbeinig." },
      { n: "Das T", fig: "das-t", dose: "30 Sek.", v: { k: "UP", t: 160, e: 205 },
        how: "Bauchlage, Arme zur Seite ausgestreckt, Daumen zeigen nach oben. Die Schulterblätter zusammenziehen und die Arme anheben.",
        focus: "Daumen bleibt oben, Arme gestreckt.", light: "Arme nur kurz anheben und ablegen." },
      { n: "Langsame Mountain Climbers", fig: "mountain-climber", dose: "30 Sek.", v: { k: "CORE", t: 418, e: 462 },
        how: "Liegestützposition. Abwechselnd ein Knie langsam Richtung Brust ziehen.",
        focus: "Hände direkt unter den Schultern, Hüfte bleibt unten.", light: "Hände erhöht auf Bank oder Kasten." }
    ]},
    { name: "Cool-down", prep: 15, steps: [
      { n: "Hüftbeuger im tiefen Ausfallschritt", fig: "hueftbeuger", work: 60, sw: 30, dose: "30 Sek. je Seite", v: { k: "MOB", t: 291, e: 432 },
        how: "Tiefer Ausfallschritt, das hintere Knie darf am Boden liegen. Mit jedem Ausatmen etwas tiefer sinken.",
        focus: "Ruhig atmen." },
      { n: "Open Book", fig: "open-book", work: 90, sw: 45, dose: "6× je Seite", v: { k: "MOB", t: 540, e: 606 },
        how: "Seitlage, Hüfte und Knie je 90° gebeugt, Knie liegen übereinander, Hände aufeinander. Den oberen Arm zur anderen Seite öffnen, so weit es geht, und wieder schließen.",
        focus: "Knie bleiben übereinander. Ein Handtuch unter dem Kopf hilft." },
      { n: "Große Kreise", fig: "grosse-kreise", work: 80, sw: 40, dose: "3× je Seite", v: { k: "MOB", t: 606, e: 660 },
        how: "Aus derselben Seitlage mit den Fingerspitzen einen großen Kreis über den Kopf zur anderen Seite und zurück ziehen.",
        focus: "Knie bleiben übereinander, langsam." }
    ]}
  ]
});
