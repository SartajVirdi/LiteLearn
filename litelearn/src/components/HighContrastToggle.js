import React, { useEffect, useState } from "react";

const KEY = "litelearn_high_contrast";

export default function HighContrastToggle() {
  const [on, setOn] = useState(() => localStorage.getItem(KEY) === "1");

  useEffect(() => {
    document.body.classList.toggle("high-contrast", on);
    localStorage.setItem(KEY, on ? "1" : "0");
  }, [on]);

  return (
    <button
      onClick={() => setOn(v => !v)}
      aria-pressed={on}
      aria-label="Toggle high-contrast mode"
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 1000,
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #333",
        background: on ? "#000" : "#fff",
        color: on ? "#fff" : "#000",
        cursor: "pointer"
      }}
    >
      {on ? "HC ✓" : "HC"}
    </button>
  );
}