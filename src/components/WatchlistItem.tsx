import { useEffect, useState } from "react";
import type { Stock, WatchlistEntry } from "../types/stock";
import { useQuote } from "../hooks/useQuote";
import StockCard from "./StockCard";
import PriceChart from "./PriceChart";
import type { PricePoint } from "./PriceChart";
import Skeleton from "./Skeleton";
import AlertBell from "./AlertBell";

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
          <div className="mb-2 flex justify-end">
            <AlertBell symbol={entry.symbol} currentPrice={quote.c} />
          </div>
          <PriceChart data={history} up={isUp} />
          <p className="mt-1 text-xs text-gray-400">
            Live — a new point every 15s
          </p>
        </div>
      )}
    </StockCard>
  );
}

export default WatchlistItem;
