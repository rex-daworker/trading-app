import { useAlerts } from "../context/AlertsContext";

function Alerts() {
  const { alerts, removeAlert } = useAlerts();

  return (
    <div>
      <h2 className="text-2xl font-bold">Alerts</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Manage your price alerts
      </p>

      <div className="mt-6 max-w-lg">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No alerts set yet. Expand a stock on the Dashboard to add one.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between bg-white px-4 py-3 text-sm dark:bg-gray-800"
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

export default Alerts;
