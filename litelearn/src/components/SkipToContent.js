import React, { useState } from "react";

export default function SkipToContent() {
  const [visible, setVisible] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    const main = document.getElementById("main");
    if (main) {
      main.focus();              // 👈 move keyboard focus
      main.scrollIntoView({      // 👈 ensure it's scrolled into view
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
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