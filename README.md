# Badminton-Training

Intervall-Timer mit Videoausschnitten für Trainingseinheiten (USV TU Dresden, Abteilung Badminton).

Seite: https://janseliger.github.io/badminton-training/

## Aufbau

- `index.html` – Übersicht aller Einheiten
- `timer.html?w=<id>` – der Timer, für jede Einheit gleich
- `assets/` – Stylesheet und Timer-Logik
- `workouts/list.js` – Liste der Einheiten für die Übersicht
- `workouts/<id>.js` – eine Datei pro Einheit

## Neue Einheit anlegen

1. `workouts/<id>.js` anlegen (Vorlage: `core-beweglichkeit.js`). Die Datei ruft `WORKOUT({...})` auf mit
   - `videos`: Kürzel → `{ id: YouTube-ID, name }`
   - `parts`: Teile mit `name`, `prep` (Pause/Wechsel vor jeder Übung, Sek.), optional `work`, `rounds`, `roundRest`
   - `steps`: Übungen mit `n` (Name), `work` (Sek.), `dose`, `how`, `focus`, `light`, `sw` (Seitenwechsel nach Sek.) und
     `v: { k, t, e }` (Video-Kürzel, Start- und Endsekunde des Ausschnitts)
2. In `workouts/list.js` eintragen.
