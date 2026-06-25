import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-lg font-bold">TradeFlow</h1>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>}
          <button
            onClick={toggleTheme}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {user && (
            <button
              onClick={logout}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Log out
            </button>
          )}
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  )
}

export default Layout