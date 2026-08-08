/**
 * Seed the Firestore `challenges` collection with one challenge per day.
 *
 * The app looks up today's challenge by (day, month, year), so a day with no
 * document means users land on Home with nothing to do. Content in the repo
 * stopped at Jan 2024, so this backfills a forward runway.
 *
 * Usage:
 *   node scripts/seed-challenges.mjs                 # 90 days from today
 *   node scripts/seed-challenges.mjs 2026-08-08 120  # explicit start + count
 *   node scripts/seed-challenges.mjs --dry-run       # print, write nothing
 *
 * If Firestore rules require auth to write, set credentials first:
 *   SEED_EMAIL=you@example.com SEED_PASSWORD=... node scripts/seed-challenges.mjs
 *
 * Re-running is safe: document IDs are date-derived, so a second run overwrites
 * the same days instead of creating duplicates.
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebase-config.js";

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
  const positional = args.filter((a) => !a.startsWith("--"));
  const start = positional[0] ? new Date(`${positional[0]}T12:00:00`) : new Date();
  const count = positional[1] ? parseInt(positional[1], 10) : 90;
  if (Number.isNaN(start.getTime())) {
    console.error("Invalid start date. Use YYYY-MM-DD.");
    process.exit(1);
  }
  return { start, count, dryRun };
}

async function main() {
  const { start, count, dryRun } = parseArgs();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  if (process.env.SEED_EMAIL && process.env.SEED_PASSWORD) {
    await signInWithEmailAndPassword(getAuth(app), process.env.SEED_EMAIL, process.env.SEED_PASSWORD);
    console.log("Signed in as", process.env.SEED_EMAIL);
  }

  console.log(`${dryRun ? "[dry run] " : ""}Seeding ${count} days from ${start.toDateString()}\n`);

  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);

    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const docId = `${year}-${month}-${day}`;

    const entry = {
      id: String(i + 1),
      day,
      month,
      year,
      color: COLORS[i % COLORS.length],
      challenge: CHALLENGES[i % CHALLENGES.length],
    };

    if (dryRun) {
      console.log(`${docId}  ${entry.challenge}`);
      continue;
    }

    await setDoc(doc(db, "challenges", docId), entry);
    console.log(`wrote ${docId}  ${entry.challenge}`);
  }

  console.log(`\nDone. ${dryRun ? "Nothing was written." : `${count} challenges seeded.`}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  if (error.code === "permission-denied") {
    console.error(
      "Firestore rules rejected the write. Either sign in with SEED_EMAIL/SEED_PASSWORD,\n" +
      "or temporarily allow writes to /challenges in the Firebase console."
    );
  }
  process.exit(1);
});
