import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchRates } from '../api/forex'

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN'] as const
export type Currency = (typeof CURRENCIES)[number]

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (c: Currency) => void
  convert: (usdAmount: number) => number
  format: (usdAmount: number) => string
  rate: number
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency')
    return (CURRENCIES as readonly string[]).includes(saved ?? '') ? (saved as Currency) : 'USD'
  })

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const { data: rates } = useQuery({
    queryKey: ['fxrates'],
    queryFn: fetchRates,
    staleTime: 1000 * 60 * 60,
  })

  const rate = rates?.[currency] ?? 1
  const convert = (usdAmount: number) => usdAmount * rate
  const format = (usdAmount: number) =>
    `${currency} ${convert(usdAmount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, rate }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}