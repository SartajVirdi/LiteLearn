const KEY = "litelearn_mastery";

export function getMastery() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function updateMastery(id, correct) {
  const m = getMastery();
  const prev = m[id] || { streak: 0, nextAt: 0 };

  let streak, delay;

  if (correct) {
    streak = prev.streak + 1;
    delay = Math.min(7, Math.max(1, streak)); // days
  } else {
    streak = 0;
    delay = 0; // wrong → ask again immediately
  }

  m[id] = { streak, nextAt: Date.now() + delay * 24 * 60 * 60 * 1000 };
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function dueNow(id) {
  const m = getMastery()[id];
  return !m || Date.now() >= m.nextAt;
}