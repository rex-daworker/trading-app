import type { Stock } from "../types/stock";

interface StockCardProps {
  stock: Stock;
}

function StockCard({ stock }: StockCardProps) {
  const isUp = stock.changePercent >= 0;

  return (
    <div className="w-52 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {stock.symbol}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {stock.name}
      </div>
      <div className="mt-2 text-xl text-gray-900 dark:text-gray-100">
        {stock.currency} {stock.price.toFixed(2)}
      </div>
      <div className={isUp ? "text-sm text-green-600" : "text-sm text-red-600"}>
        {isUp ? "+" : ""}
        {stock.changePercent.toFixed(2)}%
      </div>
    </div>
  );
}

export default StockCard;
