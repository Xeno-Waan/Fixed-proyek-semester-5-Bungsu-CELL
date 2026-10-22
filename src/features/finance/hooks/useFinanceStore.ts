// src/features/finance/hooks/useFinanceStore.ts

import React, { createContext, useCallback, useContext } from "react";
import { CashEntry, UsedPhone } from "@/types";
import { initialCashEntries, initialUsedPhones } from "../data/finance";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * Simple store for finance data. Uses localStorage for persistence across page
 * refreshes (as required by the SOT). All operations are typed strictly.
 */
const useFinanceStoreState = () => {
  // Persist cash entries and used‑phone list separately.
  const [cashEntries, setCashEntries] = useLocalStorage<CashEntry[]>(
    "finance:cashEntries",
    initialCashEntries,
  );
  const [usedPhones, setUsedPhones] = useLocalStorage<UsedPhone[]>(
    "finance:usedPhones",
    initialUsedPhones,
  );

  // ---- Cash entry helpers -------------------------------------------------
  const addCashEntry = useCallback(
    (entry: Omit<CashEntry, "id" | "date">) => {
      const newEntry: CashEntry = {
        ...entry,
        id: `cash-${Date.now()}`,
        date: new Date().toISOString(),
      };
      setCashEntries((prev) => [...prev, newEntry]);
    },
    [setCashEntries],
  );

  const filterCashByPeriod = useCallback(
    (start: string, end: string) => {
      const s = new Date(start);
      const e = new Date(end);
      return cashEntries.filter((c) => {
        const d = new Date(c.date);
        return d >= s && d <= e;
      });
    },
    [cashEntries],
  );

  // ---- Used‑phone helpers -------------------------------------------------
  const addUsedPhone = useCallback(
    (phone: Omit<UsedPhone, "id" | "purchaseDate" | "isSold" | "netProfit">) => {
      const newPhone: UsedPhone = {
        ...phone,
        id: `phone-${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        isSold: false,
      };
      setUsedPhones((prev) => [...prev, newPhone]);
    },
    [setUsedPhones],
  );

  const sellPhone = useCallback(
    (id: string, actualSellingPrice: number) => {
      setUsedPhones((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const netProfit =
            actualSellingPrice - (p.purchasePrice + p.repairSparepartCost);
          return {
            ...p,
            isSold: true,
            actualSellingPrice,
            soldDate: new Date().toISOString(),
            netProfit,
          };
        }),
      );
    },
    [setUsedPhones],
  );

  // ---- Reset all data -----------------------------------------------------
  const resetAll = useCallback(() => {
    setCashEntries(initialCashEntries);
    setUsedPhones(initialUsedPhones);
  }, [setCashEntries, setUsedPhones]);

  return {
    cashEntries,
    usedPhones,
    addCashEntry,
    filterCashByPeriod,
    addUsedPhone,
    sellPhone,
    resetAll,
  } as const;
};

type FinanceStore = ReturnType<typeof useFinanceStoreState>;
const FinanceStoreContext = createContext<FinanceStore | null>(null);

export const FinanceStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useFinanceStoreState();
  return React.createElement(FinanceStoreContext.Provider, { value: store }, children);
};

export const useFinanceStore = () => {
  const sharedStore = useContext(FinanceStoreContext);
  const fallbackStore = useFinanceStoreState();
  return sharedStore ?? fallbackStore;
};
