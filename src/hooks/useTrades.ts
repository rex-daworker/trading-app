import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import type { Trade } from "../context/PortfolioContext";

export function useTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local state on logout, not syncing from an external source
      setTrades([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = query(
      collection(db, "portfolios", user.uid, "trades"),
      orderBy("timestamp", "desc"),
    );
    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Trade);
      setTrades(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return { trades, loading };
}
