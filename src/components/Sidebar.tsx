import { NavLink } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  LineChart,
  Newspaper,
  Settings,
  Bell,
  ChevronsLeft,
  History,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Analytics", to: "/analytics", icon: LineChart },
  { label: "Alerts", to: "/alerts", icon: Bell },
  { label: "History", to: "/history", icon: History },
  { label: "News", to: "/news", icon: Newspaper },
  { label: "Settings", to: "/settings", icon: Settings },
];

function greetingForHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useProfile();
  const { user } = useAuth();

  const firstName =
    profile?.fullName?.trim().split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";
  const face =
    profile?.avatar === "woman"
      ? "👩"
      : profile?.avatar === "man"
        ? "👨"
        : "🧑";
  const greeting = greetingForHour(new Date().getHours());

  return (
    <>
      {/* Backdrop — mobile only, shown when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white p-4 transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="tf-logo"
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="26" fill="url(#tf-logo)" />
              <path
                d="M22 68 L44 46 L56 56 L76 32"
                stroke="#ffffff"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M62 30 L78 30 L78 46"
                stroke="#ffffff"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-bold">TradeFlow</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            aria-label="Close menu"
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <NavLink
          to="/account"
          onClick={onClose}
          className={({ isActive }) =>
            `mb-4 flex items-center gap-3 rounded-lg p-3 transition-colors ${
              isActive
                ? "bg-blue-50 dark:bg-blue-950"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/40 dark:hover:bg-gray-700"
            }`
          }
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-blue-900">
            <span>{face}</span>
            <span className="absolute -bottom-1 -right-1 animate-wave text-sm">
              👋
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {greeting},
            </div>
            <div className="truncate text-sm font-medium">{firstName}</div>
          </div>
        </NavLink>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
