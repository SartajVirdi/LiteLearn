// src/progress.js
// Stores completion locally. Now supports "group-level" completion so that
// the same lesson in different languages is considered completed together.

const KEY = "litelearn_progress";

// ---------- helpers ----------
function loadSet() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSet(set) {
  localStorage.setItem(KEY, JSON.stringify([...set]));
}

// Accepts:
//  - a lesson object { id, group? }
//  - a string key (id or group)
function getGroupKey(input) {
  if (input && typeof input === "object") {
    // prefer group if present, else fallback to id
    return String(input.group || input.id);
  }
  return String(input);
}

// When we receive a lesson object, we also know its language-specific id.
// For backward compatibility we record both the group and the id so older
// UIs (if any) that check by id will still show completed.
function getAliases(input) {
  if (input && typeof input === "object") {
    const group = String(input.group || input.id);
    const id = String(input.id);
    return new Set([group, id]);
  }
  // if a plain string was passed, just use it
  return new Set([String(input)]);
}

// ---------- public API ----------

// Mark a lesson (group) as completed.
// Prefer calling with the full lesson object for best compatibility:
//   markCompleted(lesson)
export function markCompleted(input) {
  const set = loadSet();
  // add all aliases so both group and legacy id are stored
  for (const key of getAliases(input)) set.add(key);
  saveSet(set);
}

// Check if a lesson (group) is completed.
// Safe to call with a lesson object or a string key.
export function isCompleted(input) {
  const set = loadSet();
  // consider completed if either the group key or the id exists
  for (const key of getAliases(input)) {
    if (set.has(key)) return true;
  }
  return false;
}

// Clear everything (useful for debugging / a reset button)
export function clearProgress() {
  localStorage.removeItem(KEY);
}