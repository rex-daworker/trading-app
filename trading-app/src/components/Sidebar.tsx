import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LineChart, Newspaper, Settings } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Analytics', to: '/analytics', icon: LineChart },
  { label: 'News', to: '/news', icon: Newspaper },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function greetingForHour(h: number) {
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function Sidebar() {
  const { profile } = useProfile()
  const { user } = useAuth()

  const firstName =
    profile?.fullName?.trim().split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const face = profile?.avatar === 'woman' ? '👩' : profile?.avatar === 'man' ? '👨' : '🧑'
  const greeting = greetingForHour(new Date().getHours())

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 px-3 text-lg font-bold">TradeFlow</div>

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl dark:bg-blue-900">
          <span>{face}</span>
          <span className="absolute -bottom-1 -right-1 animate-wave text-sm">👋</span>
        </div>
        <div className="min-w-0">
          <div className="text-xs text-gray-500 dark:text-gray-400">{greeting},</div>
          <div className="truncate text-sm font-medium">{firstName}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                isActive
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar