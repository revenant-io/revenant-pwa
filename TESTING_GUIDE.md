# PWA Testing Guide

## Local Setup

- Dev server: `http://localhost:3000`
- For mobile testing, your device must be on the same WiFi network

## Testing on iPhone

### Option 1: ngrok (easiest — required for iOS PWA features)

```bash
npm install -g ngrok
ngrok http 3000
```

Visit the `https://xxxx.ngrok.io` URL in Safari, then:
1. Tap the Share button → **Add to Home Screen**
2. The app installs as a native-looking icon

### Option 2: Local network

Visit `http://<your-local-ip>:3000` on the device. Service workers require HTTPS on iOS, so some features won't work.

## Features to Test

### Expenses (`/expenses`)
- Personal tab shows your own expenses
- Shared tab shows expenses where you're a participant
- Create a new expense at `/expenses/new`
- Try sharing an expense: search a username in the Participants field

### Chat widget
- Click the floating chat button
- Type an expense in natural language: *"gasté 5000 en café"*
- Confirm when the bot shows the summary
- The expense should appear in `/expenses`

### Notifications (`/notifications`)
- Request permission and send a test notification
- iOS requires HTTPS for full push notification support

### Offline / Service Worker
- Open DevTools → Application → Service Workers
- Toggle offline in DevTools → Network
- The app shell loads from cache

## Debug Page (`/debug`)

Shows network status, install status, and iOS install instructions. Has a link to `/notifications`.

## Desktop DevTools

- **Application → Service Workers** — registration status
- **Application → Manifest** — verify `manifest.json`
- **Application → Storage → IndexedDB** — Dexie offline data
- **Network → Offline** — toggle offline mode
