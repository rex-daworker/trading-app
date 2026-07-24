import type { Holding } from "../context/PortfolioContext";

export interface BuyResult {
  cash: number;
  holding: Holding;
}

export function calculateBuy(
  cash: number,
  holdings: Holding[],
  symbol: string,
  shares: number,
  price: number,
): BuyResult {
  const cost = shares * price;
  if (cost > cash) {
    throw new Error("Insufficient cash");
  }

  const existing = holdings.find((h) => h.symbol === symbol);
  const newShares = (existing?.shares ?? 0) + shares;
  const newAvgCost = existing
    ? (existing.shares * existing.avgCost + shares * price) / newShares
    : price;

  return {
    cash: cash - cost,
    holding: { symbol, shares: newShares, avgCost: newAvgCost },
  };
}

export interface SellResult {
  cash: number;
  remainingShares: number;
}

export function calculateSell(
  cash: number,
  holdings: Holding[],
  symbol: string,
  shares: number,
  price: number,
): SellResult {
  const existing = holdings.find((h) => h.symbol === symbol);
  if (!existing || shares > existing.shares) {
    throw new Error("Not enough shares");
  }

  const proceeds = shares * price;
  return {
    cash: cash + proceeds,
    remainingShares: existing.shares - shares,
  };
}