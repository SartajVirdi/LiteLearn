import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadPacks } from "../packLoader";
import { isCompleted } from "../progress";
import { getLang } from "../i18n";
import { dueNow } from "../adapt";
import TeacherImport from "./TeacherImport";

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentLang = getLang();

  useEffect(() => {
    // Load cached packs + imports
    const cachedPacks = JSON.parse(localStorage.getItem("litelearn_packs") || "[]");
    const cachedImported = JSON.parse(localStorage.getItem("litelearn_imported") || "[]");

    if (cachedPacks.length || cachedImported.length) {
      setLessons([...cachedPacks, ...cachedImported]);
      setLoading(false);
    }

    // Always refresh packs from server
    loadPacks()
      .then((ls) => {
        localStorage.setItem("litelearn_packs", JSON.stringify(ls));
        const imports = JSON.parse(localStorage.getItem("litelearn_imported") || "[]");
        setLessons([...ls, ...imports]);
      })
      .catch(() => {
        // keep cache if fetch fails (offline, etc.)
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter by current language; fallback to English if no items
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
        const subjects = new Map(); // subjectId -> { title, chapters: Map }

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
            <h2 style={{ margin: "8px 0 12px" }}>{subj.title}</h2>

            {[...subj.chapters.entries()].map(([cId, chap]) => {
              chap.items.sort(
                (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title)
              );
              const completed = chap.items.filter(done).length;
              const total = chap.items.length;
              const pct = Math.round((completed / Math.max(1, total)) * 100);

              return (
                <article key={cId} style={{ marginBottom: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{chap.title}</h3>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        border: "1px solid #999",
                        borderRadius: 999,
                      }}
                      aria-label={`Chapter progress ${completed} of ${total}`}
                    >
                      {completed}/{total} • {pct}%
                    </span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {chap.items.map((l) => {
                      const dueKey = `${l.id}-q1`;
                      const isDue = dueNow(dueKey);
                      const completedFlag = done(l);

                      return (
                        <li
                          key={l.id}
                          className="card"
                          style={{
                            border: "1px solid #333",
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            opacity: isDue ? 1 : 0.55,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            <div>
                              <strong>{l.title}</strong>
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 12,
                                  padding: "2px 8px",
                                  border: "1px solid #999",
                                  borderRadius: 999,
                                  opacity: 0.8,
                                }}
                              >
                                {(l.language || "").toUpperCase()}
                              </span>
                              {completedFlag && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: 12,
                                    padding: "2px 8px",
                                    border: "1px solid #5c5",
                                    borderRadius: 999,
                                  }}
                                >
                                  ✓ Completed
                                </span>
                              )}
                              {!isDue && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: 12,
                                    padding: "2px 8px",
                                    border: "1px solid #aaa",
                                    borderRadius: 999,
                                    opacity: 0.8,
                                  }}
                                  title="Scheduled later by adaptive practice"
                                >
                                  Later
                                </span>
                              )}
                            </div>

                            <Link to={`/lesson/${l.id}`} style={{ textDecoration: "none" }}>
                              <button aria-label={`Open lesson ${l.title}`}>Open</button>
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

      {/* 📥 Teacher CSV Importer */}
      <TeacherImport
        onAdd={(generated) => {
          const imports = JSON.parse(localStorage.getItem("litelearn_imported") || "[]");
          const updated = [...imports, ...generated];
          localStorage.setItem("litelearn_imported", JSON.stringify(updated));

          const packs = JSON.parse(localStorage.getItem("litelearn_packs") || "[]");
          setLessons([...packs, ...updated]);
        }}
      />
    </div>
  );
}
