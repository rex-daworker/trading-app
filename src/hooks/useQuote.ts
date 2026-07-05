import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "../api/finnhub";

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => fetchQuote(symbol),
    refetchInterval: 15000,
  });
}
