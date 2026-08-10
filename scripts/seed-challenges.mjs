/**
 * Seed the Firestore `challenges` collection with one challenge per day.
 *
 * The app looks up today's challenge by (day, month, year), so a day with no
 * document means users land on Home with nothing to do. Content in the repo
 * stopped at Jan 2024, so this backfills a forward runway.
 *
 * This uses the Firebase ADMIN SDK, which authenticates with a service
 * account and bypasses Firestore security rules. The client SDK cannot do
 * this: this project's rules correctly deny client writes to /challenges.
 *
 * Usage:
 *   node scripts/seed-challenges.mjs --dry-run                    # print, write nothing, no credentials needed
 *   node scripts/seed-challenges.mjs --key ./service-account.json # 90 days from today
 *   node scripts/seed-challenges.mjs --key ./service-account.json 2026-08-08 120
 *
 * Credentials (required for real writes, NOT required for --dry-run):
 *   Provide a service account key either via:
 *     --key <path-to-service-account.json>
 *   or:
 *     GOOGLE_APPLICATION_CREDENTIALS=<path-to-service-account.json>
 *
 *   To get a key: Firebase Console -> Project Settings -> Service Accounts ->
 *   "Generate new private key". Save the downloaded JSON somewhere outside
 *   version control. DO NOT COMMIT THIS FILE. (.gitignore already excludes
 *   the common service-account filename patterns.)
 *
 * Re-running is safe: document IDs are date-derived, so a second run overwrites
 * the same days instead of creating duplicates.
 */

import { readFileSync } from "node:fs";
import { FALLBACK_CHALLENGES as CHALLENGES, COLORS, MONTHS } from "../constants/fallbackChallenges.js";

const PROJECT_ID = "one-percent-challenge";
const FIRESTORE_BATCH_LIMIT = 500;

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  let keyPath;
  const keyFlagIndex = args.indexOf("--key");
  if (keyFlagIndex !== -1) {
    keyPath = args[keyFlagIndex + 1];
    if (!keyPath) {
      console.error("--key requires a path argument, e.g. --key ./service-account.json");
      process.exit(1);
    }
  }

  const positional = args.filter((a, i) => {
    if (a.startsWith("--")) return false;
    if (i === keyFlagIndex + 1 && keyFlagIndex !== -1) return false; // the --key value
    return true;
  });

  const start = positional[0] ? new Date(`${positional[0]}T12:00:00`) : new Date();
  const count = positional[1] ? parseInt(positional[1], 10) : 90;
  if (Number.isNaN(start.getTime())) {
    console.error("Invalid start date. Use YYYY-MM-DD.");
    process.exit(1);
  }
  return { start, count, dryRun, keyPath };
}

function buildEntries(start, count) {
  const entries = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);

    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const docId = `${year}-${month}-${day}`;

    entries.push({
      docId,
      entry: {
        id: String(i + 1),
        day,
        month,
        year,
        color: COLORS[i % COLORS.length],
        challenge: CHALLENGES[i % CHALLENGES.length],
      },
    });
  }
  return entries;
}

function credentialsHelp() {
  return (
    "No service account key found.\n\n" +
    "This script writes with the Firebase Admin SDK, which needs a service\n" +
    "account key (client credentials cannot write to /challenges: Firestore\n" +
    "rules correctly deny that).\n\n" +
    "To get one:\n" +
    "  1. Open the Firebase Console -> Project Settings -> Service Accounts.\n" +
    "  2. Click \"Generate new private key\" and save the downloaded JSON file\n" +
    "     somewhere OUTSIDE this repo (or somewhere .gitignore already covers).\n" +
    "  3. DO NOT COMMIT THIS FILE.\n" +
    "  4. Run again with either:\n" +
    "       node scripts/seed-challenges.mjs --key /path/to/service-account.json\n" +
    "     or:\n" +
    "       GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/seed-challenges.mjs\n\n" +
    "To preview without any credentials, use --dry-run."
  );
}

async function main() {
  const { start, count, dryRun, keyPath } = parseArgs();
  const entries = buildEntries(start, count);

  console.log(`${dryRun ? "[dry run] " : ""}Seeding ${count} days from ${start.toDateString()}\n`);

  if (dryRun) {
    for (const { docId, entry } of entries) {
      console.log(`${docId}  ${entry.challenge}`);
    }
    console.log(`\nDone. Nothing was written.`);
    process.exit(0);
  }

  const resolvedKeyPath = keyPath || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!resolvedKeyPath) {
    console.error(credentialsHelp());
    process.exit(1);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(resolvedKeyPath, "utf8"));
  } catch (error) {
    console.error(`Could not read/parse service account key at "${resolvedKeyPath}": ${error.message}\n`);
    console.error(credentialsHelp());
    process.exit(1);
  }

  const { initializeApp, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID,
  });
  const db = getFirestore(app);

  for (let i = 0; i < entries.length; i += FIRESTORE_BATCH_LIMIT) {
    const chunk = entries.slice(i, i + FIRESTORE_BATCH_LIMIT);
    const batch = db.batch();
    for (const { docId, entry } of chunk) {
      batch.set(db.collection("challenges").doc(docId), entry);
    }
    await batch.commit();
    for (const { docId, entry } of chunk) {
      console.log(`wrote ${docId}  ${entry.challenge}`);
    }
  }

  console.log(`\nDone. ${count} challenges seeded.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
