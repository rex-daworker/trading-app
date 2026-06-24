import type { Stock, WatchlistEntry } from "../types/stock";
import { useQuote } from "../hooks/useQuote";
import StockCard from "./StockCard";

interface WatchlistItemProps {
  entry: WatchlistEntry;
}

const boxClasses =
  "w-52 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800";

function WatchlistItem({ entry }: WatchlistItemProps) {
  const { data: quote, isPending, isError } = useQuote(entry.symbol);

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

  return <StockCard stock={stock} />;
}

export default WatchlistItem;
