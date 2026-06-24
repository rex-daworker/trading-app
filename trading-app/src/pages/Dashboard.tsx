import WatchlistItem from "../components/WatchlistItem";
import type { WatchlistEntry } from "../types/stock";

const watchlist: WatchlistEntry[] = [
  { symbol: "AAPL", name: "Apple Inc.", currency: "USD" },
  { symbol: "ASML", name: "ASML Holding", currency: "USD" },
  { symbol: "TSLA", name: "Tesla Inc.", currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA Corp.", currency: "USD" },
];

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-gray-500 dark:text-gray-400">
        Your watchlist — live prices
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        {watchlist.map((entry) => (
          <WatchlistItem key={entry.symbol} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
