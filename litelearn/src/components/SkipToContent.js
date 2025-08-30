import React from "react";

export default function SkipToContent() {
  return (
    <a
      href="#main"
      style={{
        position: "absolute",
        left: -9999,
        top: 0,
        background: "#fff",
        color: "#000",
        padding: "8px 12px",
        border: "1px solid #000",
        borderRadius: 8,
        zIndex: 2000
      }}
      onFocus={(e) => { e.target.style.left = "12px"; }}
      onBlur={(e) => { e.target.style.left = "-9999px"; }}
    >
      Skip to main content
    </a>
  );
}
