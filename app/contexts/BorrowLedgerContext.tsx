import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  BorrowItem,
  NewBorrowItemInput,
  initialBorrowItems,
  initialCompletedItems,
  makeMapPosition,
} from '@/constants/borrowItems';

const STORAGE_KEY = 'kashikari-map-ledger-v1';

type StoredLedger = {
  activeItems: BorrowItem[];
  completedItems: BorrowItem[];
};

type BorrowLedgerContextValue = StoredLedger & {
  isReady: boolean;
  addItem: (input: NewBorrowItemInput) => BorrowItem;
  completeItem: (id: string) => void;
  restoreSeedData: () => void;
  findItem: (id: string) => BorrowItem | undefined;
  lendCount: number;
  borrowCount: number;
};

const BorrowLedgerContext = createContext<BorrowLedgerContextValue | undefined>(undefined);

function normalizeLedger(value: Partial<StoredLedger> | null | undefined): StoredLedger {
  return {
    activeItems: Array.isArray(value?.activeItems) && value.activeItems.length > 0 ? value.activeItems : initialBorrowItems,
    completedItems: Array.isArray(value?.completedItems) ? value.completedItems : initialCompletedItems,
  };
}

function makeItemId(input: NewBorrowItemInput, activeItems: BorrowItem[], completedItems: BorrowItem[]) {
  const base = input.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
  const usedIds = new Set([...activeItems, ...completedItems].map((item) => item.id));
  let candidate = `${base}-${activeItems.length + completedItems.length + 1}`;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}-${activeItems.length + completedItems.length + suffix}`;
    suffix += 1;
  }
  return candidate;
}

function todayKey() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function BorrowLedgerProvider({ children }: PropsWithChildren) {
  const [activeItems, setActiveItems] = useState<BorrowItem[]>(initialBorrowItems);
  const [completedItems, setCompletedItems] = useState<BorrowItem[]>(initialCompletedItems);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        const parsed = raw ? JSON.parse(raw) as Partial<StoredLedger> : undefined;
        const normalized = normalizeLedger(parsed);
        setActiveItems(normalized.activeItems);
        setCompletedItems(normalized.completedItems);
      })
      .catch(() => {
        if (!mounted) return;
        setActiveItems(initialBorrowItems);
        setCompletedItems(initialCompletedItems);
      })
      .finally(() => {
        if (mounted) setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ activeItems, completedItems })).catch(() => undefined);
  }, [activeItems, completedItems, isReady]);

  const value = useMemo<BorrowLedgerContextValue>(() => {
    function addItem(input: NewBorrowItemInput) {
      const newItem: BorrowItem = {
        id: makeItemId(input, activeItems, completedItems),
        title: input.title.trim(),
        person: input.person.trim(),
        personIcon: input.personIcon.trim() || '🙂',
        direction: input.direction,
        categoryIcon: input.categoryIcon.trim() || '📦',
        dueDate: input.dueDate.trim(),
        reminderDays: input.reminderDays,
        memo: input.memo.trim() || 'メモなし',
        map: makeMapPosition(activeItems.length),
      };
      setActiveItems((current) => [...current, newItem]);
      return newItem;
    }

    function completeItem(id: string) {
      const target = activeItems.find((item) => item.id === id);
      if (!target) return;
      setActiveItems((current) => current.filter((item) => item.id !== id));
      setCompletedItems((current) => [{ ...target, completedAt: todayKey() }, ...current]);
    }

    function restoreSeedData() {
      setActiveItems(initialBorrowItems);
      setCompletedItems(initialCompletedItems);
    }

    function findItem(id: string) {
      return [...activeItems, ...completedItems].find((item) => item.id === id);
    }

    return {
      activeItems,
      completedItems,
      isReady,
      addItem,
      completeItem,
      restoreSeedData,
      findItem,
      lendCount: activeItems.filter((item) => item.direction === 'lend').length,
      borrowCount: activeItems.filter((item) => item.direction === 'borrow').length,
    };
  }, [activeItems, completedItems, isReady]);

  return <BorrowLedgerContext.Provider value={value}>{children}</BorrowLedgerContext.Provider>;
}

export function useBorrowLedger() {
  const context = useContext(BorrowLedgerContext);
  if (!context) {
    throw new Error('useBorrowLedger must be used inside BorrowLedgerProvider');
  }
  return context;
}
