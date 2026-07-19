import { useQuery } from "@tanstack/react-query";
import { fetchDailyCandles } from "../api/alphavantage";

export function useCandles(symbol: string, enabled: boolean) {
  return useQuery({
    queryKey: ["candles", symbol],
    queryFn: () => fetchDailyCandles(symbol),
    staleTime: 1000 * 60 * 60,
    retry: false,
    enabled,
  });
}