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
    // 1) Load from cache first (fast + offline)
    const cached = localStorage.getItem("litelearn_lessons");
    if (cached) {
      try {
        setLessons(JSON.parse(cached));
        setLoading(false);
      } catch {
        /* ignore bad cache */
      }
    }

    // 2) Fetch packs (updates cache)
    loadPacks()
      .then((ls) => {
        setLessons(ls);
        localStorage.setItem("litelearn_lessons", JSON.stringify(ls));
      })
      .catch(() => {
        // keep cache if fetch fails
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter lessons by language, fallback to English if none found
  const toShow = useMemo(() => {
    const filtered = lessons.filter((l) => l.language === currentLang);
    return filtered.length ? filtered : lessons.filter((l) => l.language === "en");
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

      {toShow.length === 0 ? (
        <p style={{ opacity: 0.8 }}>
          No lessons available in this language yet. Try switching languages.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {toShow.map((l) => {
            const dueKey = `${l.id}-q1`;
            const isDue = dueNow(dueKey);

            return (
              <li
                key={l.id}
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
                      {l.language.toUpperCase()}
                    </span>

                    {isCompleted(lgit add src/progress.js src/components/LessonView.js src/components/LessonList.js
) && (
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
      )}

      {/* 📥 Teacher CSV Importer */}
      <TeacherImport
        onAdd={(generated) => {
          const next = [...lessons, ...generated];
          setLessons(next);
          localStorage.setItem("litelearn_lessons", JSON.stringify(next));
        }}
      />
    </div>
  );
}
