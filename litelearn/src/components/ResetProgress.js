import React from "react";
import { clearProgress } from "../progress";

export default function ResetProgress() {
  const handleReset = () => {
    if (!window.confirm("Reset all local progress? This will clear completion and reload.")) return;

    clearProgress();

    // also clear "Later" spaced repetition keys
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("mastery:")) localStorage.removeItem(k);
    });

    window.location.reload();
  };

  return (
    <button
      onClick={handleReset}
      aria-label="Reset all local progress"
      title="Reset progress"
      className="floating-btn reset-btn"
    >
      Reset progress
    </button>
  );
}
