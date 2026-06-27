import { useCurrency, CURRENCIES } from '../context/CurrencyContext'
import type { Currency } from '../context/CurrencyContext'

function Settings() {
  const { currency, setCurrency, rate } = useCurrency()

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="mt-6 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Prices across the app are shown in {currency}
          {currency !== 'USD' && ` (1 USD ≈ ${rate.toFixed(2)} ${currency})`}.
        </p>
      </div>
    </div>
  )
}

export default Settings