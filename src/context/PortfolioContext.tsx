import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const STARTING_CASH = 100000;

export interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  total: number;
  timestamp: number;
}

interface PortfolioContextValue {
  cash: number;
  holdings: Holding[];
  loading: boolean;
  buy: (symbol: string, shares: number, price: number) => Promise<void>;
  sell: (symbol: string, shares: number, price: number) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cash, setCash] = useState(0);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local state on logout, not syncing from an external source
      setCash(0);
      setHoldings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const portfolioRef = doc(db, "portfolios", user.uid);
    const holdingsRef = collection(db, "portfolios", user.uid, "holdings");

    const unsubPortfolio = onSnapshot(portfolioRef, (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(portfolioRef, { cash: STARTING_CASH });
        return;
      }
      setCash(snapshot.data().cash as number);
      setLoading(false);
    });

    const unsubHoldings = onSnapshot(holdingsRef, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as Holding);
      setHoldings(list);
    });

    return () => {
      unsubPortfolio();
      unsubHoldings();
    };
  }, [user]);

  const logTrade = async (
    symbol: string,
    type: "buy" | "sell",
    shares: number,
    price: number,
  ) => {
    if (!user) return;
    const tradesRef = collection(db, "portfolios", user.uid, "trades");
    await addDoc(tradesRef, {
      symbol,
      type,
      shares,
      price,
      total: shares * price,
      timestamp: Date.now(),
    });
  };

  const buy = async (symbol: string, shares: number, price: number) => {
    if (!user) return;
    const cost = shares * price;
    if (cost > cash) {
      throw new Error("Insufficient cash");
    }

    const existing = holdings.find((h) => h.symbol === symbol);
    const newShares = (existing?.shares ?? 0) + shares;
    const newAvgCost = existing
      ? (existing.shares * existing.avgCost + shares * price) / newShares
      : price;

    const portfolioRef = doc(db, "portfolios", user.uid);
    const holdingRef = doc(db, "portfolios", user.uid, "holdings", symbol);

    const batch = writeBatch(db);
    batch.update(portfolioRef, { cash: cash - cost });
    batch.set(holdingRef, { symbol, shares: newShares, avgCost: newAvgCost });
    await batch.commit();
    await logTrade(symbol, "buy", shares, price);
  };

  const sell = async (symbol: string, shares: number, price: number) => {
    if (!user) return;
    const existing = holdings.find((h) => h.symbol === symbol);
    if (!existing || shares > existing.shares) {
      throw new Error("Not enough shares");
    }

    const proceeds = shares * price;
    const remaining = existing.shares - shares;

    const portfolioRef = doc(db, "portfolios", user.uid);
    const holdingRef = doc(db, "portfolios", user.uid, "holdings", symbol);

    const batch = writeBatch(db);
    batch.update(portfolioRef, { cash: cash + proceeds });
    if (remaining > 0) {
      batch.update(holdingRef, { shares: remaining });
    } else {
      batch.delete(holdingRef);
    }
    await batch.commit();
    await logTrade(symbol, "sell", shares, price);
  };

  return (
    <PortfolioContext.Provider value={{ cash, holdings, loading, buy, sell }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
