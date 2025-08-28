export async function loadPacks() {
  const m = await fetch("/packs/manifest.json").then(r => r.json());
  const all = [];
  for (const p of m.packs) {
    const data = await fetch(p.path).then(r => r.json());
    all.push(...data);
  }
  return all;
}