const BASE = process.env.PUBLIC_URL || "";

async function fetchJSON(path) {
  // ensure a single leading slash, then prefix with PUBLIC_URL (/LiteLearn)
  const url = BASE + (path.startsWith("/") ? path : "/" + path);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ${url}: ${res.status}');
  return res.json();
}

export async function loadPacks() {
  const manifest = await fetchJSON("/packs/manifest.json");
  const all = [];
  for (const p of manifest.packs) {
    // allow either "/packs/xyz.json" or "packs/xyz.json" in manifest
    const path = p.path.startsWith("/") ? p.path : "/" + p.path;
    const data = await fetchJSON(path);
    all.push(...data);
  }
  return all;
}