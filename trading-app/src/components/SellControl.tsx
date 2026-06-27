import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'

interface SellControlProps {
  symbol: string
  maxShares: number
  price?: number
}

function SellControl({ symbol, maxShares, price }: SellControlProps) {
  const { sell } = usePortfolio()
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const shares = Number(qty)

  const handleSell = async () => {
    setError('')
    if (price === undefined) {
      setError('No price')
      return
    }
    if (!Number.isFinite(shares) || shares <= 0) {
      setError('Qty?')
      return
    }
    if (shares > maxShares) {
      setError('Too many')
      return
    }
    setBusy(true)
    try {
      await sell(symbol, shares, price)
      setQty('')
    } catch {
      setError('Failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max={maxShares}
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="Qty"
        className="w-14 rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
      />
      <button
        onClick={handleSell}
        disabled={busy || price === undefined}
        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
      >
        Sell
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export default SellControl