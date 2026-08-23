#!/usr/bin/env node
// Regenerates constants/googleAuth.js from GoogleService-Info.plist, and fails
// if they have drifted. Run after replacing the plist from Firebase.
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const plist = readFileSync(resolve(ROOT, "GoogleService-Info.plist"), "utf8");
const read = (key) => {
    const m = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`));
    if (!m) throw new Error(`${key} missing from GoogleService-Info.plist`);
    return m[1];
};

const body = `// Generated from GoogleService-Info.plist by scripts/sync-google-auth.mjs.
// The iOS client id is public: it already ships inside the plist in the binary.
// Kept here because Metro cannot import a plist directly, and hardcoding it in
// two places is how the JS and the native SDK end up disagreeing.
export const GOOGLE_IOS_CLIENT_ID = "${read("CLIENT_ID")}";
export const GOOGLE_REVERSED_CLIENT_ID = "${read("REVERSED_CLIENT_ID")}";
`;

const target = resolve(ROOT, "constants/googleAuth.js");
const current = (() => { try { return readFileSync(target, "utf8"); } catch { return ""; } })();
if (current === body) {
    console.log("constants/googleAuth.js is in sync with the plist.");
    process.exit(0);
}
writeFileSync(target, body);
console.log("constants/googleAuth.js regenerated from the plist.");
