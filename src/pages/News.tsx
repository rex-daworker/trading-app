import { useQuotes } from "../hooks/useQuotes";
import { useCompanyNews } from "../hooks/useCompanyNews";
import { useWatchlist } from "../context/WatchlistContext";

interface Mover {
  symbol: string;
  dp: number;
}

function timeAgo(unixSeconds: number) {
  const diff = Date.now() / 1000 - unixSeconds;
  const hours = Math.floor(diff / 3600);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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

  return (
    <div>
      <h2 className="text-2xl font-bold">News</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Latest headlines for your biggest movers
      </p>

      {symbols.length === 0 && (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          Add stocks on the Dashboard to see their news here.
        </p>
      )}

      {symbols.length > 0 && movers.length === 0 && (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          Finding your top movers…
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
                <p className="mt-2 text-sm text-gray-400">Loading news…</p>
              )}
              {result?.isError && (
                <p className="mt-2 text-sm text-red-600">
                  Couldn't load news for {m.symbol}.
                </p>
              )}
              {result && !result.isPending && articles.length === 0 && (
                <p className="mt-2 text-sm text-gray-400">No recent news.</p>
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
                        {a.source} · {timeAgo(a.datetime)}
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
