import React, { useEffect, useState } from "react";

const DONT_SHOW_KEY = "litelearn_hide_install_prompt";

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If user dismissed permanently, don't show again
    if (localStorage.getItem(DONT_SHOW_KEY) === "1") return;

    const handler = (e) => {
      // prevent the mini-infobar
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferred) return null;

  const install = async () => {
    setVisible(false);
    deferred.prompt();
    await deferred.userChoice; // "accepted" | "dismissed"
    setDeferred(null);
  };

  const later = () => setVisible(false);

  const dontShowAgain = () => {
    localStorage.setItem(DONT_SHOW_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 60,          // ⬅ sit below the header
        right: 12,        // ⬅ move to top-right
        zIndex: 1000,
        border: "1px solid #333",
        borderRadius: 12,
        padding: "10px 12px",
        background: "#fff",
        color: "#000",
        boxShadow: "0 2px 10px rgba(0,0,0,.15)"
      }}
    >
      <strong>Install LiteLearn?</strong>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={install} aria-label="Install LiteLearn">Install</button>
        <button onClick={later} aria-label="Maybe later">Later</button>
        <button onClick={dontShowAgain} aria-label="Don’t show again">Don’t show</button>
      </div>
    </div>
  );
}