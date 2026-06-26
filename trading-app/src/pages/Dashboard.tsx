import { useEffect, useState } from 'react'
import WatchlistItem from '../components/WatchlistItem'
import OverviewWidgets from '../components/OverviewWidgets'
import SearchBar from '../components/SearchBar'
import type { WatchlistEntry } from '../types/stock'

const DEFAULT_WATCHLIST: WatchlistEntry[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD' },
  { symbol: 'ASML', name: 'ASML Holding', currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', currency: 'USD' },
]

function Dashboard() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
    const saved = localStorage.getItem('watchlist')
    return saved ? (JSON.parse(saved) as WatchlistEntry[]) : DEFAULT_WATCHLIST
  })

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addStock = (entry: WatchlistEntry) => {
    setWatchlist((prev) => (prev.some((e) => e.symbol === entry.symbol) ? prev : [...prev, entry]))
  }

  const removeStock = (symbol: string) => {
    setWatchlist((prev) => prev.filter((e) => e.symbol !== symbol))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-gray-500 dark:text-gray-400">Your watchlist — live prices</p>
      <div className="mt-6">
        <OverviewWidgets watchlist={watchlist} />
        <SearchBar onAdd={addStock} existingSymbols={watchlist.map((e) => e.symbol)} />
      </div>
      <div className="flex flex-wrap gap-4">
        {watchlist.map((entry) => (
          <WatchlistItem
            key={entry.symbol}
            entry={entry}
            onRemove={() => removeStock(entry.symbol)}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard