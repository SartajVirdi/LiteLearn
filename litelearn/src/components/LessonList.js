// src/components/LessonList.js
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
    const cached = localStorage.getItem("litelearn_lessons");
    if (cached) {
      try {
        setLessons(JSON.parse(cached));
        setLoading(false);
      } catch {}
    }

    loadPacks()
      .then((ls) => {
        setLessons(ls);
        localStorage.setItem("litelearn_lessons", JSON.stringify(ls));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter by language; fallback to English
  const toShow = useMemo(() => {
    const filtered = lessons.filter(
      (l) => (l.language || "").toLowerCase() === currentLang
    );
    return filtered.length
      ? filtered
      : lessons.filter((l) => (l.language || "").toLowerCase() === "en");
  }, [lessons, currentLang]);

  if (loading && lessons.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
        <h2>Lessons</h2>
        <p style={{ opacity: 0.8 }}>Loading content packs…</p>
      </div>
    );
  }

  // Translate badges
  const labels = {
    later: currentLang === "hi" ? "बाद में" : "Later",
    completed: currentLang === "hi" ? "पूर्ण" : "Completed",
  };

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

      {(() => {
        const subjects = new Map();

        for (const l of toShow) {
          const sId = l.subjectId || "general";
          const sTitle = l.subjectTitle || "General";
          const cId = l.chapterId || "general";
          const cTitle = l.chapterTitle || "General";

          if (!subjects.has(sId))
            subjects.set(sId, { title: sTitle, chapters: new Map() });
          const subj = subjects.get(sId);
          if (!subj.chapters.has(cId))
            subj.chapters.set(cId, { title: cTitle, items: [] });
          subj.chapters.get(cId).items.push(l);
        }

        return [...subjects.entries()].map(([sId, subj]) => (
          <section key={sId} style={{ marginBottom: 32 }}>
            <h2 style={{ margin: "8px 0 12px", borderBottom: "2px solid #ddd" }}>
              {subj.title}
            </h2>

            {[...subj.chapters.entries()].map(([cId, chap]) => {
              chap.items.sort(
                (a, b) =>
                  (a.order ?? 999) - (b.order ?? 999) ||
                  a.title.localeCompare(b.title)
              );
              const completed = chap.items.filter((l) => isCompleted(l)).length;
              const total = chap.items.length;
              const pct = Math.round((completed / Math.max(1, total)) * 100);

              return (
                <article key={cId} style={{ marginBottom: 24 }}>
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
                        fontSize: 13,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "#eee",
                      }}
                    >
                      {completed}/{total} • {pct}%
                    </span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {chap.items.map((l) => {
                      const dueKey = `${l.id}-q1`;
                      const isDue = dueNow(dueKey);
                      const completedFlag = isCompleted(l);

                      return (
                        <li
                          key={l.id}
                          className="card"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            opacity: isDue ? 1 : 0.55, // fade works for both en + hi
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 10,
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
                                    background: "#5c5",
                                    color: "#fff",
                                    borderRadius: 999,
                                  }}
                                >
                                  ✓ {labels.completed}
                                </span>
                              )}

                              {!isDue && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: 12,
                                    padding: "2px 8px",
                                    background: "#aaa",
                                    color: "#fff",
                                    borderRadius: 999,
                                  }}
                                >
                                  {labels.later}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/lesson/${l.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <button aria-label={`Open lesson ${l.title}`}>
                                Open
                              </button>
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

      <TeacherImport
        onAdd={(generated) => {
          const next = [...lessons, ...generated];
          setLessons(next);
          localStorage.setItem(
            "litelearn_lessons",
            JSON.stringify(next)
          );
        }}
      />
    </div>
  );
}
