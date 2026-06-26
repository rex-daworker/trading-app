import { Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'

function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-3 border-b border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
          {user && <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>}
          <button
            onClick={toggleTheme}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={logout}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Log out
          </button>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout