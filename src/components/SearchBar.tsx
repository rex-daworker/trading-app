import { useState } from "react";
import { Search } from "lucide-react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useSymbolSearch } from "../hooks/useSymbolSearch";
import type { WatchlistEntry } from "../types/stock";

interface SearchBarProps {
  onAdd: (entry: WatchlistEntry) => void;
  existingSymbols: string[];
}

function SearchBar({ onAdd, existingSymbols }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data: results, isFetching } = useSymbolSearch(debouncedQuery);

  const handleAdd = (symbol: string, description: string) => {
    onAdd({ symbol, name: description, currency: "USD" });
    setQuery("");
  };

  return (
    <div className="relative mb-6 w-full max-w-sm">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search a symbol (e.g. MSFT)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 dark:border-gray-600 dark:bg-gray-800"
      />
      {debouncedQuery.trim().length > 0 && (
        <div className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {isFetching && (
            <p className="p-3 text-sm text-gray-400">Searching…</p>
          )}
          {!isFetching && results && results.length === 0 && (
            <p className="p-3 text-sm text-gray-400">No matches.</p>
          )}
          {!isFetching &&
            results &&
            results.slice(0, 8).map((r) => {
              const already = existingSymbols.includes(r.symbol);
              return (
                <button
                  key={r.symbol}
                  disabled={already}
                  onClick={() => handleAdd(r.symbol, r.description)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-700"
                >
                  <span>
                    <span className="font-medium">{r.symbol}</span>{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      {r.description}
                    </span>
                  </span>
                  <span className="text-xs text-blue-600">
                    {already ? "Added" : "+ Add"}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
