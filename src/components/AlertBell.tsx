import { useState } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { useAlerts } from "../context/AlertsContext";
import { useTranslation } from "react-i18next";

interface AlertBellProps {
  symbol: string;
  currentPrice: number;
}

function AlertBell({ symbol, currentPrice }: AlertBellProps) {
  const { alerts, addAlert, removeAlert } = useAlerts();
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");

  const existing = alerts.filter((a) => a.symbol === symbol && !a.triggered);

  const handleAdd = async () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    await addAlert(symbol, price, direction);
    setTargetPrice("");
    setOpen(false);
  };
  const { t } = useTranslation();
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        aria-label={t("dashboard.alertBell.setAlertAria")}
      >
        {existing.length > 0 ? (
          <BellRing size={16} className="text-blue-500" />
        ) : (
          <Bell size={16} />
        )}
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-8 z-10 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("dashboard.alertBell.alertMeWhen")}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("dashboard.alertBell.close")}
            >
              {" "}
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          <div className="mb-2 flex gap-1">
            {(["above", "below"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`flex-1 rounded-md border px-2 py-1 text-xs ${
                  direction === d
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-gray-300 text-gray-500 dark:border-gray-600"
                }`}
              >
                {d === "above"
                  ? t("dashboard.alertBell.above")
                  : t("dashboard.alertBell.below")}
              </button>
            ))}
          </div>

          <input
            type="number"
            step="0.01"
            placeholder={t("dashboard.alertBell.targetPlaceholder", {
              price: currentPrice.toFixed(2),
            })}
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
          />

          <button
            onClick={handleAdd}
            className="w-full rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            {t("dashboard.alertBell.setAlert")}
          </button>

          {existing.length > 0 && (
            <ul className="mt-2 space-y-1">
              {existing.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                >
                  <span>
                    {a.direction} {a.targetPrice}
                  </span>
                  <button
                    onClick={() => removeAlert(a.id)}
                    className="text-red-500 hover:underline"
                  >
                    {t("alerts.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AlertBell;
