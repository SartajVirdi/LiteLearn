import React from "react";
import { getLang, setLang } from "../i18n";
import config from "../config";

export default function LanguageSwitch() {
  const current = getLang();

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 1000,
        display: "flex",
        gap: "6px"
      }}
    >
      {config.supportedLanguages.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={'Switch language to ${l}'}
          className={current === l ? "lang-active" : "lang-inactive"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}