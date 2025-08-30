import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadPacks } from "../packLoader";
import { isCompleted } from "../progress";
import { getLang } from "../i18n";
import { dueNow } from "../adapt";
import TeacherImport from "./TeacherImport";

export default function LessonList() {
  const [packs, setPacks] = useState([]);
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLang = getLang();

  useEffect(() => {
    // Load both from storage
    const cachedPacks = JSON.parse(localStorage.getItem("litelearn_packs") || "[]");
    const cachedImports = JSON.parse(localStorage.getItem("litelearn_imports") || "[]");

    if (cachedPacks.length) setPacks(cachedPacks);
    if (cachedImports.length) setImports(cachedImports);
    if (cachedPacks.length || cachedImports.length) setLoading(false);

    // Always refresh packs
    loadPacks()
      .then((ls) => {
        setPacks(ls);
        localStorage.setItem("litelearn_packs", JSON.stringify(ls));
      })
      .catch(() => { /* offline fallback */ })
      .finally(() => setLoading(false));
  }, []);

  const lessons = [...packs, ...imports];

  // Filter by language
  const toShow = useMemo(() => {
    const filtered = lessons.filter((l) => (l.language || "").toLowerCase() === currentLang);
    return filtered.length ? filtered : lessons.filter((l) => (l.language || "").toLowerCase() === "en");
  }, [lessons, currentLang]);

  if (loading && lessons.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
        <h2>Lessons</h2>
        <p style={{ opacity: 0.8 }}>Loading content packs…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Lessons</h2>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Works offline. Your progress saves on this device.
      </p>

      {/* Teacher demo CSV download */}
      <p style={{ marginTop: 6 }}>
        <a
          href={process.env.PUBLIC_URL + "/teacher-demo.csv"}
          download
          style={{ textDecoration: "none" }}
        >
          📥 Download teacher-demo.csv
        </a>
      </p>

      {/* Group by Subject -> Chapter */}
      {(() => {
        const subjects = new Map();
        for (const l of toShow) {
          const sId = l.subjectId || "general";
          const sTitle = l.subjectTitle || "General";
          const cId = l.chapterId || "general";
          const cTitle = l.chapterTitle || "General";

          if (!subjects.has(sId)) subjects.set(sId, { title: sTitle, chapters: new Map() });
          const subj = subjects.get(sId);
          if (!subj.chapters.has(cId)) subj.chapters.set(cId, { title: cTitle, items: [] });
          subj.chapters.get(cId).items.push(l);
        }

        const done = (lesson) => isCompleted(lesson);

        return [...subjects.entries()].map(([sId, subj]) => (
          <section key={sId} style={{ marginBottom: 28 }}>
            <h2>{subj.title}</h2>
            {[...subj.chapters.entries()].map(([cId, chap]) => {
              chap.items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
              const completed = chap.items.filter(done).length;
              const total = chap.items.length;
              return (
                <article key={cId} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>{chap.title}</h3>
                    <span style={{ fontSize: 12, border: "1px solid #999", borderRadius: 999, padding: "2px 8px" }}>
                      {completed}/{total}
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {chap.items.map((l) => {
                      const dueKey = `${l.id}-q1`;
                      return (
                        <li key={l.id} className="card" style={{ border: "1px solid #333", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <strong>{l.title}</strong>{" "}
                              <span style={{ fontSize: 12, border: "1px solid #999", borderRadius: 999, padding: "2px 8px" }}>
                                {(l.language || "").toUpperCase()}
                              </span>
                            </div>
                            <Link to={`/lesson/${l.id}`}>
                              <button>Open</button>
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </section>
        ));
      })()}

      {/* Teacher CSV Importer */}
      <TeacherImport
        onAdd={(generated) => {
          const updated = [...imports, ...generated];
          setImports(updated);
          localStorage.setItem("litelearn_imports", JSON.stringify(updated));
        }}
      />
    </div>
  );
}
