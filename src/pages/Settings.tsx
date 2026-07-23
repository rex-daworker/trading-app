import { useState } from "react";
import { Check } from "lucide-react";
import { useCurrency, CURRENCIES } from "../context/CurrencyContext";
import type { Currency } from "../context/CurrencyContext";
import { useTranslation } from "react-i18next";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

function Settings() {
  const { currency, setCurrency, rate } = useCurrency();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );

  const requestNotifications = async () => {
    const result = await Notification.requestPermission();
    setNotifStatus(result);
  };
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold">{t("settings.title")}</h2>

      <div className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("settings.currency.label")}
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
                    {CURRENCY_SYMBOLS[c]}
                  </span>
                  <span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {c}
                    </span>{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      {t(`settings.currency.names.${c}`)}
                    </span>
                  </span>
                </span>
                {selected && (
                  <Check
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t("settings.currency.priceNote", { currency })}
          {currency !== "USD" &&
            t("settings.currency.priceNoteRate", {
              rate: rate.toFixed(2),
              currency,
            })}
          .
        </p>
      </div>

      <div className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("settings.notifications.label")}
        </label>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {notifStatus === "granted"
            ? t("settings.notifications.enabled")
            : t("settings.notifications.prompt")}
        </p>
        {notifStatus !== "granted" && (
          <button
            onClick={requestNotifications}
            className="mt-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            {t("settings.notifications.enableButton")}
          </button>
        )}
      </div>
    </div>
  );
}

export default Settings;
