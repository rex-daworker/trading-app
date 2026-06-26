import { useQuery } from '@tanstack/react-query'
import { searchSymbols } from '../api/finnhub'

export function useSymbolSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchSymbols(query),
    enabled: query.trim().length > 0,
  })
}