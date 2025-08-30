// src/components/ClearImportedLessons.js
import React from "react";

export default function ClearImportedLessons() {
  const handleClear = () => {
    if (!window.confirm("Remove teacher-imported lessons? The app will reload and keep built-in packs.")) return;

    // ✅ Clear imported lessons, not built-in packs
    localStorage.removeItem("litelearn_imported");

    window.location.reload();
  };

  return (
    <button
      onClick={handleClear}
      aria-label="Clear imported lessons"
      title="Clear imported lessons"
      className="floating-btn clear-btn"
    >
      Clear imported lessons
    </button>
  );
}