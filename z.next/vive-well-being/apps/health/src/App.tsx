import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import { Activity, Calendar, FileText, LayoutDashboard } from "lucide-react";
import { cn } from "./lib/utils";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import DocumentsPage from "./pages/DocumentsPage";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Documents", icon: FileText, path: "/documents" },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-black/5 p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2.5 mb-10 px-1">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter">VIVE</span>
              <span className="text-sm font-semibold ml-1 text-muted-foreground">health</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all",
                    isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <header className="md:hidden flex items-center gap-2 p-4 bg-white border-b sticky top-0 z-50">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white w-4 h-4" />
          </div>
          <span className="font-black tracking-tighter">VIVE</span>
          <span className="text-sm font-semibold text-muted-foreground">health</span>
          <nav className="ml-auto flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
