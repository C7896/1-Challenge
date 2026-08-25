#!/usr/bin/env node
// Build a demo account with a believable history, for App Store screenshots.
// Everything it writes is the same shape the app writes itself.
//
//   node scripts/seed-demo.cjs <email> <password>

const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(process.env.HOME, ".secrets", "1pc-service-account.json");
initializeApp({ credential: cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const auth = getAuth();
const db = getFirestore();

// the same abbreviations the app writes, from constants/fallbackChallenges.js
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const ENTRIES = [
    { challenge: "Pick up three pieces of litter you walk past.",
      action: "Grabbed a cup and two wrappers on the way to the bus stop.",
      reflection: "Took about a minute and the corner looked completely different." },
    { challenge: "Send a thank you to someone who helped you this year.",
      action: "Texted my old manager to say the reference actually landed me the job.",
      reflection: "She wrote back within a minute. I should do this more often." },
    { challenge: "Give up your seat or hold a door for a stranger.",
      action: "Held the lift for someone carrying a box with both hands.",
      reflection: "Small thing, but they looked genuinely relieved." },
    { challenge: "Leave a kind review for a small business you like.",
      action: "Wrote a few lines for the cafe on the corner that always remembers my order.",
      reflection: "Felt good to put something back for a place I use every week." },
    { challenge: "Check in on someone who has been quiet lately.",
      action: "Called my brother instead of texting.",
      reflection: "We talked for an hour. He needed it more than I realised." },
    { challenge: "Learn the name of someone you see often but have never asked.",
      action: "Asked the guy at the front desk. It's Marcus.",
      reflection: "Ten seconds of awkwardness for a better morning every day." },
    { challenge: "Donate one thing you have not used in a year.",
      action: "Dropped a coat off at the shelter on Fifth.",
      reflection: "It had been in the back of the wardrobe for two winters." },
];

(async () => {
    const [email, password] = process.argv.slice(2);
    if (!email || !password) {
        console.error("usage: node scripts/seed-demo.cjs <email> <password>");
        process.exit(2);
    }

    // reuse the account if it already exists so an already signed in simulator
    // stays signed in
    let user = await auth.getUserByEmail(email).catch(() => null);
    if (user) {
        const old = await db.collection("users").doc(user.uid).collection("journals").get();
        for (const d of old.docs) { await d.ref.delete(); }
        await auth.updateUser(user.uid, { password });
    } else {
        user = await auth.createUser({ email, password });
    }
    const journals = db.collection("users").doc(user.uid).collection("journals");

    // yesterday backwards, so today is still open and the Today card has
    // something to show
    const now = new Date();
    for (let i = 0; i < ENTRIES.length; i += 1) {
        const d = new Date(now);
        d.setDate(d.getDate() - (i + 1));
        const day = d.getDate();
        const month = MONTHS[d.getMonth()];
        const year = d.getFullYear();
        await journals.doc(`${year}-${month}-${day}`).set({
            day, month, year,
            ...ENTRIES[i],
            timestamp: Timestamp.fromDate(d),
        });
    }

    await db.collection("users").doc(user.uid).set({
        name: "Alex Rivera",
        username: "alex",
        current_streak: ENTRIES.length,
        longest_streak: ENTRIES.length,
        total_completed_challenges: ENTRIES.length,
    });

    console.log(JSON.stringify({ uid: user.uid, email, journals: ENTRIES.length }, null, 2));
    process.exit(0);
})().catch((e) => { console.error("seed-demo failed:", e.message); process.exit(1); });
