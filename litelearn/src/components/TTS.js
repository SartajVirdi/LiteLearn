import React, { useEffect, useState } from "react";

export default function TTS({ text }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = () => {
    if (!supported || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!supported) return null;
  return (
    <button onClick={speak} aria-label="Read aloud" style={{ marginLeft: 8 }}>
      {speaking ? "🔊 Playing…" : "🔊 Listen"}
    </button>
  );
}