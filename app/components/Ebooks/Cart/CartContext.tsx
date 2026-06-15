"use client";

import {
  createContext,
  useContext,
  useState,
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
  addItem: (ebook: Ebook) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
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

    setItems((prev) => {
      const existing = prev.find((i) => i.id === ebook.id);
      if (existing) {
        // ebook = produkt cyfrowy, więc w praktyce 1 szt. wystarczy,
        // ale trzymamy qty na wypadek innej logiki później
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
