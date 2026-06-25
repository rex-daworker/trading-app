import { useEffect, useState } from "react";
import type { Stock, WatchlistEntry } from "../types/stock";
import { useQuote } from "../hooks/useQuote";
import StockCard from "./StockCard";
import PriceChart from "./PriceChart";
import type { PricePoint } from "./PriceChart";

interface WatchlistItemProps {
  entry: WatchlistEntry;
}

const boxClasses =
  "w-52 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800";

function WatchlistItem({ entry }: WatchlistItemProps) {
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
    setHistory((prev) => {
      const seeded =
        prev.length === 0 ? [{ t: dataUpdatedAt - 1, price: quote.pc }] : prev;
      return [...seeded, { t: dataUpdatedAt, price: quote.c }].slice(-60);
    });
  }, [dataUpdatedAt, quote]);

  if (isPending) {
    return (
      <div className={`${boxClasses} animate-pulse text-gray-400`}>
        Loading {entry.symbol}…
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
    >
      {expanded && (
        <div className="mt-3">
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
