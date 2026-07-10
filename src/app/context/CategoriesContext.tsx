import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { MenuDTO } from "../utils/api";
import { DEFAULT_CATEGORIES } from "../utils/constants";

interface CategoriesContextType {
  categories: string[];
  loading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType>({ categories: DEFAULT_CATEGORIES, loading: true });

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menus")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          const names = json.data.map((m: MenuDTO) => m.nom).filter(Boolean);
          if (names.length > 0) {
            setCategories(["Tous", ...names]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
