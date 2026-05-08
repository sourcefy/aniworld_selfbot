===========================================================================
  🍜  ANIME-STREAMER v2.0 – Dein privates Discord-Kino (Brave Edition)  
===========================================================================

Hey! Willkommen beim Anime-Streamer v2.0. 
Kennst du das? Du willst mit Freunden über Discord Anime schauen, teilst deinen 
Bildschirm und zack – die Qualität ist furchtbar, es ruckelt und ständig ploppen 
irgendwelche dubiosen Werbefenster auf. 

Genau dafür ist dieses Skript da. Es ist ein "Dual-Bot-System". Das heißt, 
ein unsichtbarer Selfbot klinkt sich in den Voice-Channel ein und streamt das 
Video in brillanter Qualität, während du alles ganz bequem über einen normalen, 
offiziellen Discord-Bot mit Slash-Befehlen und Klick-Buttons steuerst. 


⚠️ WICHTIGER HINWEIS VORAB: 
Discord sieht Selfbots laut ihren Nutzungsbedingungen nicht gerne. Dass wir hier 
einen normalen Bot für die Bedienung dazwischengeschaltet haben, minimiert das 
Risiko für deinen Hauptaccount enorm, aber bitte denk daran: Die Nutzung erfolgt 
auf eigene Gefahr! Be safe!


=========================
 WARUM DIESER BOT ROCKT
=========================

* Das Beste aus zwei Welten: Du musst keine kryptischen Befehle mehr tippen. 
  Klick einfach auf die normalen Discord-Buttons (Skip, Stop, Info), die dir 
  der Bot anzeigt.

* Nie wieder Werbung: Der Bot nutzt einen "headless" Brave Browser im Hintergrund 
  und hat einen extrem aggressiven Ghostery-Adblocker verbaut. Er killt sämtliche 
  Popups und unsichtbaren Overlays von Hostern wie VOE oder Streamtape. 

* Volle Auswahl: Such dir aus, ob du von AniWorld oder Aniflix streamen 
  willst. Egal ob Ger Sub, Ger Dub oder Englisch – du hast die Wahl.

* Autopilot für Faule: Du hast keinen Nerv für aufwendige Installationen? 
  Kein Problem. Starte das Skript einfach. Alle nötigen Node-Module und sogar 
  der Playwright-Browser installieren sich beim ersten Start komplett von 
  selbst.

* Popcorn-Modus (Auto-Skip): Wenn du Binge-Watching betreibst, mach einfach 
  Auto-Skip an. Der Bot lädt dann automatisch die nächste Episode, sobald 
  die aktuelle fertig ist.


=========================
 SO STARTEST DU IHN
=========================

1. Was du brauchst: Node.js sollte installiert sein. Außerdem brauchst du den 
   Brave Browser auf deinem PC, denn den schnappt sich das Skript für das 
   Scraping. Um FFmpeg musst du dich nicht kümmern, das bringt der Bot 
   selbst mit.

2. Starten: Öffne dein Terminal (oder CMD) in dem Ordner, in dem die Datei 
   liegt und tippe ein: "node index.js"

3. Einrichten: Beim allerersten Start legt der Bot automatisch eine Datei 
   namens "config.env" für dich an. Öffne sie und pack dort deinen Selfbot-Token 
   und den Token deines normalen Bots rein. 

4. Lass ihn rödeln: Wenn du ihn dann nochmal startest, installiert er 
   fehlende Pakete nach und geht online!


=========================
 DIE COMMANDS
=========================
Steuere alles einfach über deinen Discord-Chat:

/play [titel] [staffel] [episode] 
  -> Sucht deinen Anime und wirft den Stream im Voice-Channel an.

/stop                              
  -> Beendet den Stream und schließt den unsichtbaren Browser.

/skip                              
  -> Direkt zur nächsten Folge springen.

/np                                
  -> Zeigt dir detailliert an, welche Folge gerade in welcher Qualität läuft.

/quality [preset]                  
  -> Ruckelt dein Internet? Stell die Qualität ein (von 480p bis Ultra 1080p+).

/provider                          
  -> Wechsel mit einem Klick zwischen AniWorld und Aniflix.

/autoskip                          
  -> Schaltet das automatische Abspielen der nächsten Folge ein/aus.

/stats                             
  -> Check deine Watch-Stats (Wie lange der Bot schon läuft, gestreamte Folgen etc.).


Viel Spaß beim Streamen! 🍿
===========================================================================
