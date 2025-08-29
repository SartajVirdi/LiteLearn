import React from "react";
import Papa from "papaparse";

export default function TeacherImport({ onAdd }) {
  const handle = e => {
    const file = e.target.files?.[0]; if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: ({ data }) => {
        const generated = data.filter(Boolean).map((row, i) => ({
          id: `teacher-${Date.now()}-${i}`,
          title: row.title || `Teacher Quiz ${i+1}`,
          language: row.language || "en",
          content: row.content || "",
          quiz: {
            question: row.question,
            options: [row.option1, row.option2, row.option3].filter(Boolean),
            answerIndex: Number(row.answerIndex || 0)
          }
        }));
        onAdd(generated);
      }
    });
  };
  return <input type="file" accept=".csv" onChange={handle} aria-label="Import CSV" />;
}
