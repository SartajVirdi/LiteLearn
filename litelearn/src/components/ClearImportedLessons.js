import React from "react";

export default function ClearImportedLessons() {
  const handleClear = () => {
    if (!window.confirm("Remove imported lessons?")) return;
    localStorage.removeItem("litelearn_imported");
    window.location.reload();
  };

  return (
    <button
      onClick={handleClear}
      className="floating-btn clear-btn"
    >
      Clear imported lessons
    </button>
  );
}
