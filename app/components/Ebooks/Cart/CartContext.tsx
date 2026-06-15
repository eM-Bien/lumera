"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  /** true dopiero po hydratacji — używaj, by nie renderować licznika z SSR */
  hydrated: boolean;
  addItem: (ebook: Ebook) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lumera_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 1) wczytanie z localStorage — dopiero po zamontowaniu (bez SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // uszkodzony JSON / brak dostępu — startujemy z pustego
    }
    setHydrated(true);
  }, []);

  // 2) zapis przy każdej zmianie — ale dopiero po hydratacji,
  //    żeby pusty stan startowy nie nadpisał zapisanego koszyka
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // brak miejsca / prywatny tryb — ignorujemy
    }
  }, [items, hydrated]);

  const addItem = useCallback((ebook: Ebook) => {
    const entry: CartItem = {
      id: ebook.id,
      title: ebook.title,
      cover: ebook.cover,
      price: ebook.price,
      qty: 1,
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === ebook.id);
      if (existing) {
        return prev.map((i) =>
          i.id === ebook.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, entry];
    });

    setLastAdded(entry);
    setIsOpen(true);
  }, []);

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
