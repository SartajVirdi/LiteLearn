// src/components/TeacherImport.js
import React from "react";
import Papa from "papaparse";

export default function TeacherImport({ onAdd }) {
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Utility to clean values (trim + remove BOM if present)
    const clean = (val) =>
      val ? String(val).trim().replace(/^\uFEFF/, "") : "";

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const generated = data
          .filter((row) => row && Object.keys(row).length > 0) // ensure not empty
          .map((row, i) => {
            const id = clean(row.id) || `teacher-${Date.now()}-${i}`;
            const lang = clean(row.language || "en").toLowerCase();

            return {
              id,
              // Use provided group or derive by stripping -en/-hi suffix from id
              group: clean(row.group) || id.replace(/-(en|hi)$/i, ""),
              language: lang,

              // Subject & chapter support (with sensible defaults)
              subjectId: clean(row.subjectId) || "general",
              subjectTitle: clean(row.subjectTitle) || "General",
              chapterId: clean(row.chapterId) || "general",
              chapterTitle: clean(row.chapterTitle) || "General",
              order: row.order ? Number(row.order) : 999,

              title: clean(row.title) || `Teacher Lesson ${i + 1}`,
              content: clean(row.content),
              quiz: {
                // accept either quiz.question OR question
                question: clean(row["quiz.question"] || row.question),
                options: [
                  clean(row["quiz.option1"]),
                  clean(row["quiz.option2"]),
                  clean(row["quiz.option3"]),
                ].filter(Boolean), // remove empty
                answerIndex: Number(
                  row["quiz.answerIndex"] ?? row.answerIndex ?? 0
                ),
              },
            };
          });

        if (generated.length === 0) {
          alert("No lessons found in CSV. Check column headers.");
          return;
        }

        onAdd(generated);

        // reset input so the same file can be re-uploaded
        e.target.value = "";
      },
      error: (err) => {
        alert("CSV parse failed: " + err.message);
      },
    });
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label
        htmlFor="csv-upload"
        style={{
          display: "inline-block",
          padding: "8px 12px",
          border: "1px solid #333",
          borderRadius: 12,
          cursor: "pointer",
        }}
        aria-label="Upload CSV to add lessons"
        title="Upload CSV to add lessons"
      >
        Upload CSV (Teacher)
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv,text/csv"
        onChange={handle}
        style={{ display: "none" }}
      />
    </div>
  );
}
