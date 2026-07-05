import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined,
);

interface ConfirmState {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  const close = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => close(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {state.options.title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {state.options.title}
              </h3>
            )}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {state.options.message}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => close(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {state.options.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={() => close(true)}
                className={`rounded-md px-4 py-2 text-sm text-white ${
                  state.options.danger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {state.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (ctx === undefined) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return ctx;
}
