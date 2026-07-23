import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";
import BrandWatermark from "./BrandWatermark";
import { useAlertMonitor } from "../hooks/useAlertMonitor";
import { useTranslation } from "react-i18next";

const LANGUAGE_FLAGS: Record<string, string> = {
  en: "🇺🇸",
  fi: "🇫🇮",
  sv: "🇸🇪",
};

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  useAlertMonitor();
  useEffect(() => {
  document.title = t("app.title");
}, [t, i18n.language]);

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
              <div className="flex items-center gap-1">
                {Object.entries(LANGUAGE_FLAGS).map(([lng, flag]) => (
                  <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`rounded-md px-2 py-1 text-lg ${
                      i18n.language === lng
                        ? "bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    aria-label={lng}
                  >
                    {flag}
                  </button>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
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
