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
      style={{
        position: "fixed",
        bottom: 48, // stacked above ResetProgress (which is at 12)
        left: 12,
        zIndex: 1000,
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid var(--btn-border, #333)",
        background: "var(--btn-bg, #fff)",
        color: "var(--btn-text, #000)",
        cursor: "pointer"
      }}
    >
      Clear imported lessons
    </button>
  );
}