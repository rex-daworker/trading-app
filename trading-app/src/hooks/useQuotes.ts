import { useQueries } from '@tanstack/react-query'
import { fetchQuote } from '../api/finnhub'

export function useQuotes(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ['quote', symbol],
      queryFn: () => fetchQuote(symbol),
      refetchInterval: 15000,
    })),
  })
}