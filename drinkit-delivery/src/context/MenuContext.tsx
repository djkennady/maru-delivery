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
import { DEFAULT_MENU } from "@/data/menu-defaults";
import type { Category, MenuData, Product } from "@/types/menu";

interface MenuContextValue {
  categories: Category[];
  products: Product[];
  settings: MenuData["settings"];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getCategory: (id: string) => Category | undefined;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuData>(DEFAULT_MENU);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as MenuData;
      setMenu(data);
    } catch {
      setError("Не удалось загрузить меню");
      setMenu(DEFAULT_MENU);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getProduct = useCallback(
    (id: string) => menu.products.find((product) => product.id === id),
    [menu.products],
  );

  const getCategory = useCallback(
    (id: string) => menu.categories.find((category) => category.id === id),
    [menu.categories],
  );

  const value = useMemo(
    () => ({
      categories: menu.categories,
      products: menu.products,
      settings: menu.settings,
      loading,
      error,
      refresh,
      getProduct,
      getCategory,
    }),
    [menu, loading, error, refresh, getProduct, getCategory],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
}
