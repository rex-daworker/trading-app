import { useQueries } from '@tanstack/react-query'
import { fetchCompanyNews } from '../api/finnhub'

export function useCompanyNews(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ['company-news', symbol],
      queryFn: () => fetchCompanyNews(symbol),
      staleTime: 1000 * 60 * 5,
    })),
  })
}