import React, { useEffect, useState } from "react";

export default function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine);

  // detect dark mode (system)
  const getDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(getDark());

  // detect high-contrast (your toggle)
  const highContrast = typeof document !== "undefined" &&
    document.body.classList.contains("high-contrast");

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    const onChange = (e) => setIsDark(e.matches);
    if (mq) {
      mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    }

    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      if (mq) {
        mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
      }
    };
  }, []);

  // colors that adapt to theme + state
  let bg, border, color;
  if (highContrast) {
    bg = "transparent";
    border = "#fff";
    color = "#fff";
  } else if (isDark) {
    bg = online ? "rgba(255,255,255,0.12)" : "rgba(255,200,200,0.16)";
    border = "rgba(255,255,255,0.35)";
    color = "#fff";
  } else {
    bg = online ? "#f3f2ff" : "#fff4f4";
    border = "#cfd1ff";
    color = "#111";
  }

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        padding: "6px 10px",
        borderRadius: 16,
        border: '1px solid ${border}',
        background: bg,
        color,
        fontSize: 12,
        zIndex: 1000
      }}
    >
      {online ? "Online ✓" : "Offline • content available"}
    </div>
  );
}