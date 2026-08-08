# Publishing checklist

App Store Connect record already exists: app ID `6476586429`, Apple team `R2R3GL3DN2`.
Last shipped version was 1.0.9 (build 18).

## 1. Seed challenge content first

The app looks up each day's challenge by date in the Firestore `challenges` collection.
Content in the repo stopped at Jan 2024, so without this the reviewer opens an app with
nothing to do, which risks a "minimum functionality" rejection.

```bash
node scripts/seed-challenges.mjs --dry-run   # preview
node scripts/seed-challenges.mjs             # 90 days from today
```

If Firestore rules reject the write, either pass `SEED_EMAIL` / `SEED_PASSWORD` for an
existing account, or temporarily allow writes to `/challenges` in the Firebase console.

## 2. Build and submit

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile production --auto-submit
```

EAS prompts for Apple authentication and manages signing certificates. `ios/` and
`android/` are generated at build time from `app.json`, so do not hand-edit them.

Requires an active Apple Developer membership ($99/yr) on team `R2R3GL3DN2`.

## 3. App Store Connect

- **What's New** text for the version
- **Demo account** in review notes (required: the app is behind a login)
- **Privacy policy URL** (required: the app collects personal data)
- **Privacy questionnaire**: collects email, user ID, and user content (journal entries),
  all linked to identity, none used for tracking
- Confirm existing screenshots and description still apply

## Verified in this pass

- Builds and runs on iOS 26.5 with Xcode 26.6 (Expo SDK 56 / React Native 0.85)
- App icon 1024x1024 with no alpha channel
- `PrivacyInfo.xcprivacy` generated with required-reason API declarations
- `ITSAppUsesNonExemptEncryption` set, so export compliance does not stall submission
- App Transport Security no longer allows arbitrary loads
- In-app account deletion present, as Apple guideline 5.1.1(v) requires
- Signup, onboarding, home, log, sign-out, and account deletion tested against live Firebase

## Known non-blockers

- "Explore more" on Home opens a Framer trial URL
  (`compassionate-service-496680.framer.app`). Repoint or remove it if that site is dead.
- Android `versionCode` is managed remotely by EAS (`appVersionSource: remote` in
  `eas.json`); run `eas build:version:set` if Play reports a collision.
- `app.json` declares `userInterfaceStyle: light`, which Android ignores unless
  `expo-system-ui` is installed. Cosmetic only; the app hardcodes its colors.
