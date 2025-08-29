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
        const generated = data.filter(Boolean).map((row, i) => {
          const id = row.id?.trim() || 'teacher-${Date.now()}-${i}';
          const lang = (row.language || "en").toLowerCase();

          return {
            id,
            // Use provided group or derive by stripping -en/-hi suffix from id
            group: row.group?.trim() || id.replace(/-(en|hi)$/i, ""),
            language: lang,

            // NEW: subject & chapter support (with sensible defaults)
            subjectId: row.subjectId?.trim() || "general",
            subjectTitle: row.subjectTitle?.trim() || "General",
            chapterId: row.chapterId?.trim() || "general",
            chapterTitle: row.chapterTitle?.trim() || "General",
            order: row.order ? Number(row.order) : 999,

            title: row.title?.trim() || 'Teacher Lesson ${i + 1}',
            content: row.content?.trim() || "",
            quiz: {
              // accept either quiz.question OR question
              question: row["quiz.question"]?.trim() || row.question?.trim() || "",
              options: [
                row["quiz.option1"],
                row["quiz.option2"],
                row["quiz.option3"],
              ].filter(Boolean).map(s => String(s)),
              answerIndex: Number(row["quiz.answerIndex"] ?? row.answerIndex ?? 0),
            },
          };
        });

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