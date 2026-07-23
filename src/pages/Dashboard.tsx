import WatchlistItem from "../components/WatchlistItem";
import SearchBar from "../components/SearchBar";
import OverviewWidgets from "../components/OverviewWidgets";
import { useWatchlist } from "../context/WatchlistContext";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { watchlist, addStock, removeStock } = useWatchlist();
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleRemove = async (symbol: string) => {
    const ok = await confirm({
      title: t("dashboard.removeStock.title"),
      message: t("dashboard.removeStock.message", { symbol }),
      confirmLabel: t("dashboard.removeStock.confirmLabel"),
      danger: true,
    });
    if (ok) {
      removeStock(symbol);
      showToast(t("dashboard.removeStock.toast", { symbol }), "info");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">{t("dashboard.title")}</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        {t("dashboard.subtitle")}
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
