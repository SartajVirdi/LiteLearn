import React from "react";
import Papa from "papaparse";

export default function TeacherImport({ onAdd }) {
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const generated = data.filter(Boolean).map((row, i) => ({
          id: row.id?.trim() || `teacher-${Date.now()}-${i}`,
          group: row.group?.trim() || `teacher-${Date.now()}-${i}`,
          language: (row.language || "en").toLowerCase(),
          subjectId: row.subjectId?.trim() || "general",
          subjectTitle: row.subjectTitle?.trim() || "General",
          chapterId: row.chapterId?.trim() || "general",
          chapterTitle: row.chapterTitle?.trim() || "General",
          order: row.order ? Number(row.order) : 999,
          title: row.title?.trim() || `Teacher Lesson ${i + 1}`,
          content: row.content?.trim() || "",
          quiz: {
            question: row["quiz.question"]?.trim() || "No quiz question provided.",
            options: [row["quiz.option1"], row["quiz.option2"], row["quiz.option3"]]
              .filter(Boolean)
              .map((s) => String(s)),
            answerIndex: Math.max(0, Number(row["quiz.answerIndex"] ?? 0)),
          },
        }));

        onAdd(generated);
        e.target.value = ""; // reset input
      },
      error: (err) => alert("CSV parse failed: " + err.message),
    });
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label htmlFor="csv-upload" style={{
        display: "inline-block",
        padding: "8px 12px",
        border: "1px solid #333",
        borderRadius: 12,
        cursor: "pointer",
      }}>
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
