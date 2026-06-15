"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Ebook } from "../ebook-types";

export type CartItem = {
  id: string;
  title: string;
  cover: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: CartItem | null;
  totalCount: number;
  totalPrice: number;
  hydrated: boolean;
  addItem: (ebook: Ebook) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/* =========================================================================
   localStorage jako external store (źródło prawdy koszyka).
   Czytane przez useSyncExternalStore — bez setState w efekcie.
   ========================================================================= */

const STORAGE_KEY = "lumera_cart";
const EMPTY: CartItem[] = [];
const INVALID = "\u0000"; // sentinel wymuszający ponowny parse (np. zmiana w innej karcie)

const listeners = new Set<() => void>();
let cache: CartItem[] = EMPTY; // ostatni snapshot — stabilna referencja dla Reacta
let cacheRaw: string | null = null; // surowy string odpowiadający cache

function emit() {
  for (const l of listeners) l();
}

function read(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }

  // nic się nie zmieniło → zwróć tę samą referencję (warunek useSyncExternalStore)
  if (raw === cacheRaw) return cache;

  cacheRaw = raw;
  if (!raw) {
    cache = EMPTY;
    return cache;
  }
  try {
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed as CartItem[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: CartItem[]) {
  cache = next;
  try {
    cacheRaw = JSON.stringify(next);
    localStorage.setItem(STORAGE_KEY, cacheRaw);
  } catch {
    // tryb prywatny / brak miejsca — trzymamy stan przynajmniej w pamięci
  }
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cacheRaw = INVALID; // wymuś reparse przy najbliższym getSnapshot
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => read();
const getServerSnapshot = () => EMPTY;

// mały hook „czy już po hydratacji" — też bez setState w efekcie
const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // UI drawera — to nie jest stan trwały, więc zwykły useState
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const addItem = useCallback((ebook: Ebook) => {
    const entry: CartItem = {
      id: ebook.id,
      title: ebook.title,
      cover: ebook.cover,
      price: ebook.price,
      qty: 1,
    };

    const current = read();
    const existing = current.find((i) => i.id === ebook.id);
    const next = existing
      ? current.map((i) => (i.id === ebook.id ? { ...i, qty: i.qty + 1 } : i))
      : [...current, entry];

    write(next);
    setLastAdded(entry);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => write(EMPTY), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        lastAdded,
        totalCount,
        totalPrice,
        hydrated,
        addItem,
        removeItem,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart musi być użyte wewnątrz <CartProvider>");
  return ctx;
}
