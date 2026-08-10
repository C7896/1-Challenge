/**
 * Generates an uploadable JSON file of dated challenge documents.
 *
 * Use this when you want to review or upload the content by hand rather than
 * running the live seeder. The output is keyed by Firestore document ID, which
 * is the format the common Firestore import tools expect.
 *
 * Usage:
 *   node scripts/export-challenges.mjs                      # 365 days from today
 *   node scripts/export-challenges.mjs 2026-08-01 365       # explicit start and count
 *
 * Writes: challenges-export.json
 *
 * To upload:
 *   Easiest is the seeder, which writes straight to Firestore:
 *     node scripts/seed-challenges.mjs --key ./service-account.json 2026-08-01 365
 *   Or import this file with a tool such as node-firestore-import-export:
 *     npx -y node-firestore-import-export firestore:import \
 *       -a ./service-account.json -b challenges-export.json
 */

import { writeFileSync } from "node:fs";
import { CHALLENGE_LIBRARY } from "../constants/challengeLibrary.js";
import { COLORS, MONTHS } from "../constants/fallbackChallenges.js";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const start = args[0] ? new Date(`${args[0]}T12:00:00`) : new Date();
const count = args[1] ? parseInt(args[1], 10) : 365;

if (Number.isNaN(start.getTime())) {
  console.error("Invalid start date. Use YYYY-MM-DD.");
  process.exit(1);
}

const challenges = {};
for (let i = 0; i < count; i++) {
  const date = new Date(start);
  date.setDate(date.getDate() + i);

  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  challenges[`${year}-${month}-${day}`] = {
    id: String(i + 1),
    day,
    month,
    year,
    color: COLORS[i % COLORS.length],
    challenge: CHALLENGE_LIBRARY[i % CHALLENGE_LIBRARY.length],
  };
}

const out = { challenges };
writeFileSync("challenges-export.json", JSON.stringify(out, null, 2) + "\n");

const keys = Object.keys(challenges);
console.log(`Wrote challenges-export.json`);
console.log(`  ${keys.length} documents`);
console.log(`  ${keys[0]} through ${keys[keys.length - 1]}`);
console.log(`  library has ${CHALLENGE_LIBRARY.length} unique challenges`);
if (count > CHALLENGE_LIBRARY.length) {
  console.log(`  note: ${count} days requested, so challenges repeat after day ${CHALLENGE_LIBRARY.length}`);
}
console.log(`\nFirst three:`);
keys.slice(0, 3).forEach((k) => console.log(`  ${k}  ${challenges[k].challenge}`));
