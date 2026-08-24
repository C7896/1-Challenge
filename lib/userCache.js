// Last known user document, kept in memory for the session.
//
// Home and Profile both read users/{uid} when they come into focus. Without
// this they render their empty defaults first and then snap to the real values,
// which shows up as a flash of "Welcome." and "Not set" every time you switch to
// the tab. Seeding from the last known values means the screen paints correct
// the moment it appears and the fetch just confirms it.

let cache = { uid: null, data: null };

// The journal list, same idea: the log re-reads every entry when it comes into
// focus, and starting from an empty list is what made it flash and feel slow.
let journals = { uid: null, list: null };

export function getCachedUser(uid) {
    return cache.uid === uid ? cache.data : null;
}

export function setCachedUser(uid, data) {
    cache = { uid, data };
}

export function clearCachedUser() {
    cache = { uid: null, data: null };
    journals = { uid: null, list: null };
}

export function getCachedJournals(uid) {
    return journals.uid === uid ? journals.list : null;
}

export function setCachedJournals(uid, list) {
    journals = { uid, list };
}
