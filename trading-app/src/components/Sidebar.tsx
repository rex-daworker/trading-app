import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Settings', to: '/settings' },
]

function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 px-3 text-lg font-bold">TradeFlow</div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm ${
                isActive
                  ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar