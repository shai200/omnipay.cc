# iOS App Wrapper (Capacitor)

This repo is already a Next.js PWA. The iOS app is a thin WebView wrapper using Capacitor.

## Prereqs

- macOS with Xcode installed
- Apple Developer account
- Node.js 20+

## One-time setup

1. Install dependencies:

```bash
npm install
```

2. Update the Capacitor config:

- Edit `capacitor.config.ts` and replace `https://YOUR_DOMAIN` with your production URL.
- Update `appId` to your bundle identifier (reverse-DNS).
- Update `appName` if needed.

3. Create the iOS project:

```bash
npm run cap:add:ios
```

4. Sync web assets to iOS:

```bash
npm run cap:sync
```

5. Open in Xcode:

```bash
npm run cap:open:ios
```

## App Store notes

- Use a real production URL in `server.url`; Apple rejects placeholder URLs.
- If you plan to use push notifications or other native features, add the relevant Capacitor plugins before submission.
- Make sure your privacy policy and terms are accessible from inside the app.

## Rebuild after web changes

Since the app loads your hosted site via `server.url`, no local rebuild is required. If you change the URL or Capacitor config, run:

```bash
npm run cap:sync
```
