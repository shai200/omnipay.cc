# App Store Submission Checklist (WebView PWA)

Use this as a practical checklist for a Capacitor webview app that loads a hosted PWA.

## Apple Developer + App Setup

- Apple Developer account active
- App created in App Store Connect with the correct bundle ID
- Bundle ID matches `appId` in `capacitor.config.ts`
- App name matches `appName`

## Build + Signing (Xcode)

- Open the iOS project in Xcode (`npm run cap:open:ios`)
- Select the correct Team under Signing & Capabilities
- Set the version and build number
- Ensure deployment target matches your supported iOS version

## App Store Connect Metadata

- App description, keywords, and support URL
- Privacy policy URL
- App Store screenshots for all required device sizes
- App icon and launch screen set in Xcode

## Privacy + Compliance

- Verify privacy policy is reachable inside the app
- Ensure Terms of Service is reachable inside the app
- If using analytics or tracking, update App Privacy in App Store Connect
- If using payments in the web app, confirm it aligns with Apple guidelines

## Review Notes

- Include test credentials if login is required
- Explain that the app is a webview wrapper for the hosted service
- Provide any special navigation or feature notes

## Final Steps

- Archive and upload from Xcode
- Wait for processing, then submit for review in App Store Connect

## Optional but Helpful

- Add an in-app “Open in Safari” link in case of webview issues
- Add an in-app “Contact Support” link
