import { useEffect } from "react";
import { useAlerts } from "../context/AlertsContext";
import { useQuotes } from "./useQuotes";

export function useAlertMonitor() {
  const { alerts, markTriggered } = useAlerts();
  const active = alerts.filter((a) => !a.triggered);
  const symbols = [...new Set(active.map((a) => a.symbol))];
  const quotes = useQuotes(symbols);

  const priceBySymbol: Record<string, number | undefined> = {};
  quotes.forEach((q, i) => {
    priceBySymbol[symbols[i]] = q.data?.c;
  });
  const priceKey = symbols
    .map((s) => `${s}:${priceBySymbol[s] ?? ""}`)
    .join(",");

  useEffect(() => {
    active.forEach((alert) => {
      const price = priceBySymbol[alert.symbol];
      if (price === undefined) return;
      const hit =
        alert.direction === "above"
          ? price >= alert.targetPrice
          : price <= alert.targetPrice;
      if (!hit) return;

      markTriggered(alert.id);
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(
          `${alert.symbol} is ${alert.direction} ${alert.targetPrice}`,
          {
            body: `Now trading at ${price.toFixed(2)}`,
          },
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- priceKey is a derived string proxy for price/alert changes; including active/markTriggered/priceBySymbol directly would cause an infinite loop since they're recreated every render
  }, [priceKey]);
}
