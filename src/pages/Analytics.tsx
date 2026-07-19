import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { useQuotes } from "../hooks/useQuotes";
import { useCurrency } from "../context/CurrencyContext";
import { useCountUp } from "../hooks/useCountUp";
import SellControl from "../components/SellControl";
import AllocationDonut from "../components/AllocationDonut";

function StatCard({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
}) {
  const animated = useCountUp(value);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{format(animated)}</div>
    </div>
  );
}

type SortKey = "symbol" | "shares" | "avgCost" | "price" | "value" | "pl";

interface Row {
  symbol: string;
  shares: number;
  avgCost: number;
  price: number | undefined;
  value: number;
  pl: number;
  plPct: number;
}

function Analytics() {
  const { cash, holdings, loading } = usePortfolio();
  const { format } = useCurrency();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortAsc, setSortAsc] = useState(false);

  const symbols = holdings.map((h) => h.symbol);
  const quotes = useQuotes(symbols);

  const priceBySymbol: Record<string, number | undefined> = {};
  quotes.forEach((q, i) => {
    priceBySymbol[symbols[i]] = q.data?.c;
  });

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Loading your portfolio…
      </p>
    );
  }

  const holdingsValue = holdings.reduce((sum, h) => {
    const price = priceBySymbol[h.symbol] ?? h.avgCost;
    return sum + h.shares * price;
  }, 0);
  const portfolioValue = cash + holdingsValue;

  const allocation = [
    ...holdings.map((h) => ({
      name: h.symbol,
      value: (priceBySymbol[h.symbol] ?? h.avgCost) * h.shares,
    })),
    { name: "Cash", value: cash },
  ];

  const rows: Row[] = holdings.map((h) => {
    const price = priceBySymbol[h.symbol];
    const value = (price ?? h.avgCost) * h.shares;
    const cost = h.avgCost * h.shares;
    const pl = value - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    return {
      symbol: h.symbol,
      shares: h.shares,
      avgCost: h.avgCost,
      price,
      value,
      pl,
      plPct,
    };
  });

  const filtered = rows.filter((r) =>
    r.symbol.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    let diff: number;
    if (sortKey === "symbol") {
      diff = a.symbol.localeCompare(b.symbol);
    } else if (sortKey === "price") {
      diff = (a.price ?? 0) - (b.price ?? 0);
    } else {
      diff = a[sortKey] - b[sortKey];
    }
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "symbol", label: "Symbol" },
    { key: "shares", label: "Shares" },
    { key: "avgCost", label: "Avg cost" },
    { key: "price", label: "Price" },
    { key: "value", label: "Value" },
    { key: "pl", label: "P/L" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Your paper-trading portfolio
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <StatCard label="Cash" value={cash} format={format} />
        <StatCard
          label="Holdings value"
          value={holdingsValue}
          format={format}
        />
        <StatCard
          label="Portfolio value"
          value={portfolioValue}
          format={format}
        />
      </div>

      {holdings.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          You haven't bought anything yet. Head to the Dashboard to make your
          first trade.
        </p>
      ) : (
        <>
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Allocation
            </h3>
            <AllocationDonut data={allocation} format={format} />
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Filter by symbol…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {columns.map((col) => (
                    <th key={col.key} className="py-2 pr-4">
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {col.label}
                        <ArrowUpDown
                          size={12}
                          className={
                            sortKey === col.key
                              ? "text-blue-500"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      </button>
                    </th>
                  ))}
                  <th className="py-2 pr-4">Sell</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No holdings match "{search}"
                    </td>
                  </tr>
                ) : (
                  sorted.map((r) => {
                    const up = r.pl >= 0;
                    return (
                      <tr
                        key={r.symbol}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-2 pr-4 font-medium">{r.symbol}</td>
                        <td className="py-2 pr-4">{r.shares}</td>
                        <td className="py-2 pr-4">{format(r.avgCost)}</td>
                        <td className="py-2 pr-4">
                          {r.price === undefined ? "—" : format(r.price)}
                        </td>
                        <td className="py-2 pr-4">{format(r.value)}</td>
                        <td
                          className={`py-2 pr-4 ${up ? "text-green-600" : "text-red-600"}`}
                        >
                          {format(r.pl)} ({r.plPct >= 0 ? "+" : ""}
                          {r.plPct.toFixed(2)}%)
                        </td>
                        <td className="py-2 pr-4">
                          <SellControl
                            symbol={r.symbol}
                            maxShares={r.shares}
                            price={r.price}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
