import { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import { useCurrency } from '../context/CurrencyContext'

interface BuyControlProps {
  symbol: string
  price: number
}

function BuyControl({ symbol, price }: BuyControlProps) {
  const { cash, buy } = usePortfolio()
  const { currency, convert } = useCurrency()
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const shares = Number(qty)
  const cost = shares * price

  const handleBuy = async () => {
    setError('')
    if (!Number.isFinite(shares) || shares <= 0) {
      setError('Enter a positive quantity')
      return
    }
    if (cost > cash) {
      setError('Not enough cash')
      return
    }
    setBusy(true)
    try {
      await buy(symbol, shares, price)
      setQty('')
    } catch {
      setError('Trade failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        min="0"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        placeholder="Qty"
        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
      />
      <button
        onClick={handleBuy}
        disabled={busy}
        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Buy
      </button>
      {shares > 0 && !error && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ≈ {currency} {convert(cost).toFixed(2)}
        </span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export default BuyControl