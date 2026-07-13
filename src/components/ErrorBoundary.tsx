import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("TradeFlow crashed:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center dark:bg-gray-900">
          <AlertTriangle size={40} className="text-red-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            TradeFlow ran into an unexpected error. Your data is safe — try
            reloading the page.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reload TradeFlow
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
