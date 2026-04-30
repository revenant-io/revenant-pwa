# PWA Testing Guide

## Your Local Setup

- **Local IP**: `172.28.88.161`
- **Dev Server**: Running on `http://localhost:3000`
- **Network**: You and your iPhone must be on the same WiFi network

## Testing on iPhone (Recommended)

### Option 1: Using ngrok (Easiest for iOS)

ngrok creates a public HTTPS tunnel, which is required for PWA features on iOS.

```bash
# Install ngrok if you don't have it
npm install -g ngrok

# Start ngrok tunnel to your dev server
ngrok http 3000
```

You'll get a URL like: `https://xxxx-xx-xxx-xxx-xx.ngrok.io`

1. On your iPhone, visit that URL in Safari
2. The page should load
3. Tap the **Share** button (square with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it "Revenant" and tap **Add**
6. The app will appear on your home screen as a native app

### Option 2: Local Network (Simpler Setup)

If you're on the same WiFi and your device allows unsigned certificates:

1. On your iPhone, visit: `http://172.28.88.161:3000`
2. Tap **Share** → **"Add to Home Screen"**
3. Name it and tap **Add**

**Note**: Service workers and some PWA features may not work fully without HTTPS on iOS from localhost.

### Option 3: Using mkcert for Local HTTPS

```bash
# Install mkcert
brew install mkcert  # macOS
# or: choco install mkcert  # Windows
# or: apt-get install mkcert  # Linux

# Create a local CA and certificate
mkcert -install
mkcert 172.28.88.161

# This creates: 172.28.88.161.crt and 172.28.88.161.key

# Modify package.json to add HTTPS dev script
# Create next.config.ts with HTTPS settings or use next-dev-https
```

## Features to Test

### 1. **Offline Counter** (`/counter`)
- Click the + button several times
- Open DevTools (F12) → Network tab
- Toggle "Offline" mode
- Go back to your app - the counter still works!
- Refresh - your count is restored

### 2. **Notifications** (`/notifications`)
- Go to /notifications
- Tap "Request Permission"
- Select "Allow" (on iPhone, this may be limited)
- Send a test notification
- **iOS Note**: Notifications on iOS PWAs are limited. You'll need special setup for full push notifications.

### 3. **Service Worker**
- On desktop, open DevTools → Application → Service Workers
- You should see "sw.js" with status "activated and running"
- In the Cache Storage, you'll see cached assets

## Debugging Tips

### Desktop (Chrome/Edge)
1. `F12` to open DevTools
2. **Application** tab → **Service Workers**: See registration status
3. **Application** → **Manifest**: Verify manifest.json loads
4. **Network** tab → **Offline**: Toggle offline mode
5. **Application** → **Storage** → **IndexedDB**: See Dexie database

### iPhone
1. Connect iPhone to Mac via USB
2. Open Safari on Mac
3. **Develop** menu → Select your iPhone → Select tab
4. You can debug the web app this way

## Common Issues

### Service Worker Not Registering
- Check that you're on HTTPS (or localhost on desktop)
- Check DevTools → Application → Service Workers
- Check browser console for errors

### Offline Mode Not Working
- Make sure you toggled offline in DevTools → Network
- Clear the cache and reload

### App Doesn't Install on iOS
- Make sure manifest.json is valid (check in DevTools)
- Try different browsers (some have better PWA support)
- Your site needs to be HTTPS for full support

## Next Steps

Once you confirm it works:
1. Add real app icons to `public/` (192x192 and 512x512 PNG)
2. Update manifest.json with your icons
3. Add Firebase Cloud Messaging for push notifications (optional)
4. Deploy to a server with HTTPS
