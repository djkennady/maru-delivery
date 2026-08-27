"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
} from "@/data/delivery-menu";
import {
  createCartItemId,
  getCartItemCount,
  getCartItemKey,
  getCartSubtotal,
  getDefaultOptions,
  getProductPrice,
} from "@/lib/delivery-pricing";
import type { CartItem, CartItemOptions } from "@/types/delivery";
import type { DeliveryProduct } from "@/types/delivery";

const STORAGE_KEY = "bird-delivery-cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: boolean;
  addItem: (product: DeliveryProduct, options?: CartItemOptions) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: DeliveryProduct, options?: CartItemOptions) => {
      const resolvedOptions = options ?? getDefaultOptions(product);
      const key = getCartItemKey(product.id, resolvedOptions);
      const unitPrice = getProductPrice(product, resolvedOptions);

      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            getCartItemKey(item.productId, item.options) === key,
        );

        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [
          ...prev,
          {
            id: createCartItemId(),
            productId: product.id,
            quantity: 1,
            options: resolvedOptions,
            unitPrice,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_FROM;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const itemCount = useMemo(() => getCartItemCount(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      isFreeDelivery,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      isFreeDelivery,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
