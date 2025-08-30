import React from "react";

export default function ClearImportedLessons() {
  const handleClear = () => {
    if (!window.confirm("Remove imported lessons? The app will reload.")) return;
    localStorage.removeItem("litelearn_imports");
    window.location.reload();
  };

  return (
    <button
      onClick={handleClear}
      className="floating-btn clear-btn"
      aria-label="Clear imported lessons"
    >
      Clear imported lessons
    </button>
  );
}
