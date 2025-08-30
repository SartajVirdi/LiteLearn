import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadPacks } from "../packLoader";
import { getLang } from "../i18n";
import { markCompleted } from "../progress";
import { updateMastery } from "../adapt";
import TTS from "./TTS";

export default function LessonView() {
  const { id } = useParams();
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const lang = getLang();

  useEffect(() => {
    // 1) load cached lessons first (instant + offline)
    const cached = localStorage.getItem("litelearn_lessons");
    if (cached) {
      try {
        setAllLessons(JSON.parse(cached));
        setLoading(false);
      } catch {
        /* ignore bad cache */
      }
    }
    // 2) refresh from packs (updates cache)
    loadPacks()
      .then((ls) => {
        setAllLessons(ls);
        localStorage.setItem("litelearn_lessons", JSON.stringify(ls));
      })
      .catch(() => {
        /* keep cache if fetch fails */
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper: find by id → then pick same group in current language (fallback to EN/any)
  const lesson = useMemo(() => {
    if (!allLessons.length) return null;
    const byId = allLessons.find((l) => l.id === id);
    if (!byId) return null;
    const group = byId.group || byId.id;

    // exact language match
    const exact = allLessons.find(
      (l) => (l.group || l.id) === group && l.language === lang
    );
    if (exact) return exact;

    // fallback to English, then any in the group
    return (
      allLessons.find(
        (l) => (l.group || l.id) === group && l.language === "en"
      ) || byId
    );
  }, [allLessons, id, lang]);

  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  if (loading && !lesson) {
    return <div style={{ padding: 24 }}>Loading lesson…</div>;
  }
  if (!lesson) {
    return <div style={{ padding: 24 }}>Lesson not found.</div>;
  }

  const isCorrect = selected === lesson.quiz.answerIndex;

  return (
    <main id="main" style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <Link to="/" aria-label="Go back to lesson list" style={{ textDecoration: "none" }}>
        ← Back
      </Link>

      <h1 style={{ marginBottom: 12 }}>
        {lesson.title} <TTS text={lesson.content} />
      </h1>

      <p style={{ lineHeight: 1.6 }}>{lesson.content}</p>

      <section
        aria-labelledby="quiz-heading"
        style={{
          marginTop: 24,
          border: "1px solid #333",
          borderRadius: 12,
          overflow: "hidden"
        }}
      >
        {/* Title bar */}
        <div
          id="quiz-heading"
          style={{
            background: "var(--card-header, #f0f0f0)",
            padding: "10px 16px",
            borderBottom: "1px solid #333",
            fontSize: "16px"
          }}
        >
          Test Yourself
        </div>

        <div style={{ padding: 16 }}>
          <p style={{ marginTop: 0 }}>{lesson.quiz.question}</p>

          {lesson.quiz.options.map((opt, idx) => (
            <label
              key={idx}
              style={{ display: "block", marginBottom: 8, cursor: "pointer" }}
            >
              <input
                type="radio"
                name="quiz"
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                aria-label={`Option ${idx + 1}: ${opt}`}
                style={{ marginRight: 8 }}
              />
              {opt}
            </label>
          ))}

          <button
            onClick={() => {
              setChecked(true);
              updateMastery(`${lesson.id}-q1`, isCorrect);
              if (isCorrect) markCompleted(lesson);
            }}
            disabled={selected === null}
            style={{ marginTop: 8 }}
            aria-label="Check selected quiz answer"
          >
            Check answer
          </button>

          {checked && (
            <p style={{ marginTop: 12, fontWeight: "bold" }}>
              {isCorrect
                ? "✅ Correct! Marked as completed."
                : "❌ Not quite. Try another option."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
