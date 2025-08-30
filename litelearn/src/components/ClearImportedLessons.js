import React from "react";

export default function ClearImportedLessons() {
  const handleClear = () => {
    if (!window.confirm("Remove imported lessons? The app will reload and keep pack content.")) return;
    localStorage.removeItem("litelearn_lessons");
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