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
