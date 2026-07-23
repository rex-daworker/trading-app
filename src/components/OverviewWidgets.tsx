import { useQuotes } from "../hooks/useQuotes";
import type { WatchlistEntry } from "../types/stock";
import { useTranslation } from "react-i18next";
interface OverviewWidgetsProps {
  watchlist: WatchlistEntry[];
}

interface Change {
  symbol: string;
  dp: number;
}

function Widget({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  const color =
    tone === "up"
      ? "text-green-600"
      : tone === "down"
        ? "text-red-600"
        : "text-gray-900 dark:text-gray-100";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className={`mt-1 text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function OverviewWidgets({ watchlist }: OverviewWidgetsProps) {
  const results = useQuotes(watchlist.map((e) => e.symbol));

  const changes: Change[] = results
    .map((r, i) =>
      r.data ? { symbol: watchlist[i].symbol, dp: r.data.dp } : null,
    )
    .filter((x): x is Change => x !== null);

  const tracked = watchlist.length;
  const gainer = changes.length
    ? changes.reduce((a, b) => (b.dp > a.dp ? b : a))
    : null;
  const loser = changes.length
    ? changes.reduce((a, b) => (b.dp < a.dp ? b : a))
    : null;
  const avg = changes.length
    ? changes.reduce((s, c) => s + c.dp, 0) / changes.length
    : 0;
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Widget
        label={t("dashboard.overview.stocksTracked")}
        value={String(tracked)}
      />
      <Widget
        label={t("dashboard.overview.topGainer")}
        value={
          gainer
            ? `${gainer.symbol}  ${gainer.dp >= 0 ? "+" : ""}${gainer.dp.toFixed(2)}%`
            : "—"
        }
        tone={gainer && gainer.dp >= 0 ? "up" : "neutral"}
      />
      <Widget
        label={t("dashboard.overview.topLoser")}
        value={loser ? `${loser.symbol}  ${loser.dp.toFixed(2)}%` : "—"}
        tone={loser && loser.dp < 0 ? "down" : "neutral"}
      />
      <Widget
        label={t("dashboard.overview.avgChange")}
        value={`${avg >= 0 ? "+" : ""}${avg.toFixed(2)}%`}
        tone={avg >= 0 ? "up" : "down"}
      />
    </div>
  );
}

export default OverviewWidgets;
