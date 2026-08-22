#!/usr/bin/env node
// Read the server-side truth for a test account: the auth record, the users doc,
// and every journal entry. The UI is not evidence that data landed correctly, so
// tests assert against this instead.
//
// Usage:
//   node scripts/inspect-user.cjs <email>
//   node scripts/inspect-user.cjs <email> --seed '{"current_streak":3,...}'
//   node scripts/inspect-user.cjs <email> --create <password>
//   node scripts/inspect-user.cjs <email> --delete

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(process.env.HOME, ".secrets", "1pc-service-account.json");
initializeApp({ credential: cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const auth = getAuth();
const db = getFirestore();

const email = process.argv[2];
const flag = process.argv[3];
const arg = process.argv[4];

if (!email) {
    console.error("usage: node scripts/inspect-user.cjs <email> [--seed <json> | --create <password> | --delete]");
    process.exit(2);
}

async function findUser() {
    return auth.getUserByEmail(email).catch(() => null);
}

async function dump(uid) {
    const snap = await db.collection("users").doc(uid).get();
    const journals = await db.collection("users").doc(uid).collection("journals").get();
    return {
        uid,
        email,
        doc: snap.exists ? snap.data() : null,
        journalCount: journals.size,
        journals: journals.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
}

(async () => {
    if (flag === "--create") {
        const existing = await findUser();
        if (existing) {
            await auth.deleteUser(existing.uid);
        }
        const u = await auth.createUser({ email, password: arg });
        await db.collection("users").doc(u.uid).set({
            name: "Test User",
            username: "tester",
            current_streak: 0,
            longest_streak: 0,
            total_completed_challenges: 0,
        });
        console.log(JSON.stringify({ created: u.uid }, null, 2));
        process.exit(0);
    }

    const user = await findUser();

    if (flag === "--delete") {
        if (!user) {
            console.log(JSON.stringify({ deleted: false, reason: "not found" }));
            process.exit(0);
        }
        const journals = await db.collection("users").doc(user.uid).collection("journals").get();
        for (const d of journals.docs) {
            await d.ref.delete();
        }
        await db.collection("users").doc(user.uid).delete();
        await auth.deleteUser(user.uid);
        const stillThere = await findUser();
        console.log(JSON.stringify({ deleted: !stillThere, journalsRemoved: journals.size }, null, 2));
        process.exit(0);
    }

    if (!user) {
        console.log(JSON.stringify({ found: false, email }, null, 2));
        process.exit(1);
    }

    if (flag === "--seed") {
        await db.collection("users").doc(user.uid).set(JSON.parse(arg), { merge: true });
    }

    console.log(JSON.stringify(await dump(user.uid), null, 2));
    process.exit(0);
})().catch((e) => {
    console.error("inspect-user failed:", e.message);
    process.exit(1);
});
