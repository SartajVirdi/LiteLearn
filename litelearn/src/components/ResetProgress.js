import React from "react";
import { clearProgress } from "../progress";

export default function ResetProgress() {
  const handleReset = () => {
    if (!window.confirm("Reset all local progress? This will clear completion and reload.")) return;
    clearProgress();
    // If you also want to clear teacher-imported lessons, uncomment next line:
    // localStorage.removeItem("litelearn_lessons");
    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      aria-label="Reset all local progress"
      title="Reset progress"
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 1000,
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #333",
        background: "#fff",
        cursor: "pointer"
      }}
    >
      Reset progress
    </button>
  );
}
