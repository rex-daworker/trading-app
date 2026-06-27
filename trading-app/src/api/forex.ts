const FX_URL = "https://open.er-api.com/v6/latest/USD";

export interface FxRates {
  [code: string]: number;
}

interface FxResponse {
  result: string;
  rates: FxRates;
}

export async function fetchRates(): Promise<FxRates> {
  const res = await fetch(FX_URL);
  if (!res.ok) {
    throw new Error(`FX request failed (${res.status})`);
  }
  const data = (await res.json()) as FxResponse;
  return data.rates;
}
