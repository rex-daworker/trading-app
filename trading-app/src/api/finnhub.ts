const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = import.meta.env.VITE_FINNHUB_KEY;

export interface Quote {
  c: number; // current price
  d: number; // change today (absolute)
  dp: number; // change today (percent)
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
