import React, { useState } from "react";

export default function SkipToContent() {
  const [visible, setVisible] = useState(false);

  return (
    <a
      href="#main"
      style={{
        position: "absolute",
        left: visible ? "12px" : "-9999px",
        top: "12px",
        background: "#fff",
        color: "#000",
        padding: "8px 12px",
        border: "1px solid #000",
        borderRadius: 8,
        zIndex: 2000
      }}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      Skip to main content
    </a>
  );
}
