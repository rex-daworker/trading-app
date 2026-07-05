export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  currency: string;
}

export interface WatchlistEntry {
  symbol: string;
  name: string;
  currency: string;
}
