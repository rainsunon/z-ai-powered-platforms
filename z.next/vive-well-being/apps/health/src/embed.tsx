import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import DocumentsPage from "./pages/DocumentsPage";
import "./index.css";

type EmbedProps = {
  basePath?: string;
};

function HealthDashboardEmbed({ basePath = "/health" }: EmbedProps) {
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export { HealthDashboardEmbed };
export { DashboardPage, CalendarPage, DocumentsPage };

export default HealthDashboardEmbed;

const rootEl = document.getElementById("health-dashboard-root");
if (rootEl) {
  const basePath = rootEl.dataset.basePath || "/health";
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <HealthDashboardEmbed basePath={basePath} />
    </React.StrictMode>
  );
}
