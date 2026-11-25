# Realistische Übungsvideos per KI

Die 3D-Figur bleibt die Grundlage, weil dort die Bewegung stimmt. Die KI macht daraus nur
eine echte Person. So erfindet sie keine falsche Technik.

## Ablauf je Übung

1. **Vorlage**: Aus der Animation werden ein Bewegungsclip (`ref_<übung>.mp4`) und ein Startbild
   (`start_<übung>.png`) erzeugt (feste Kamera, ganzer Körper, ohne Markierungen).
2. **Startbild realistisch machen** (Bild-KI, z. B. Gemini oder die Bildfunktion von Kling).
   Startbild hochladen und diesen Prompt verwenden:

   > Mach aus dieser 3D-Puppe ein fotorealistisches Foto: ein Freizeitsportler, Mann um die 35,
   > normale sportliche Figur, schlichtes dunkelgrünes T-Shirt, schwarze Sporthose, weiße
   > Hallenschuhe, auf einer hellblauen Gymnastikmatte in einer hellen Sporthalle.
   > Genau dieselbe Haltung, dieselben Körperproportionen, derselbe Kamerawinkel und Bildausschnitt.
   > Kein Text, keine Logos.

   Damit es über alle Übungen dieselbe Person bleibt: beim ersten gelungenen Bild ein Porträt
   ausschneiden und bei den weiteren Übungen als zweites Bild mitgeben
   („gleiche Person wie auf dem zweiten Bild“).
3. **Bewegung übertragen** (Kling, Funktion *Motion Control*):
   - Bewegungsvideo: `ref_<übung>.mp4`
   - Figurenbild: das realistische Startbild aus Schritt 2
   - Prompt: „Ruhige, feste Kamera, helle Sporthalle, langsame kontrollierte Bewegung genau wie im
     Referenzvideo.“
   - Erst in der günstigen Standard-Qualität testen.
4. **Prüfen**: Stimmt die Bewegung mit der Animation überein? Keine verformten Hände oder Füße?
   Sonst neu erzeugen oder für diese Übung bei der Animation bleiben.
5. **Einbauen**: Clip als `clips/<übung>.mp4` ins Repo legen und in `assets/clips.js` eintragen.
   Der Timer zeigt dann im Modus „Figur“ den Clip statt der Animation. Übungen ohne Clip
   zeigen weiter die Animation.

## Wenn Motion Control die Puppe nicht erkennt

Kling empfiehlt echte Menschen als Bewegungsvorlage. Klappt es mit der Puppe nicht, gibt es zwei
Auswege:

- reine Text-zu-Video-Erzeugung (z. B. Veo in Gemini) mit Startbild und genauer Beschreibung.
  Das sieht gut aus, ist bei der Technik aber unzuverlässig. Deshalb jeden Clip genau prüfen.
- eine kurze eigene Aufnahme mit dem Handy als Bewegungsvorlage. Die KI macht daraus
  dann die einheitliche Person.

## Stand: so wurden die aktuellen Clips gemacht

Alle 21 Übungen der Einheit „Core & Beweglichkeit“ haben einen Clip in `clips/`.
Erzeugt mit Google Flow (Video-zu-Video): `refclips/ref_<übung>.mp4` hochladen und diesen Prompt nutzen:

> Turn the 3D mannequin into a real human: a fit recreational athlete, man around 35, short brown hair,
> plain dark green t-shirt, black sports shorts, white indoor sports shoes, on a light blue exercise mat
> in a bright, clean sports hall. Keep the movement, timing, body position and camera exactly the same as
> in the original video. Smooth, fluid, continuous motion at natural speed, no stutter, no jumps.
> Photorealistic, natural skin and fabric, no text, no logos.

Ergebnis in 720p laden und für das Repo verkleinern:
`ffmpeg -i in.mp4 -an -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -movflags +faststart clips/<übung>.mp4`

## Stand v5: gleiche Umgebung und flüssige Schleifen

- Die Vorlagen (`refclips/ref_<übung>-v5.mp4`) zeigen die Figur auf einer Matte auf einem Badmintonfeld
  (Holzboden, weiße Linien, helle Wände). So erzeugt die KI für alle Übungen dieselbe Halle.
- Prompt dazu: „… He is on a light blue exercise mat lying on a badminton court in a bright indoor sports hall:
  light wooden hall floor with white badminton court lines, light grey walls. Keep the movement, timing, body
  position, mat, court lines and camera exactly the same …“
- Danach macht `tools/loopfix.py` aus jedem KI-Clip eine nahtlose Schleife: Passen Ende und Anfang zusammen,
  wird weich überblendet; sonst läuft der Clip vor und zurück, mit den Umkehrpunkten in den Haltephasen.
- Bei Übungen mit gleichmäßigem Ablauf (Fahrrad, Knie anziehen, 90/90, Mountain Climber, Russian Twist,
  Hollow Rocks) läuft die Schleife immer vorwärts: `tools/cyc.py clip.mp4` sucht passende Wiederholungen,
  dann `LOOP=start,ende python3 tools/loopfix.py in.mp4 out.mp4`. Vor/zurück (`PP=a,b`) nur, wo die Bewegung
  rückwärts genauso aussieht (90/90 mit Hüftstreckung: Sitz → hoch → Sitz).
- Knie anziehen: Die KI hatte Hanteln dazuerfunden; im Prompt jetzt ausdrücklich „arms crossed, hands empty,
  NO dumbbells“.
