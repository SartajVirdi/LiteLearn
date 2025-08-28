import React from "react";
import { Link } from "react-router-dom";
import lessons from "../data/lessons.json";
import { getLang } from "../i18n";
import { isCompleted } from "../progress";

export default function LessonList() {
  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Lessons</h2>
      <p style={{ opacity: .8, marginTop: 0 }}>
        Works offline. Your progress saves on this device.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lessons.filter(l => l.language === getLang()).map(l => (
          <li key={l.id} style={{
            border: "1px solid #333", borderRadius: 12, padding: 16, marginBottom: 12
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{l.title}</strong>
                {isCompleted(l.id) && <span style={{ marginLeft: 8, fontSize: 12, padding: "2px 8px", border: "1px solid #5c5", borderRadius: 999 }}>
                  ✓ Completed
                </span>}
              </div>
              <Link to={`/lesson/${l.id}`} style={{ textDecoration: "none" }}>
                <button>Open</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
