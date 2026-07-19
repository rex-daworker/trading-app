const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_KEY;

export interface Candle {
  t: number; // unix seconds
  o: number;
  h: number;
  l: number;
  c: number;
}

interface AlphaVantageDailyResponse {
  "Time Series (Daily)"?: Record<
    string,
    { "1. open": string; "2. high": string; "3. low": string; "4. close": string }
  >;
  Note?: string;
  Information?: string;
}

export async function fetchDailyCandles(symbol: string): Promise<Candle[]> {
  const res = await fetch(
    `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`,
  );
  if (!res.ok) {
    throw new Error(`Candle request failed for ${symbol} (${res.status})`);
  }

  const data = (await res.json()) as AlphaVantageDailyResponse;

  if (data.Note || data.Information) {
    throw new Error("Alpha Vantage rate limit reached — try again shortly");
  }

  const series = data["Time Series (Daily)"];
  if (!series) {
    throw new Error(`No candle data returned for ${symbol}`);
  }

  return Object.entries(series)
    .map(([date, values]) => ({
      t: Math.floor(new Date(date).getTime() / 1000),
      o: parseFloat(values["1. open"]),
      h: parseFloat(values["2. high"]),
      l: parseFloat(values["3. low"]),
      c: parseFloat(values["4. close"]),
    }))
    .sort((a, b) => a.t - b.t);
}