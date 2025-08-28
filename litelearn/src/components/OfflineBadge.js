import React, { useEffect, useState } from "react";
export default function OfflineBadge() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return (
    <div aria-live="polite" style={{
      position: "fixed", right: 12, bottom: 12, padding: "6px 10px",
      borderRadius: 12, border: "1px solid", fontSize: 12,
      background: online ? "#eef" : "#fee"
    }}>
      {online ? "Online ✓" : "Offline • content available"}
    </div>
  );
}