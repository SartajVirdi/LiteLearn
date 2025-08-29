import React, { useEffect, useState } from "react";

export default function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine);

  // system dark mode?
  const prefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(prefersDark());

  // your high-contrast toggle (adds body.high-contrast)
  const isHighContrast =
    typeof document !== "undefined" &&
    document.body.classList.contains("high-contrast");

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = (e) => setIsDark(e.matches);
    mq?.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      mq?.removeEventListener?.("change", onChange);
    };
  }, []);

  // Strong, high-contrast colors
  const accent = online
    ? (isDark ? "#7DFF9A" : "#0F8A00")   // green
    : (isDark ? "#FF9B9B" : "#B00020");  // red

  let bg, border, color, shadow;
  if (isHighContrast) {
    bg = "transparent";
    border = "#FFF";
    color = "#FFF";
    shadow = "none";
  } else if (isDark) {
    bg = "#1a1a1a";
    border = "#444";
    color = "#FFF";
    shadow = "0 2px 10px rgba(0,0,0,0.4)";
  } else {
    // ✅ very readable on white backgrounds
    bg = "#FFFFFF";
    border = "#222";
    color = "#111";
    shadow = "0 2px 10px rgba(0,0,0,0.15)";
  }

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        padding: "8px 12px",
        borderRadius: 16,
        border: '1px solid ${border}',
        background: bg,
        color,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: shadow,
        zIndex: 1000,
      }}
      title={online ? "Online" : "Offline: cached content available"}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: accent,
          display: "inline-block",
        }}
      />
      {online ? "Online ✓" : "Offline • content available"}
    </div>
  );
}