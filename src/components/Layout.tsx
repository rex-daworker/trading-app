import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import BrandWatermark from "./BrandWatermark";

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {" "}
      <BrandWatermark />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800 md:justify-end md:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-gray-300 p-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-3">
              {user && (
                <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:inline">
                  {user.email}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
