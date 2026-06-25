import type { ReactNode } from 'react'
import type { Stock } from '../types/stock'

interface StockCardProps {
  stock: Stock
  expanded?: boolean
  onClick?: () => void
  children?: ReactNode
}

function StockCard({ stock, expanded = false, onClick, children }: StockCardProps) {
  const isUp = stock.changePercent >= 0

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border bg-white p-4 transition-all dark:bg-gray-800 ${
        expanded ? 'w-80 border-blue-500' : 'w-52 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="font-semibold text-gray-900 dark:text-gray-100">{stock.symbol}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
      <div className="mt-2 text-xl text-gray-900 dark:text-gray-100">
        {stock.currency} {stock.price.toFixed(2)}
      </div>
      <div className={isUp ? 'text-sm text-green-600' : 'text-sm text-red-600'}>
        {isUp ? '+' : ''}
        {stock.changePercent.toFixed(2)}%
      </div>
      {children}
    </div>
  )
}

export default StockCard