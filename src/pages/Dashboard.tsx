import WatchlistItem from "../components/WatchlistItem";
import SearchBar from "../components/SearchBar";
import OverviewWidgets from "../components/OverviewWidgets";
import { useWatchlist } from "../context/WatchlistContext";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../context/ToastContext";

function Dashboard() {
  const { watchlist, addStock, removeStock } = useWatchlist();
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const handleRemove = async (symbol: string) => {
    const ok = await confirm({
      title: "Remove stock",
      message: `Remove ${symbol} from your watchlist?`,
      confirmLabel: "Remove",
      danger: true,
    });
    if (ok) {
      removeStock(symbol);
      showToast(`Removed ${symbol}`, "info");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Your watchlist — live prices
      </p>

      <OverviewWidgets watchlist={watchlist} />

      <SearchBar
        onAdd={addStock}
        existingSymbols={watchlist.map((e) => e.symbol)}
      />

      <div className="flex flex-wrap gap-4">
        {watchlist.map((entry) => (
          <WatchlistItem
            key={entry.symbol}
            entry={entry}
            onRemove={() => handleRemove(entry.symbol)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
