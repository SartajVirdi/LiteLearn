import React from "react";
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import LanguageSwitch from "./components/LanguageSwitch";
import LessonList from "./components/LessonList";
import LessonView from "./components/LessonView";
import OfflineBadge from "./components/OfflineBadge";
import HighContrastToggle from "./components/HighContrastToggle";
import SkipToContent from "./components/SkipToContent";

export default function App() {
  return (
    <BrowserRouter>
      <SkipToContent />

      <header style={{ textAlign: "center", paddingTop: 28 }}>
        <h1 style={{ margin: 0 }}>{config.appName}</h1>
        <p style={{ marginTop: 6, opacity: 0.8 }}>
          Learn anytime, anywhere — even offline 🚀
        </p>
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

      <footer style={{ textAlign: "center", opacity: 0.6, fontSize: 12, padding: 24 }}>
        v{config.version}
      </footer>
    </BrowserRouter>
  );
}