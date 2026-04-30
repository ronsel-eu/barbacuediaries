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

## Notes

- Data is persisted to a local file named entries.json under Electron's userData directory.
- No authentication, sharing, media uploads, AI integration, or external service integrations are included.
