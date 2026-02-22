import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Components
import Navbar from "./components/Navbar";

// Pages
import TestPage from "./pages/TestPage";

const App = () => {
  const location = useLocation();

  // Logic to Hide Footer on dashboard pages
  const isChatPage = location.pathname === "/chat";
  const isDashboard = location.pathname === "/lawyer-dashboard" || location.pathname === "/admin";
  const hideFooter = isChatPage || isDashboard;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 relative overflow-x-hidden flex flex-col">

      {/* NAVBAR (Always Visible) */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className={hideFooter ? "h-[calc(100vh-80px)] pt-20" : "flex-grow pt-20"}>
        <Routes>
          {/* --- TEST ROUTE --- */}
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      
    </div>
  );
};

export default App;
