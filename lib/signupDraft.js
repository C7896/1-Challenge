let draft = { email: "", password: "" };
export function setDraft(next) { draft = { ...draft, ...next }; }
export function getDraft() { return draft; }
export function clearDraft() { draft = { email: "", password: "" }; }
