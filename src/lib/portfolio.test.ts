import { describe, it, expect } from "vitest";
import { calculateBuy, calculateSell } from "./portfolio";
import type { Holding } from "../context/PortfolioContext";

describe("calculateBuy", () => {
  it("creates a new holding when none exists", () => {
    const result = calculateBuy(1000, [], "AAPL", 10, 50);
    expect(result.cash).toBe(500);
    expect(result.holding).toEqual({ symbol: "AAPL", shares: 10, avgCost: 50 });
  });

  it("computes a weighted-average cost basis when adding to an existing holding", () => {
    const holdings: Holding[] = [{ symbol: "AAPL", shares: 10, avgCost: 50 }];
    const result = calculateBuy(1000, holdings, "AAPL", 10, 70);
    // (10 * 50 + 10 * 70) / 20 = 60
    expect(result.holding.avgCost).toBe(60);
    expect(result.holding.shares).toBe(20);
    expect(result.cash).toBe(300);
  });

  it("throws when cash is insufficient", () => {
    expect(() => calculateBuy(100, [], "AAPL", 10, 50)).toThrow(
      "Insufficient cash",
    );
  });
});

describe("calculateSell", () => {
  it("reduces shares on a partial sell and credits cash", () => {
    const holdings: Holding[] = [{ symbol: "AAPL", shares: 10, avgCost: 50 }];
    const result = calculateSell(0, holdings, "AAPL", 4, 60);
    expect(result.cash).toBe(240);
    expect(result.remainingShares).toBe(6);
  });

  it("returns zero remaining shares on a full sell", () => {
    const holdings: Holding[] = [{ symbol: "AAPL", shares: 10, avgCost: 50 }];
    const result = calculateSell(0, holdings, "AAPL", 10, 60);
    expect(result.remainingShares).toBe(0);
  });

  it("throws when selling more shares than held", () => {
    const holdings: Holding[] = [{ symbol: "AAPL", shares: 5, avgCost: 50 }];
    expect(() => calculateSell(0, holdings, "AAPL", 10, 60)).toThrow(
      "Not enough shares",
    );
  });

  it("throws when the symbol isn't held at all", () => {
    expect(() => calculateSell(0, [], "AAPL", 1, 60)).toThrow(
      "Not enough shares",
    );
  });
});
