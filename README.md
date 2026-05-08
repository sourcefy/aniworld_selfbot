# 🎬 Reborn

[Dokumentation](https://github.com/) • [Support](https://discord.com/) • [Installation](https://github.com/)

Ein Discord-Bot zur Steuerung und Automatisierung von Anime-Streams über Slash-Commands und Buttons.

---

## Übersicht

Reborn übernimmt die Steuerung von Anime-Streams direkt über Discord.  
Die Bedienung läuft über Buttons und Slash-Commands, dadurch bleibt alles schnell und übersichtlich.

## Funktionen

- Steuerung direkt über Discord-Buttons.
- Automatische Installation der benötigten Node-Module und des Playwright-Browsers beim ersten Start.
- Brave Browser im Hintergrund mit Adblocker und Popup-Schutz.
- Auto-Skip für das direkte Weiterspielen der nächsten Episode.
- Einfache Einrichtung über `config.env`.
- Unterstützung für Watchlists, Playlists und verschiedene Qualitätsstufen.

## Kommandos

| Befehl | Beschreibung |
|---|---|
| `/play [titel] [staffel] [episode]` | Sucht den Anime und startet den Stream. |
| `/stop` | Stoppt den Stream und schließt den Browser. |
| `/skip` | Springt zur nächsten Folge. |
| `/np` | Zeigt an, was gerade läuft. |
| `/quality [preset]` | Ändert die Stream-Qualität. |
| `/provider` | Wechselt den Anbieter. |
| `/autoskip` | Aktiviert oder deaktiviert Auto-Skip. |
| `/stats` | Zeigt Uptime, Folgen und Skips. |

## Start

1. `Node.js` installieren.
2. Den Bot im Projektordner starten:

```bash
node index.js
```

Oder empfohlen:

```bash
start.bat
```

3. Beim ersten Start wird `config.env` automatisch erstellt.
4. Dort die benötigten Tokens eintragen und den Bot erneut starten.

## Roadmap

- Weitere Anbieter und Hoster.
- 24/7 Hosting.
- Lautstärke direkt über Discord steuerbar.
- Benachrichtigungen für neue Episoden.

## Hinweis

Die Nutzung erfolgt auf eigene Verantwortung.
