import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { FALLBACK_CHALLENGES, COLORS, MONTHS } from "../constants/fallbackChallenges";
import { getCachedToday, setCachedToday } from "./userCache";

const TIMEOUT_MS = 8000;

// The day's challenge cannot change during that day, so it is fetched once and
// reused. Only the "have they finished it" read has to happen every time, which
// is what made pressing the Today tab feel slow.
let challengeCache = { key: null, challenge: null, source: null };

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
// uid may be null (no signed-in user) in which case completed is false.
// completed is null when it could not be determined; callers must not treat that as false.
// returns { challenge, completed, streak, source: "firestore" | "fallback" }
export async function loadToday(db, uid, { preferCache = false } = {}) {
    const { day, month, year, key } = todayParts();

    // The tab bar has to decide where to send you before it can navigate, so on a
    // cold call it sat through the reads below. When Home has already answered
    // this for today, reuse that instead of asking again.
    if (preferCache && uid != null) {
        const cached = getCachedToday(uid, key);
        if (cached) {
            return cached;
        }
    }

    let challenge;
    let source = "fallback";

    if (challengeCache.key === key && challengeCache.challenge) {
        challenge = challengeCache.challenge;
        source = challengeCache.source;
    }

    try {
        if (challenge) {
            throw new Error("cached");
        }
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
        if (error?.message !== "cached") {
            console.error("Error getting today's challenge: ", error);
        }
    }

    if (!challenge) {
        challenge = fallbackChallengeFor();
        source = "fallback";
    }
    challengeCache = { key, challenge, source };

    // These two do not depend on each other, so they go together rather than one
    // after the other. Sequentially they were most of the wait.
    const [completed, streak] = await Promise.all([
        loadCompleted(db, uid, key),
        loadStreak(db, uid),
    ]);

    const result = { challenge, completed, streak, source };
    // never cache "unknown"; a null completed must be re-asked, not remembered
    if (uid != null && completed !== null) {
        setCachedToday(uid, key, result);
    }
    return result;
}

async function loadCompleted(db, uid, key) {
    if (uid == null) {
        return false;
    }
    try {
        const journalRef = doc(db, "users", uid, "journals", key);
        const docSnapshot = await withTimeout(getDoc(journalRef));
        return docSnapshot.exists();
    } catch (error) {
        // Unknown, not "not done". Reporting false here let a slow connection
        // send someone back into a challenge they had already written, which
        // overwrote the entry and counted the day twice.
        console.error("Error checking today's journal: ", error);
        return null;
    }
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
