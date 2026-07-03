# FitCore – Setup & Architektur

Private iOS PWA für tägliches Tracking von Keto-Ernährung, Sport-Habits (Tennis,
Krafttraining, Cardio), Lesen, Wasser, Schlaf und Notizen. Inklusive
WHOOP-Integration und verschlüsseltem Cross-Device-Sync.

- Live: https://74-65.github.io/FitCore/
- Repo: https://github.com/74-65/FitCore

## Dateien
- `index.html` – die komplette App (Single-Page, kein Framework)
- `manifest.json` – PWA-Konfiguration (scope `/FitCore/`)
- `sw.js` – Service Worker, network-first, löscht alte Caches bei jedem Update
- `callback.html` – OAuth-Redirect-Ziel für WHOOP
- `icon-192.png` / `icon-512.png` – App-Icons

## Deploy
Änderungen an diesen Dateien nach `main` pushen/committen → GitHub Pages
deployt automatisch nach ca. 1–2 Minuten. Kein Build-Step nötig.

## Zum iPhone-Homescreen hinzufügen
1. `https://74-65.github.io/FitCore/` in Safari öffnen
2. Teilen-Symbol → „Zum Home-Bildschirm"
3. App aktualisiert sich danach selbst: der Service Worker lädt neue
   Versionen automatisch nach und reloadet die Seite einmalig, sobald ein
   Update installiert ist.

## WHOOP Integration

Konfiguriert in `index.html`:
```js
const WHOOP_CLIENT_ID     = '8de6a296-90d8-4619-a255-00ba5aea0181';
const WHOOP_PROXY_URL     = 'https://fitcore-whoop-proxy.fitcore88.workers.dev';
const WHOOP_REDIRECT_URI  = 'https://74-65.github.io/FitCore/callback.html';
```

- OAuth läuft über einen Cloudflare-Worker-Proxy (Client Secret bleibt dort,
  nie im Frontend-Code). Der Worker tauscht den Auth-Code gegen Tokens und
  leitet `/api/*`-Calls an die WHOOP v2 API weiter.
- WHOOP-App-Verwaltung: developer.whoop.com, Redirect URI muss exakt
  `https://74-65.github.io/FitCore/callback.html` sein.
- Sync (alle 30 min automatisch): Recovery, Schlaf, HRV, Strain, RHR, SpO2,
  Hauttemperatur, Schlafphasen, Workouts, Körperdaten.
- **Wichtig:** `WHOOP_CLIENT_ID` ist eine echte, feste ID – beim Bearbeiten
  von `index.html` (z.B. über GitHub-Weboberfläche oder KI-Tools) nicht
  versehentlich mit einem Platzhalter überschreiben.
- Verbindung herstellen: Einstellungen → WHOOP → „Verbinden".

## Cloud Sync (Supabase)

Konfiguriert in `index.html`:
```js
const SUPABASE_URL = 'https://inputbdkhoegsrofimai.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7pvJBaukiGlg74Oysd9lBQ_NWks_Fy4';
```

- Projekt: https://inputbdkhoegsrofimai.supabase.co, Tabelle `sync_data`
  (Spalten `id`, `created_at`, `sync_code` [unique], `data`), RLS aktiv mit
  Policy `allow_all` (FOR ALL, USING true, WITH CHECK true).
- Daten werden vor dem Upload clientseitig mit AES-GCM verschlüsselt (Web
  Crypto API, PBKDF2-Schlüsselableitung aus dem Sync-Code).
- Sync-Code wird frei vom User gewählt (mind. 4 Zeichen) und nur lokal
  (`localStorage`) gespeichert – Supabase kennt nur den verschlüsselten Blob.
- Aktivieren: Einstellungen → „Geräteübergreifend" → Code eingeben (auf
  jedem Gerät denselben Code verwenden, um Daten zu teilen).

## Lokale Daten
Alle Daten liegen zusätzlich lokal im `localStorage` (`tracker_v2`).
Export jederzeit unter Einstellungen → „Daten exportieren".

## Bekannte Einschränkungen
- Cloudflare-Account des Worker-Betreibers ist eingeschränkt (ToS-Flag) –
  der bestehende Worker läuft weiter, aber es können aktuell keine neuen
  Cloudflare-Ressourcen angelegt werden.
