import React from "react";
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import LanguageSwitch from "./components/LanguageSwitch";
import LessonList from "./components/LessonList";
import LessonView from "./components/LessonView";
import OfflineBadge from "./components/OfflineBadge";
import HighContrastToggle from "./components/HighContrastToggle";
import SkipToContent from "./components/SkipToContent";
import ClearImportedLessons from "./components/ClearImportedLessons";
import ResetProgress from "./components/ResetProgress";
import InstallPrompt from "./components/InstallPrompt";

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip link for screen readers & keyboard users */}
      <SkipToContent />

      <header style={{ textAlign: "center", paddingTop: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="LiteLearn logo"
            width="36"
            height="36"
            style={{ borderRadius: 8 }}
          />
          <h1 style={{ margin: 0 }}>{config.appName}</h1>
        </div>

        <p style={{ marginTop: 6, opacity: 0.8 }}>
          Learn anytime, anywhere — even offline 🚀
        </p>

        {/* Fixed-position controls (top-left / top-right) */}
        <LanguageSwitch />
        <HighContrastToggle />
      </header>

      {/* Main content area is target of the skip link */}
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<LessonList />} />
          <Route path="/lesson/:id" element={<LessonView />} />
        </Routes>
      </main>

      {/* Extra utilities */}
      <OfflineBadge />
      <InstallPrompt />
      <ClearImportedLessons />
      <ResetProgress />

      <footer style={{ textAlign: "center", opacity: 0.6, fontSize: 12, padding: 24 }}>
        v{config.version}
      </footer>
    </BrowserRouter>
  );
}
