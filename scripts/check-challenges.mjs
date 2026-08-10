/**
 * Validates the challenge library. Run after editing constants/challengeLibrary.js
 *   node scripts/check-challenges.mjs
 * Exits 1 if anything is wrong.
 */

import { CHALLENGE_LIBRARY, CATEGORIES } from "../constants/challengeLibrary.js";

// The app sizes challenge text by length (screens/LogScreen.js setFontSize):
// <40 -> 20pt, <70 -> 18pt, <100 -> 16pt, else 14pt. Challenge2Screen renders
// at 25pt, so anything long risks overflowing the card.
const HARD_MAX = 95;

let failures = 0;
function fail(msg) { console.log("  FAIL " + msg); failures++; }
function ok(msg) { console.log("  ok   " + msg); }

console.log(`\nChallenge library: ${CHALLENGE_LIBRARY.length} entries\n`);

console.log("Category balance");
const catEntries = Object.entries(CATEGORIES);
const total = catEntries.reduce((n, [, v]) => n + v.length, 0);
for (const [name, list] of catEntries) {
  const pct = ((list.length / total) * 100).toFixed(1);
  const bar = "#".repeat(Math.round(list.length / 2));
  console.log(`  ${name.padEnd(22)} ${String(list.length).padStart(3)}  ${pct.padStart(5)}%  ${bar}`);
}
console.log(`  ${"TOTAL".padEnd(22)} ${String(total).padStart(3)}`);
if (total !== CHALLENGE_LIBRARY.length) {
  fail(`interleave lost entries: ${total} in categories, ${CHALLENGE_LIBRARY.length} in library`);
} else {
  ok("interleave preserved every entry");
}

console.log("\nDuplicates");
const seen = new Map();
const dupes = [];
for (const c of CHALLENGE_LIBRARY) {
  const norm = c.toLowerCase().replace(/[^a-z ]/g, "").trim();
  if (seen.has(norm)) dupes.push(c);
  seen.set(norm, true);
}
dupes.length ? dupes.forEach((d) => fail(`duplicate: "${d}"`)) : ok("no exact duplicates");

// near-duplicates: same first three words
const byOpening = {};
for (const c of CHALLENGE_LIBRARY) {
  const key = c.toLowerCase().split(" ").slice(0, 3).join(" ");
  (byOpening[key] ||= []).push(c);
}
const collisions = Object.entries(byOpening).filter(([, v]) => v.length > 2);
if (collisions.length) {
  console.log("  note: repeated openings (not fatal, but check for sameness)");
  collisions.forEach(([k, v]) => console.log(`         "${k}..." x${v.length}`));
} else {
  ok("no repetitive openings");
}

console.log("\nLength (app font tiers)");
const tiers = { "20pt (<40)": 0, "18pt (40-69)": 0, "16pt (70-99)": 0, "14pt (100+)": 0 };
let longest = "";
for (const c of CHALLENGE_LIBRARY) {
  if (c.length > longest.length) longest = c;
  if (c.length < 40) tiers["20pt (<40)"]++;
  else if (c.length < 70) tiers["18pt (40-69)"]++;
  else if (c.length < 100) tiers["16pt (70-99)"]++;
  else tiers["14pt (100+)"]++;
}
for (const [t, n] of Object.entries(tiers)) console.log(`  ${t.padEnd(14)} ${String(n).padStart(3)}`);
console.log(`  longest: ${longest.length} chars  "${longest}"`);
const overLong = CHALLENGE_LIBRARY.filter((c) => c.length > HARD_MAX);
overLong.length
  ? overLong.forEach((c) => fail(`${c.length} chars, over ${HARD_MAX}: "${c}"`))
  : ok(`every entry within ${HARD_MAX} characters`);

console.log("\nStyle");
const emDash = CHALLENGE_LIBRARY.filter((c) => c.includes("—"));
emDash.length ? emDash.forEach((c) => fail(`em dash: "${c}"`)) : ok("no em dashes");

const noPeriod = CHALLENGE_LIBRARY.filter((c) => !c.endsWith("."));
noPeriod.length ? noPeriod.forEach((c) => fail(`no ending period: "${c}"`)) : ok("all end with a period");

const notCapitalized = CHALLENGE_LIBRARY.filter((c) => c[0] !== c[0].toUpperCase());
notCapitalized.length
  ? notCapitalized.forEach((c) => fail(`not capitalized: "${c}"`))
  : ok("all start capitalized");

// imperative check: first word should not be a pronoun or article
const badOpeners = ["you", "your", "the", "a", "an", "i", "we", "it", "this", "there"];
const notImperative = CHALLENGE_LIBRARY.filter((c) =>
  badOpeners.includes(c.split(" ")[0].toLowerCase())
);
notImperative.length
  ? notImperative.forEach((c) => fail(`not imperative: "${c}"`))
  : ok("all phrased as instructions");

console.log("\nInterleaving");
const catOf = new Map();
for (const [name, list] of catEntries) for (const c of list) catOf.set(c, name);
let adjacent = 0;
for (let i = 1; i < CHALLENGE_LIBRARY.length; i++) {
  if (catOf.get(CHALLENGE_LIBRARY[i]) === catOf.get(CHALLENGE_LIBRARY[i - 1])) adjacent++;
}
adjacent === 0
  ? ok("no two consecutive days share a theme")
  : console.log(`  note: ${adjacent} adjacent same-theme pairs (tail of longer categories)`);

console.log("\nCoverage");
console.log(`  ${CHALLENGE_LIBRARY.length} challenges = ${(CHALLENGE_LIBRARY.length / 365).toFixed(2)} years before any repeat`);

console.log(
  failures === 0
    ? `\nPASS. ${CHALLENGE_LIBRARY.length} challenges, no problems found.\n`
    : `\nFAILED with ${failures} problem(s).\n`
);
process.exit(failures === 0 ? 0 : 1);
