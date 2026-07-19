import { useQuery } from "@tanstack/react-query";
import { fetchDailyCandles } from "../api/alphavantage";

export function useCandles(symbol: string) {
  return useQuery({
    queryKey: ["candles", symbol],
    queryFn: () => fetchDailyCandles(symbol),
    staleTime: 1000 * 60 * 60, // 1 hour — daily data doesn't need frequent refetching
    retry: false, // avoid burning rate limit on automatic retries
  });
}
