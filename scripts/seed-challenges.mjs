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

const PROJECT_ID = "one-percent-challenge";
const FIRESTORE_BATCH_LIMIT = 500;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// palette the app already cycles through
const COLORS = ["#FF815E", "#FFCF5B", "#DCE18B", "#A1D5AE", "#92C1D2", "#4969A9"];

const CHALLENGES = [
  "Say thank you to someone who helped you this week.",
  "Text a friend you have not spoken to in over a month.",
  "Pick up three pieces of litter you did not drop.",
  "Give someone a genuine compliment about their work, not their looks.",
  "Let someone go ahead of you in line.",
  "Write down three things you are grateful for.",
  "Call a family member just to ask how they are.",
  "Leave a kind note where a stranger will find it.",
  "Hold the door for everyone behind you today.",
  "Donate one item you have not used in a year.",
  "Learn the name of someone you see often but never asked.",
  "Send a thank-you message to a teacher or mentor.",
  "Cook or share a meal with someone.",
  "Take a ten minute walk with no phone.",
  "Apologize for something you have been putting off.",
  "Ask someone about their day and listen without interrupting.",
  "Leave a good review for a small business you like.",
  "Do a chore that is not yours without mentioning it.",
  "Write a joke and tell it until three people laugh.",
  "Introduce two people who should know each other.",
  "Drink only water today.",
  "Spend fifteen minutes learning something new.",
  "Put your phone away during every meal today.",
  "Give up your seat to someone who needs it.",
  "Tell someone specifically why you appreciate them.",
  "Tidy one small space and leave it better than you found it.",
  "Reach out to someone who seemed down lately.",
  "Read ten pages of a book.",
  "Say no to something that drains you.",
  "Thank someone in a service job by name.",
  "Share something you learned with one other person.",
  "Write down one goal and the first small step toward it.",
  "Give an honest piece of encouragement to a coworker.",
  "Stretch for five minutes before bed.",
  "Pay for the person behind you if you can afford it.",
  "Forgive someone silently and let it go.",
  "Ask a question instead of giving advice today.",
  "Spend an hour without any screens.",
  "Reconnect with an old hobby for twenty minutes.",
  "Offer help before being asked.",
  "Write a short letter to your future self.",
  "Compliment a stranger sincerely.",
  "Clean out one drawer or folder.",
  "Go to bed thirty minutes earlier tonight.",
  "Share a resource that helped you with someone who needs it.",
  "Eat one more serving of vegetables than usual.",
  "Tell a family member a specific memory you cherish.",
  "Do the hardest task on your list first.",
  "Support a local business today.",
  "Give someone your full attention for an entire conversation.",
  "Take the stairs every time today.",
  "Write down one thing you did well this week.",
  "Check in on a neighbor.",
  "Delete an app that wastes your time.",
  "Teach someone something you are good at.",
  "Say yes to an invitation you would normally decline.",
  "Spend ten minutes outside without a destination.",
  "Send a photo that will make someone smile.",
  "Fix one small thing that has been annoying you.",
  "Give credit publicly to someone who earned it.",
  "Cook something you have never made before.",
  "Ask for feedback from someone you trust.",
  "Put ten dollars toward a goal or a cause.",
  "Listen to a full album without multitasking.",
  "Write a review or recommendation for a friend.",
  "Let someone else pick the plan today.",
  "Do a five minute breathing exercise.",
  "Reach out to someone in your field you admire.",
  "Give away something you no longer need.",
  "Say the kind thing you were thinking but did not say.",
  "Plan one thing you are looking forward to.",
  "Wake up without hitting snooze.",
  "Ask a coworker how you can make their day easier.",
  "Take a different route than usual and notice something new.",
  "Write down what is worrying you, then one thing you control.",
  "Share a meal recipe with a friend.",
  "Spend twenty minutes on something creative.",
  "Thank a parent or guardian figure specifically.",
  "Leave your workspace cleaner than you found it.",
  "Reply to the message you have been avoiding.",
  "Do something kind without telling anyone.",
  "Compliment someone on a decision they made, not a result.",
  "Take a photo of something beautiful you would normally pass.",
  "Give yourself credit for something you usually dismiss.",
  "Ask someone what they are excited about right now.",
  "Move your body for twenty minutes.",
  "Reach out to someone who once helped your career.",
  "Cancel one thing that does not serve you.",
  "Make a small repair instead of a replacement.",
  "End the day by naming one win, however small.",
];

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
