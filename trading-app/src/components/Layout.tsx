import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-lg font-bold">TradeFlow</h1>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}

export default Layout;
