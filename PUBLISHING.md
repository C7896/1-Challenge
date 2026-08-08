# Publishing checklist

Target: **TestFlight first**, built and configured as a real App Store submission so the
same build can be promoted to review without rebuilding.

App Store Connect record already exists: app ID `6476586429`, Apple team `R2R3GL3DN2`.
Last shipped version was 1.0.9 (build 18). This release is **1.1.0**.

## 1. Seed challenge content first

The app looks up each day's challenge by date in the Firestore `challenges` collection.
Content in the repo stopped at Jan 2024, so without this your TestFlight testers, and
later an App Store reviewer, open an app with nothing to do.

```bash
node scripts/seed-challenges.mjs --dry-run   # preview the 90 days
node scripts/seed-challenges.mjs             # write them
```

If Firestore rules reject the write, either pass `SEED_EMAIL` / `SEED_PASSWORD` for an
existing account, or temporarily allow writes to `/challenges` in the Firebase console.

## 2. Build and upload

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile production --auto-submit
```

The `production` profile is a store-distribution build, which is what TestFlight requires.
EAS prompts for Apple authentication and manages signing certificates. `ios/` and
`android/` are generated at build time from `app.json`, so do not hand-edit them.

Requires an active Apple Developer membership ($99/yr) on team `R2R3GL3DN2`.

After upload, the build processes in App Store Connect for roughly 5 to 30 minutes, then
appears under TestFlight.

## 3. TestFlight

**Internal testers** (up to 100 people on your App Store Connect team) get the build as
soon as processing finishes. No review required.

**External testers** (up to 10,000) require a one-time Beta App Review, which needs:

- Beta app description
- Feedback email
- **Demo account** credentials, mandatory because the app is behind a login
- Privacy policy URL

Suggested "What to Test" note for this build:

> Rebuilt on a current SDK, so the whole app is worth a pass. Specifically: create a new
> account and confirm onboarding completes, check that today's challenge appears and can
> be completed with a journal entry, confirm the streak and stats on Home update, open
> Past Challenges to confirm the entry is listed, and try Delete account to confirm it
> removes your data and returns you to the login screen. Daily reminders are scheduled for
> 9:00 AM if you allow notifications.

## 4. Promoting to the App Store

The same build is submitted for App Store review from App Store Connect. You will need:

- **What's New** text for 1.1.0. Draft:

  > This release rebuilds the app on a current foundation and fixes the problems that
  > could interrupt a daily streak. Challenges now load reliably, your journal entries and
  > streak count are recorded correctly, past challenges are sorted newest first, and daily
  > reminders no longer arrive more than once. You can now delete your account and all of
  > your entries from the home screen.

- **Privacy questionnaire**: collects email, user ID, and user content (journal entries),
  all linked to identity, none used for tracking
- Privacy policy URL
- Confirm existing screenshots and description still apply

Export compliance is already answered in the binary
(`ITSAppUsesNonExemptEncryption` is set), so submission will not stall on that question.

## Verified in this pass

- Builds and runs on iOS 26.5 with Xcode 26.6 (Expo SDK 56 / React Native 0.85)
- Version 1.1.0 build 1, so it will not collide with the existing 1.0.9 (18)
- App icon 1024x1024 with no alpha channel
- `PrivacyInfo.xcprivacy` generated with required-reason API declarations
- App Transport Security no longer allows arbitrary loads
- In-app account deletion present, as Apple guideline 5.1.1(v) requires
- Signup, onboarding, home, log, sign-out, and account deletion tested against live Firebase

## Worth deciding before testers see it

- The name under the app icon is **"OnePercentChallengeApp"**, while every screen in the
  app says "1% Challenge". Version 1.0.9 shipped this way, so it is your established name
  and I left it alone, but it reads as a placeholder. Changing it is a one-line edit to
  `name` in `app.json`. The App Store listing name is set separately in App Store Connect
  and is not affected.

## Known non-blockers

- "Explore more" on Home opens a Framer trial URL
  (`compassionate-service-496680.framer.app`). Repoint or remove it if that site is dead.
- Build numbers are managed remotely by EAS (`appVersionSource: remote` in `eas.json`).
  If App Store Connect reports a collision, run `eas build:version:set`.
- `app.json` declares `userInterfaceStyle: light`, which Android ignores unless
  `expo-system-ui` is installed. Cosmetic only; the app hardcodes its colors.
