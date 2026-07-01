import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import type { WatchlistEntry } from '../types/stock'

const DEFAULT_WATCHLIST: WatchlistEntry[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD' },
  { symbol: 'ASML', name: 'ASML Holding', currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', currency: 'USD' },
]

interface WatchlistContextValue {
  watchlist: WatchlistEntry[]
  loading: boolean
  addStock: (entry: WatchlistEntry) => void
  removeStock: (symbol: string) => void
}

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setWatchlist([])
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, 'watchlists', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setDoc(ref, { items: DEFAULT_WATCHLIST })
        return
      }
      setWatchlist((snap.data().items as WatchlistEntry[]) ?? [])
      setLoading(false)
    })
    return unsub
  }, [user])

  const addStock = (entry: WatchlistEntry) => {
    if (!user || watchlist.some((e) => e.symbol === entry.symbol)) return
    setDoc(doc(db, 'watchlists', user.uid), { items: [...watchlist, entry] })
  }

  const removeStock = (symbol: string) => {
    if (!user) return
    setDoc(doc(db, 'watchlists', user.uid), {
      items: watchlist.filter((e) => e.symbol !== symbol),
    })
  }

  return (
    <WatchlistContext.Provider value={{ watchlist, loading, addStock, removeStock }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (ctx === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return ctx
}