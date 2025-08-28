const KEY = "litelearn_lang";
export function getLang() {
  return localStorage.getItem(KEY) || "en";
}
export function setLang(lang) {
  localStorage.setItem(KEY, lang);
  window.location.reload(); // simplest refresh for hackathon
}
