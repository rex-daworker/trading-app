import { useQuotes } from "../hooks/useQuotes";
import { useCompanyNews } from "../hooks/useCompanyNews";
import { useWatchlist } from "../context/WatchlistContext";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

interface Mover {
  symbol: string;
  dp: number;
}

function timeAgo(unixSeconds: number, t: TFunction) {
  const diff = Date.now() / 1000 - unixSeconds;
  const hours = Math.floor(diff / 3600);
  if (hours < 1) return t("news.timeAgo.justNow");
  if (hours < 24) return t("news.timeAgo.hoursAgo", { hours });
  return t("news.timeAgo.daysAgo", { days: Math.floor(hours / 24) });
}

function News() {
  const { watchlist } = useWatchlist();

  const symbols = watchlist.map((e) => e.symbol);
  const quotes = useQuotes(symbols);

  const movers: Mover[] = quotes
    .map((q, i) => (q.data ? { symbol: symbols[i], dp: q.data.dp } : null))
    .filter((x): x is Mover => x !== null)
    .sort((a, b) => Math.abs(b.dp) - Math.abs(a.dp))
    .slice(0, 3);

  const moverSymbols = movers.map((m) => m.symbol);
  const newsResults = useCompanyNews(moverSymbols);
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold">{t("news.title")}</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {t("news.subtitle")}
      </p>

      {symbols.length === 0 && (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          {t("news.emptyWatchlist")}
        </p>
      )}

      {symbols.length > 0 && movers.length === 0 && (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          {t("news.findingMovers")}
        </p>
      )}

      <div className="mt-6 space-y-8">
        {movers.map((m, i) => {
          const result = newsResults[i];
          const articles = (result?.data ?? []).slice(0, 5);
          const up = m.dp >= 0;
          return (
            <section key={m.symbol}>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{m.symbol}</h3>
                <span
                  className={`text-sm ${up ? "text-green-600" : "text-red-600"}`}
                >
                  {up ? "+" : ""}
                  {m.dp.toFixed(2)}%
                </span>
              </div>

              {result?.isPending && (
                <p className="mt-2 text-sm text-gray-400">
                  {t("news.loadingNews")}
                </p>
              )}
              {result?.isError && (
                <p className="mt-2 text-sm text-red-600">
                  {t("news.loadError", { symbol: m.symbol })}
                </p>
              )}
              {result && !result.isPending && articles.length === 0 && (
                <p className="mt-2 text-sm text-gray-400">
                  {t("news.noRecentNews")}
                </p>
              )}

              <ul className="mt-2 space-y-2">
                {articles.map((a) => (
                  <li key={a.id}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {a.headline}
                      </span>
                      <div className="mt-1 text-xs text-gray-400">
                        {a.source} · {timeAgo(a.datetime, t)}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default News;
