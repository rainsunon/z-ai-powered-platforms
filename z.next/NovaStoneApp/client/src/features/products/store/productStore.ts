import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sellThis: boolean;
  buyThis: boolean;
  salesTax?: string;
  pricing?: Record<string, any>;
  inventory?: Record<string, any>;
  categories?: string[];
  customFields?: Record<string, any>;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  addProduct: (product) => 
    set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, updates) => 
    set((state) => ({
      products: state.products.map((p) => 
        p.id === id ? { ...p, ...updates } : p
      )
    })),
  deleteProduct: (id) => 
    set((state) => ({
      products: state.products.filter((p) => p.id !== id)
    })),
  selectProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));
