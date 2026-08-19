# Barbacue Diaries (Desktop MVP)

Single-user desktop app to log BBQ experiments and search past entries.

## Implemented MVP Slice

- Create entry with minimal fields:
  - meat
  - cooker type (parrilla or kamado)
  - cook time in minutes
  - temperature
  - smoked (yes/no)
  - wood
  - final result
- Archive list of all entries (newest first)
- Search and filter by multiple fields
- Entry detail view
- Local file persistence (no external database)

## Stack

- Electron (desktop shell)
- Vanilla HTML/CSS/JS for renderer UI
- Local JSON storage in Electron userData path

## Run

1. Install Node.js (which includes npm)
2. Install dependencies:
   npm install
3. Start app:
   npm start

## Android phone version

The separate `mobile/` app is a browser-based progressive web app. It stores entries locally in the phone browser, works offline after the first load, and does not change the Electron desktop app.

1. Connect the Mac and Android phone to the same Wi-Fi network.
2. Start the mobile server from this project:
   npm run mobile
3. Open the printed `Android phone` URL on the phone.
4. Use the browser menu to add Barbacue Diaries to the home screen.

The mobile app includes JSON export/import under Settings so phone entries can be backed up or moved manually. Its storage is separate from the desktop app's local `entries.json` file.

## Build an Android APK

The mobile app can also be packaged as a standalone Android app with Capacitor. This wrapper is separate from Electron and stores its entries locally on the phone.

Prerequisites:

- Android Studio with the Android SDK and Platform Tools
- A Java JDK supported by the installed Android Gradle Plugin
- An Android phone with Developer options and USB debugging enabled, or an Android emulator

Create/sync the Android project:

```bash
npm run android:sync
```

Open it in Android Studio:

```bash
npm run android:open
```

From Android Studio, choose **Build > Build App Bundle(s) / APK(s) > Build APK(s)**, or connect a device and run the app. After changing files under `mobile/`, run `npm run android:sync` again before rebuilding.

## Notes

- Data is persisted to a local file named entries.json under Electron's userData directory.
- No authentication, sharing, media uploads, AI integration, or external service integrations are included.
