import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
  createdAt: number;
}

interface AlertsContextValue {
  alerts: PriceAlert[];
  loading: boolean;
  addAlert: (
    symbol: string,
    targetPrice: number,
    direction: "above" | "below",
  ) => Promise<void>;
  removeAlert: (id: string) => Promise<void>;
  markTriggered: (id: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local state on logout, not syncing from an external source
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = collection(db, "alerts", user.uid, "items");
    const unsub = onSnapshot(ref, (snap) => {
      const list = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as PriceAlert,
      );
      setAlerts(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addAlert = async (
    symbol: string,
    targetPrice: number,
    direction: "above" | "below",
  ) => {
    if (!user) return;
    const ref = collection(db, "alerts", user.uid, "items");
    await addDoc(ref, {
      symbol,
      targetPrice,
      direction,
      triggered: false,
      createdAt: Date.now(),
    });
  };

  const removeAlert = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "alerts", user.uid, "items", id));
  };

  const markTriggered = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "alerts", user.uid, "items", id), {
      triggered: true,
    });
  };

  return (
    <AlertsContext.Provider
      value={{ alerts, loading, addAlert, removeAlert, markTriggered }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (ctx === undefined) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return ctx;
}
