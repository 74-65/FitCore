# Tracker PWA – Setup-Anleitung

## Dateien
- `index.html` – die komplette App
- `manifest.json` – PWA-Konfiguration
- `sw.js` – Service Worker (Offline-Support)

## Schritt 1: GitHub-Account anlegen (falls noch nicht vorhanden)
→ https://github.com/join
Kostenlos, keine Kreditkarte nötig.

## Schritt 2: Neues Repository erstellen
1. Auf github.com oben rechts auf „+" → „New repository"
2. Name: `tracker` (oder was du möchtest)
3. **Public** auswählen (nötig für kostenloses GitHub Pages)
4. „Create repository" klicken

## Schritt 3: Dateien hochladen
1. Im Repository auf „uploading an existing file" klicken
2. Alle drei Dateien hochladen: `index.html`, `manifest.json`, `sw.js`
3. „Commit changes" klicken

## Schritt 4: GitHub Pages aktivieren
1. Im Repository auf „Settings" klicken
2. Links auf „Pages"
3. Source: „Deploy from a branch"
4. Branch: `main` / Ordner: `/ (root)`
5. „Save"

Nach 1-2 Minuten ist die App unter
`https://DEIN-USERNAME.github.io/tracker/`
erreichbar.

## Schritt 5: Zum iPhone Homescreen hinzufügen
1. URL im Safari öffnen
2. Unten auf das Teilen-Symbol tippen
3. „Zum Home-Bildschirm" wählen
4. Fertig – die App erscheint wie eine native App

## Nächste Schritte (später)
- [ ] App-Icon erstellen (icon-192.png + icon-512.png)
- [ ] Supabase-Sync einbauen (geräteübergreifend)
- [ ] WHOOP API Integration
- [ ] Push-Reminder (iOS 16.4+)

## Daten
Alle Daten liegen lokal im `localStorage` deines iPhones.
Export jederzeit unter Einstellungen → „Daten exportieren".

## WHOOP Integration einrichten

### Schritt 1: Client ID & Secret eintragen
Öffne `index.html` und suche nach dieser Stelle (ca. Zeile 465):
```
const WHOOP_CLIENT_ID     = 'DEINE_CLIENT_ID';
const WHOOP_CLIENT_SECRET = 'DEIN_CLIENT_SECRET';
```
Ersetze die beiden Platzhalter mit deinen echten Werten aus dem WHOOP Developer Dashboard.

### Schritt 2: Redirect URI aktualisieren
Sobald du deine GitHub-Pages-URL kennst (z.B. `https://username.github.io/tracker`), geh ins WHOOP Developer Dashboard → deine App → Redirect URI ändern auf:
`https://username.github.io/tracker/callback.html`

### Schritt 3: callback.html hochladen
Die Datei `callback.html` muss ebenfalls auf GitHub Pages liegen (zusammen mit index.html).

### Schritt 4: In der App verbinden
Einstellungen → WHOOP → "Verbinden" → einmal bei WHOOP einloggen → fertig.

Ab dann: automatischer Sync bei jedem App-Start (alle 30 min).
