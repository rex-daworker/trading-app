import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      </Layout>
    )
  }

  return <Layout>{user ? <Dashboard /> : <AuthPage />}</Layout>
}

export default App