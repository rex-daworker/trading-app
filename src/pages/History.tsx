import { useTrades } from "../hooks/useTrades";
import { useCurrency } from "../context/CurrencyContext";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function History() {
  const { trades, loading } = useTrades();
  const { format } = useCurrency();

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading your trade history…
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">History</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Your full trade log
      </p>

      {trades.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          No trades yet. Head to the Dashboard to make your first trade.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Symbol</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    {formatDate(t.timestamp)}
                  </td>
                  <td className="py-2 pr-4 font-medium">{t.symbol}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        t.type === "buy"
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {t.type === "buy" ? "Buy" : "Sell"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{t.shares}</td>
                  <td className="py-2 pr-4">{format(t.price)}</td>
                  <td className="py-2 pr-4">{format(t.total)}</td>
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
