import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import type { Stock } from "../types/stock";
import { useCurrency } from "../context/CurrencyContext";
import { usePriceFlash } from "../hooks/usePriceFlash";
import BuyControl from "./BuyControl";
import { useTranslation } from "react-i18next";

interface StockCardProps {
  stock: Stock;
  expanded?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  children?: ReactNode;
}

function StockCard({
  stock,
  expanded = false,
  onClick,
  onRemove,
  children,
}: StockCardProps) {
  const isUp = stock.changePercent >= 0;
  const { format } = useCurrency();
  const flash = usePriceFlash(stock.price);
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg border bg-white p-4 transition-all duration-300 dark:bg-gray-800 ${
        expanded
          ? "w-full border-blue-500 sm:w-[480px] lg:w-[560px]"
          : "w-52 border-gray-200 dark:border-gray-700"
      }`}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={t("dashboard.stockCard.removeAria", { symbol: stock.symbol })}
          className="absolute right-2 top-2 text-gray-400 hover:text-red-600"
        >
          <X size={16} />
        </button>
      )}
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {stock.symbol}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {stock.name}
      </div>
      <div className="mt-2 text-xl text-gray-900 dark:text-gray-100">
        <span
          className={`rounded px-1 transition-colors duration-500 ${
            flash === "up"
              ? "bg-green-500/30"
              : flash === "down"
                ? "bg-red-500/30"
                : "bg-transparent"
          }`}
        >
          {format(stock.price)}
        </span>
      </div>
      <div
        className={`mt-1 flex items-center gap-1 text-sm ${isUp ? "text-green-600" : "text-red-600"}`}
      >
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {isUp ? "+" : ""}
        {stock.changePercent.toFixed(2)}%
      </div>
      <BuyControl symbol={stock.symbol} price={stock.price} />
      {children}
    </div>
  );
}

export default StockCard;
