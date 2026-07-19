import { useEffect, useState } from "react";
import type { Stock, WatchlistEntry } from "../types/stock";
import { useQuote } from "../hooks/useQuote";
import { useCandles } from "../hooks/useCandles";
import StockCard from "./StockCard";
import PriceChart from "./PriceChart";
import type { PricePoint } from "./PriceChart";
import CandlestickChart from "./CandlestickChart";
import AlertBell from "./AlertBell";
import Skeleton from "./Skeleton";
import { useCurrency } from "../context/CurrencyContext";

interface WatchlistItemProps {
  entry: WatchlistEntry;
  onRemove?: () => void;
}

const boxClasses =
  "w-52 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800";

function WatchlistItem({ entry, onRemove }: WatchlistItemProps) {
  const {
    data: quote,
    isPending,
    isError,
    dataUpdatedAt,
  } = useQuote(entry.symbol);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [chartMode, setChartMode] = useState<"live" | "daily">("live");
  const { format } = useCurrency();

  const {
    data: candles,
    isPending: candlesPending,
    isError: candlesError,
    error: candlesErrorObj,
  } = useCandles(entry.symbol, expanded && chartMode === "daily");

  useEffect(() => {
    if (!quote) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing chart history from live external quote data via updater function, not an unguarded sync
    setHistory((prev) => {
      const seeded =
        prev.length === 0 ? [{ t: dataUpdatedAt - 1, price: quote.pc }] : prev;
      return [...seeded, { t: dataUpdatedAt, price: quote.c }].slice(-60);
    });
  }, [dataUpdatedAt, quote]);

  if (isPending) {
    return (
      <div className={boxClasses}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-3 w-24" />
        <Skeleton className="mt-3 h-6 w-28" />
        <Skeleton className="mt-2 h-3 w-16" />
        <Skeleton className="mt-3 h-8 w-24" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${boxClasses} text-red-600`}>
        Couldn't load {entry.symbol}
      </div>
    );
  }

  const stock: Stock = {
    symbol: entry.symbol,
    name: entry.name,
    currency: entry.currency,
    price: quote.c,
    changePercent: quote.dp,
  };
  const isUp = stock.changePercent >= 0;

  return (
    <StockCard
      stock={stock}
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      onRemove={onRemove}
    >
      {expanded && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChartMode("live");
                }}
                className={`rounded-md border px-2 py-0.5 text-xs ${
                  chartMode === "live"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-gray-300 text-gray-500 dark:border-gray-600"
                }`}
              >
                Live
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChartMode("daily");
                }}
                className={`rounded-md border px-2 py-0.5 text-xs ${
                  chartMode === "daily"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-gray-300 text-gray-500 dark:border-gray-600"
                }`}
              >
                Daily
              </button>
            </div>
            <AlertBell symbol={entry.symbol} currentPrice={quote.c} />
          </div>

          {chartMode === "live" ? (
            <>
              <PriceChart data={history} up={isUp} />
              <p className="mt-1 text-xs text-gray-400">
                Live — a new point every 15s
              </p>
            </>
          ) : candlesPending ? (
            <div className="flex h-64 items-center justify-center text-xs text-gray-400">
              Loading daily candles…
            </div>
          ) : candlesError ? (
            <div className="flex h-64 items-center justify-center text-center text-xs text-red-500">
              {candlesErrorObj instanceof Error
                ? candlesErrorObj.message
                : "Couldn't load candle data"}
            </div>
          ) : candles ? (
            <CandlestickChart data={candles} format={format} />
          ) : null}
        </div>
      )}
    </StockCard>
  );
}

export default WatchlistItem;
