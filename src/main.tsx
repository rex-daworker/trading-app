import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AlertsProvider } from "./context/AlertsContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <CurrencyProvider>
              <AuthProvider>
                <ProfileProvider>
                  <WatchlistProvider>
                    <PortfolioProvider>
                      <AlertsProvider>
                        <ToastProvider>
                          <ConfirmProvider>
                            <App />
                          </ConfirmProvider>
                        </ToastProvider>
                      </AlertsProvider>
                    </PortfolioProvider>
                  </WatchlistProvider>
                </ProfileProvider>
              </AuthProvider>
            </CurrencyProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
