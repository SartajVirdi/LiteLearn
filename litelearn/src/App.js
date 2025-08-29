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

export default function App() {
  return (
    <BrowserRouter>
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
          Learn anytime, anywhere — even offline
        </p>

        {/* These render as fixed controls (top-right/top-left) per their own styles */}
        <LanguageSwitch />
        <HighContrastToggle />
      </header>

      {/* Main content is target of the skip link */}
      <main id="main">
        <Routes>
          <Route path="/" element={<LessonList />} />
          <Route path="/lesson/:id" element={<LessonView />} />
        </Routes>
      </main>

      <OfflineBadge />
      <ClearImportedLessons />
      <ResetProgress />

      <footer style={{ textAlign: "center", opacity: 0.6, fontSize: 12, padding: 24 }}>
        v{config.version}
      </footer>
    </BrowserRouter>
  );
}