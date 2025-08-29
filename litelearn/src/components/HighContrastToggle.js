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
      style={{ marginLeft: 8 }}
      title="High-contrast mode"
    >
      {on ? "🌓 High Contrast: ON" : "🌓 High Contrast: OFF"}
    </button>
  );
}