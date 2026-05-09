<img width="1200" height="300" alt="Unbenannt" src="https://github.com/user-attachments/assets/bd277ce8-bf0a-4826-a94f-54669a6e68bc" />

[Support](https://discord.gg/Nj8wzWPXuB) 

🤖 ## Übersicht

Reborn übernimmt die Steuerung von Anime-Streams direkt über Discord.  
Die Bedienung läuft über Buttons und Slash-Commands, dadurch bleibt alles schnell und übersichtlich.

📂 ## Funktionen

- Steuerung direkt über Discord-Buttons.
- Automatische Installation der benötigten Node-Module und des Playwright-Browsers beim ersten Start.
- Brave Browser im Hintergrund mit Adblocker und Popup-Schutz.
- Auto-Skip für das direkte Weiterspielen der nächsten Episode.
- Einfache Einrichtung über `config.env`.
- Unterstützung für Watchlists, Playlists und verschiedene Qualitätsstufen.

❔ ## Kommandos

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

⚙️ ## Installation

1. `Node.js` [20.20.0](https://nodejs.org/en/blog/release/v20.20.0) (LTS)  installieren.
2. Den Bot im Projektordner starten:


```bash
npm install
```

```bash
node src/index.js
```

3. Beim ersten Start wird `config.env` automatisch erstellt.
4. Dort die benötigten Tokens eintragen und den Bot erneut starten.

📈 ## Roadmap

- Weitere Anbieter und Hoster.
- 24/7 Hosting.
- Lautstärke direkt über Discord steuerbar.
- Benachrichtigungen für neue Episoden.

❤️ ## Hinweis

Die Nutzung erfolgt auf eigene Verantwortung.

Bitte beachtet, dass sich die Software noch in einem frühen Entwicklungsstadium befindet und daher einige Bugs enthalten kann. Diese werden in zukünftigen Updates nach und nach behoben.
