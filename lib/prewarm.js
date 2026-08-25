import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { MONTHS } from "../constants/fallbackChallenges";
import { loadToday } from "./challenge";
import { setCachedUser, setCachedJournals } from "./userCache";

// Everything the four tabs read, fetched once when the app is entered so that
// tapping a tab is a cache hit rather than a round trip. Fire and forget: it
// never blocks navigation and never surfaces an error, because every screen
// still does its own read when it comes into focus. This only decides whether
// that read is racing the user or has already finished.
export function prewarmCaches(db, uid) {
    if (db == null || uid == null) {
        return;
    }

    // today's challenge, whether it is done, and the streak: the flag tab has to
    // know all three before it can decide where to send you
    loadToday(db, uid).catch(() => {});

    // the profile tab
    getDoc(doc(db, "users", uid))
        .then((snap) => {
            if (snap.exists()) {
                setCachedUser(uid, snap.data());
            }
        })
        .catch(() => {});

    // the past challenges tab, sorted the same way the log sorts it so the
    // cached list is interchangeable with the one that screen builds
    getDocs(collection(db, "users", uid, "journals"))
        .then((q) => {
            const journals = q.docs.map((d) => ({ docId: d.id, ...d.data() }));
            const entryOrder = (j) => {
                const m = MONTHS.indexOf(j.month);
                return (j.year ?? 0) * 10000 + (m < 0 ? 0 : m) * 100 + (j.day ?? 0);
            };
            journals.sort((a, b) => entryOrder(b) - entryOrder(a));
            setCachedJournals(uid, journals);
        })
        .catch(() => {});
}
