const KEY = "litelearn_progress";

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function markCompleted(lessonId) {
  const p = getProgress();
  p[lessonId] = { completed: true, ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function isCompleted(lessonId) {
  const p = getProgress();
  return !!(p[lessonId] && p[lessonId].completed);
}
