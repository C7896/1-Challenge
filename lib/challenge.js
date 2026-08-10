import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { FALLBACK_CHALLENGES, COLORS, MONTHS } from "../constants/fallbackChallenges";

const TIMEOUT_MS = 8000;

function withTimeout(promise) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error("timed out")), TIMEOUT_MS);
        }),
    ]);
}

export function todayParts(now = new Date()) {
    const day = now.getDate();
    const month = MONTHS[now.getMonth()];
    const year = now.getFullYear();
    return { day, month, year, key: `${year}-${month}-${day}` };
}

// deterministic per calendar day, identical all day, different each day, no randomness
export function fallbackChallengeFor(now = new Date()) {
    const { day, month, year } = todayParts(now);
    const idx = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), day) / 86400000) % FALLBACK_CHALLENGES.length;
    return { id: `local-${idx}`, day, month, year, color: COLORS[idx % COLORS.length], challenge: FALLBACK_CHALLENGES[idx] };
}

// NEVER returns an undefined challenge.
// uid may be null (no signed-in user) in which case completed is always false.
// returns { challenge, completed, streak, source: "firestore" | "fallback" }
export async function loadToday(db, uid) {
    const { day, month, year, key } = todayParts();

    let challenge;
    let source = "fallback";

    try {
        const challengesRef = collection(db, "challenges");
        const q = query(challengesRef, where("day", "==", day), where("month", "==", month), where("year", "==", year));
        const querySnapshot = await withTimeout(getDocs(q));
        querySnapshot.forEach((docSnap) => {
            challenge = { id: docSnap.id, ...docSnap.data() };
        });
        if (challenge) {
            source = "firestore";
        }
    } catch (error) {
        console.error("Error getting today's challenge: ", error);
    }

    if (!challenge) {
        challenge = fallbackChallengeFor();
        source = "fallback";
    }

    let completed = false;
    if (uid != null) {
        try {
            const journalRef = doc(db, "users", uid, "journals", key);
            const docSnapshot = await withTimeout(getDoc(journalRef));
            completed = docSnapshot.exists();
        } catch (error) {
            console.error("Error checking today's journal: ", error);
            completed = false;
        }
    }

    const streak = await loadStreak(db, uid);

    return { challenge, completed, streak, source };
}

export async function loadStreak(db, uid) {
    if (uid == null) {
        return 0;
    }
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await withTimeout(getDoc(userRef));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.current_streak ?? 0;
        }
        return 0;
    } catch (error) {
        console.error("Error getting user's streak: ", error);
        return 0;
    }
}
