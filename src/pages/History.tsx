import { useTrades } from "../hooks/useTrades";
import { useCurrency } from "../context/CurrencyContext";
import { useTranslation } from "react-i18next";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function History() {
  const { trades, loading } = useTrades();
  const { format } = useCurrency();
  const { t } = useTranslation();

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
  {t("history.loading")}
</p>
    );
  }

  return (
    <div>
     <h2 className="text-2xl font-bold">{t("history.title")}</h2>
<p className="mt-1 text-gray-500 dark:text-gray-400">
  {t("history.subtitle")}
</p>

      {trades.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          {t("history.empty")}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="py-2 pr-4">{t("history.columns.date")}</th>
<th className="py-2 pr-4">{t("history.columns.symbol")}</th>
<th className="py-2 pr-4">{t("history.columns.type")}</th>
<th className="py-2 pr-4">{t("history.columns.shares")}</th>
<th className="py-2 pr-4">{t("history.columns.price")}</th>
<th className="py-2 pr-4">{t("history.columns.total")}</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
  <tr
    key={trade.id}
    className="border-b border-gray-100 dark:border-gray-800"
  >
    <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">
      {formatDate(trade.timestamp)}
    </td>
    <td className="py-2 pr-4 font-medium">{trade.symbol}</td>
    <td className="py-2 pr-4">
      <span
        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
          trade.type === "buy"
            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
        }`}
      >
        {trade.type === "buy" ? t("history.buy") : t("history.sell")}
      </span>
    </td>
    <td className="py-2 pr-4">{trade.shares}</td>
    <td className="py-2 pr-4">{format(trade.price)}</td>
    <td className="py-2 pr-4">{format(trade.total)}</td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;
