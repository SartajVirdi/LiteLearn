import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import { markCompleted } from "../progress";
import TTS from "./TTS";
import { updateMastery } from "../adapt";


export default function LessonView() {
  const { id } = useParams();
  const lesson = useMemo(() => lessons.find(l => l.id === id), [id]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  if (!lesson) return <div style={{ padding: 24 }}>Lesson not found.</div>;

  const isCorrect = selected === lesson.quiz.answerIndex;

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <Link to="/" style={{ textDecoration: "none" }}>← Back</Link>
      <h2 style={{ marginBottom: 12 }}>{lesson.title}</h2>
      <p style={{ lineHeight: 1.6 }}>{lesson.content}</p>

      <div style={{ marginTop: 24, padding: 16, border: "1px solid #333", borderRadius: 12 }}>
        <strong>Quick Check</strong>
        <p style={{ marginTop: 12 }}>{lesson.quiz.question}</p>
        {lesson.quiz.options.map((opt, idx) => (
          <label key={idx} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="radio"
              name="quiz"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
              style={{ marginRight: 8 }}
            />
            {opt}
          </label>
        ))}

        <button
          onClick={() => { setChecked(true); if (isCorrect) markCompleted(lesson.id); }}
          disabled={selected === null}
          style={{ marginTop: 8 }}
        >
          Check answer
        </button>

        {checked && (
          <p style={{ marginTop: 12, fontWeight: "bold" }}>
            {isCorrect ? "✅ Correct! Marked as completed." : "❌ Not quite. Try another option."}
          </p>
        )}
      </div>
    </div>
  );
}
