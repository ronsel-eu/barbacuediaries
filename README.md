# Rescoldo

Single-user BBQ cook journal, built as a mobile-first progressive web app (installable to your phone's home screen) and packagable as a native Android app via Capacitor.

## Implemented features

- Create entry: meat, cooker type (configurable list in Settings), cook time, temperature (degrees or hand-test level), smoked (yes/no), wood, recipe, tips, result rating
- Archive list of all entries (newest first), with search and filter
- Entry detail view
- English/Spanish UI language toggle
- °C/°F setting
- CSV export/import for backup, with merge-or-replace and duplicate detection
- Offline-capable (service worker), installable to the home screen
- Local storage only — no account, no external service

## Stack

- Vanilla HTML/CSS/JS, zero dependencies in the app itself
- Browser `localStorage` for entries and settings
- Capacitor wraps the same code into a native Android APK

## Run the mobile app for phone testing

1. Install Node.js (which includes npm)
2. Install dependencies:
   npm install
3. Connect your Mac and phone to the same Wi-Fi network
4. Start the mobile server:
   npm run mobile
5. Open the printed URL on the phone
6. Use the browser menu to add Rescoldo to the home screen

The mobile app includes CSV export/import under Settings so entries can be backed up or moved manually.

## Build an Android APK

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

- Entries and settings are stored locally on the device; nothing leaves the phone.
- No authentication, sharing, media uploads, AI integration, or external service integrations are included.
