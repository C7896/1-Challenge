# Publishing checklist

Target: **TestFlight first**, built and configured as a real App Store submission so the
same build can be promoted to review without rebuilding.

## This is a fresh app, not an update

The publishing account changed (new Expo account, new Apple Developer account), so every
identifier tied to the old account was reset:

| | Old | New |
|---|---|---|
| Bundle ID | `com.onepercentchallenge.onepercentchallenge` | `com.onepercentchallenge.app` |
| Display name | `OnePercentChallengeApp` | `1% Challenge` |
| Version | 1.0.9 (18) | **1.0.0 (1)** |
| EAS project | `42eab36a-...` | created on first build |
| App Store Connect | app `6476586429` | created on first submit |

The old bundle ID could not be carried over. Apple permanently binds a bundle ID to the
team and app record that shipped it, so a new team cannot claim it. Consequences:

- This publishes as a **new app**. Anyone running the old 1.0.9 will not receive it as an
  update, and their install stays on the old version.
- Version restarts at 1.0.0 because the new App Store Connect record has no history.
- **Firebase is unaffected.** The app talks to Firebase through the JS SDK using
  `firebase-config.js`, which authenticates by project and API key rather than bundle ID.
  The old `GoogleService-Info.plist` and `google-services.json` were leftovers from the
  native Firebase package removed during the SDK upgrade; they are no longer referenced.
  Existing user accounts and journal data are untouched and still work.

If you would rather keep a different bundle ID, change `ios.bundleIdentifier` and
`android.package` in `app.json` **before the first build**. After a build ships, it is
permanent.

## 1. Seed challenge content first

The app looks up each day's challenge by date in the Firestore `challenges` collection.
Content in the repo stopped at Jan 2024, so without this your TestFlight testers, and
later an App Store reviewer, open an app with nothing to do.

```bash
node scripts/seed-challenges.mjs --dry-run 2026-08-02 365                  # preview, no credentials needed
node scripts/seed-challenges.mjs --key ./service-account.json 2026-08-02 365   # write a full year
```

The script writes with the Firebase Admin SDK, using a service account key, not a signed-in
user. This is intentional: Firestore rules correctly deny client writes to `/challenges`, and
the script bypasses rules the same way the console does rather than going through them.

To get a key: Firebase Console, then Project Settings, then Service Accounts, then "Generate
new private key." Save the downloaded JSON somewhere outside this repo, or use one of the
patterns `.gitignore` already excludes (`service-account*.json`). Never commit it.

You can also point at a key with an env var instead of `--key`:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/seed-challenges.mjs
```

Never loosen the Firestore rules to make this script work. Opening `/challenges` to
authenticated writes would let any signed-in user rewrite the daily challenge text shown to
every user, which is a mass content injection risk, and it is unnecessary since the Admin SDK
already bypasses rules with a proper credential.

## 2. Build and upload

```bash
npx eas-cli login                                    # your NEW Expo account
npx eas-cli init                                     # creates the EAS project
npx eas-cli build --platform ios --profile production --auto-submit
```

`eas init` writes a fresh `extra.eas.projectId` into `app.json` under your new account.
The old project ID was removed, so this step is required once.

The `production` profile is a store-distribution build, which is what TestFlight requires.
During the build, EAS prompts for your **new** Apple ID and creates the signing
certificate and provisioning profile for `com.onepercentchallenge.app`. At the submit
step it will offer to **create the App Store Connect app record**, since `eas.json` no
longer names one. Accept that, and it registers the new app for you.

Requires an active Apple Developer membership ($99/yr) on the new team.

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

- **What's New** text for 1.0.0. Since this is a new listing, this is the launch
  description rather than a changelog. Draft:

  > A small daily challenge, once a day. Complete it, write a short reflection, and build
  > a streak. One percent better each day compounds to thirty-seven times better in a year.

- **Privacy questionnaire**: collects email, user ID, and user content (journal entries),
  all linked to identity, none used for tracking
- Privacy policy URL
- Confirm existing screenshots and description still apply

Export compliance is already answered in the binary
(`ITSAppUsesNonExemptEncryption` is set), so submission will not stall on that question.

## Verified in this pass

- Builds and runs on iOS 26.5 with Xcode 26.6 (Expo SDK 56 / React Native 0.85)
- Version 1.0.0 build 1 under the new bundle ID com.onepercentchallenge.app
- App icon 1024x1024 with no alpha channel
- `PrivacyInfo.xcprivacy` generated with required-reason API declarations
- App Transport Security no longer allows arbitrary loads
- In-app account deletion present, as Apple guideline 5.1.1(v) requires
- Signup, onboarding, home, log, sign-out, and account deletion tested against live Firebase
- Firestore rules are now versioned at `firestore.rules`. Diff them against the live console
  rules before any deploy; the file was derived from observed behavior, not the console
  source, and has never itself been deployed.

## Known non-blockers

- "Explore more" on Home opens a Framer trial URL
  (`compassionate-service-496680.framer.app`). Repoint or remove it if that site is dead.
- Build numbers are managed remotely by EAS (`appVersionSource: remote` in `eas.json`).
  If App Store Connect reports a collision, run `eas build:version:set`.
- `app.json` declares `userInterfaceStyle: light`, which Android ignores unless
  `expo-system-ui` is installed. Cosmetic only; the app hardcodes its colors.
