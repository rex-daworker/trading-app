import { usePortfolio } from '../context/PortfolioContext'
import { useQuotes } from '../hooks/useQuotes'
import { useCurrency } from '../context/CurrencyContext'
import SellControl from '../components/SellControl'
import { useCountUp } from '../hooks/useCountUp'

function StatCard({
  label,
  value,
  format,
}: {
  label: string
  value: number
  format: (n: number) => string
}) {
  const animated = useCountUp(value)
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{format(animated)}</div>
    </div>
  )
}

function Analytics() {
  const { cash, holdings, loading } = usePortfolio()
  const { currency, convert } = useCurrency()

  const symbols = holdings.map((h) => h.symbol)
  const quotes = useQuotes(symbols)

  const priceBySymbol: Record<string, number | undefined> = {}
  quotes.forEach((q, i) => {
    priceBySymbol[symbols[i]] = q.data?.c
  })

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading your portfolio…</p>
  }

  const fmt = (usd: number) => `${currency} ${convert(usd).toFixed(2)}`

  const holdingsValue = holdings.reduce((sum, h) => {
    const price = priceBySymbol[h.symbol] ?? h.avgCost
    return sum + h.shares * price
  }, 0)
  const portfolioValue = cash + holdingsValue

  return (
    <div>
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Your paper-trading portfolio</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <StatCard label="Cash" value={cash} format={fmt} />
        <StatCard label="Holdings value" value={holdingsValue} format={fmt} />
        <StatCard label="Portfolio value" value={portfolioValue} format={fmt} />
      </div>

      {holdings.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          You haven't bought anything yet. Head to the Dashboard to make your first trade.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="py-2 pr-4">Symbol</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 pr-4">Avg cost</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2 pr-4">P/L</th>
                <th className="py-2 pr-4">Sell</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const price = priceBySymbol[h.symbol]
                const value = (price ?? h.avgCost) * h.shares
                const cost = h.avgCost * h.shares
                const pl = value - cost
                const plPct = cost > 0 ? (pl / cost) * 100 : 0
                const up = pl >= 0
                return (
                  <tr key={h.symbol} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 font-medium">{h.symbol}</td>
                    <td className="py-2 pr-4">{h.shares}</td>
                    <td className="py-2 pr-4">{fmt(h.avgCost)}</td>
                    <td className="py-2 pr-4">{price === undefined ? '—' : fmt(price)}</td>
                    <td className="py-2 pr-4">{fmt(value)}</td>
                    <td className={`py-2 pr-4 ${up ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(pl)} ({plPct >= 0 ? '+' : ''}
                      {plPct.toFixed(2)}%)
                    </td>
                    <td className="py-2 pr-4">
                      <SellControl symbol={h.symbol} maxShares={h.shares} price={price} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Analytics