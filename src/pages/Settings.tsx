import { useState } from "react";
import { Check } from "lucide-react";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import type { Currency } from "../context/CurrencyContext";
import { useAlerts } from "../context/AlertsContext";

const CURRENCY_META: Record<Currency, { name: string; symbol: string }> = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  NGN: { name: "Nigerian Naira", symbol: "₦" },
};

function Settings() {
  const { currency, setCurrency, rate } = useCurrency();
  const { alerts, removeAlert } = useAlerts();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );

  const requestNotifications = async () => {
    const result = await Notification.requestPermission();
    setNotifStatus(result);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display currency
        </label>

        <div className="mt-2 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
          {CURRENCIES.map((c) => {
            const selected = c === currency;
            return (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 text-center text-lg text-gray-500 dark:text-gray-400">
                    {CURRENCY_META[c].symbol}
                  </span>
                  <span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{c}</span>{" "}
                    <span className="text-gray-500 dark:text-gray-400">{CURRENCY_META[c].name}</span>
                  </span>
                </span>
                {selected && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Prices across the app are shown in {currency}
          {currency !== "USD" && ` (1 USD ≈ ${rate.toFixed(2)} ${currency})`}.
        </p>
      </div>

      <div className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notifications
        </label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {notifStatus === "granted"
            ? "Browser notifications are enabled."
            : "Enable browser notifications to get alerted when a price target hits."}
        </p>
        {notifStatus !== "granted" && (
          <button
            onClick={requestNotifications}
            className="mt-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Enable notifications
          </button>
        )}
      </div>

      <div className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price alerts
        </label>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No alerts set yet. Expand a stock on the Dashboard to add one.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{a.symbol}</span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {a.direction} {a.targetPrice} {a.triggered && "· triggered"}
                  </span>
                </span>
                <button
                  onClick={() => removeAlert(a.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Settings;
