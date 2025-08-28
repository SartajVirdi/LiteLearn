import React from "react";
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import LessonList from "./components/LessonList";
import LessonView from "./components/LessonView";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ textAlign: "center", paddingTop: 28 }}>
        <h1 style={{ margin: 0 }}>{config.appName}</h1>
        <p style={{ marginTop: 6, opacity: .8 }}>Learn anytime, anywhere — even offline 🚀</p>
      </div>
      <Routes>
        <Route path="/" element={<LessonList />} />
        <Route path="/lesson/:id" element={<LessonView />} />
      </Routes>
      <footer style={{ textAlign: "center", opacity: .6, fontSize: 12, padding: 24 }}>
        v{config.version}
      </footer>
    </BrowserRouter>
  );
}
