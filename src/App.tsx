import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import News from "./pages/News";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import Alerts from "./pages/Alerts";
import History from "./pages/History";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/news" element={<News />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
