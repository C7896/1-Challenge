/**
 * Shared constants for challenge content.
 *
 * The challenge text itself lives in challengeLibrary.js, which is the single
 * source of truth for both the seeder (scripts/seed-challenges.mjs) and the
 * app's offline fallback (lib/challenge.js). Add new challenges there, then run
 * `node scripts/check-challenges.mjs`.
 */

// The .js extension is required: Metro resolves extensionless imports but the
// Node scripts in scripts/ run as real ESM, which does not.
import { CHALLENGE_LIBRARY } from "./challengeLibrary.js";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// palette the app already cycles through
export const COLORS = ["#FF815E", "#FFCF5B", "#DCE18B", "#A1D5AE", "#92C1D2", "#4969A9"];

export const FALLBACK_CHALLENGES = CHALLENGE_LIBRARY;
