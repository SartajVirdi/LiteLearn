import React from "react";
import { getLang, setLang } from "../i18n";
import config from "../config";

export default function LanguageSwitch() {
  const current = getLang();
  return (
    <div style={{ textAlign: "center", marginTop: 8 }}>
      <span style={{ fontSize: 12, opacity: .8, marginRight: 8 }}>Language:</span>
      {config.supportedLanguages.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={`Switch language to ${l}`}
          style={{
            margin: "0 4px", padding: "6px 10px", borderRadius: 12,
            border: current === l ? "2px solid #222" : "1px solid #999",
            background: current === l ? "#fff" : "transparent", cursor: "pointer"
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
