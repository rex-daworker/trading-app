const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = import.meta.env.VITE_FINNHUB_KEY;

export interface Quote {
  c: number; // current price
  d: number; // change today (absolute)
  dp: number; // change today (percent)
  pc: number; // previous close
}

export async function fetchQuote(symbol: string): Promise<Quote> {
  const res = await fetch(
    `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`,
  );
  if (!res.ok) {
    throw new Error(`Request failed for ${symbol} (${res.status})`);
  }
  return res.json() as Promise<Quote>;
}

export interface SearchResult {
  symbol: string
  description: string
  type: string
}

interface SearchResponse {
  count: number
  result: SearchResult[]
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`)
  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`)
  }
  const data = (await res.json()) as SearchResponse
  return data.result
}