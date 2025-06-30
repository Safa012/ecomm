import { create } from 'zustand';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity?: number;
  [key: string]: any;
}


interface StoreState {
  search: string;
  category: string;
  isCartOpen: boolean;
  isDarkMode: boolean;
  cart: Product[];

  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  toggleCart: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  search: '',
  category: 'all',
  isCartOpen: false,
  isDarkMode: false,
  cart: [],

  setSearch: (value) => set({ search: value }),
  setCategory: (value) => set({ category: value }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (value: boolean) => set({ isDarkMode: value }),

  addToCart: (product) => {
    const cart = get().cart;
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      // update quantity if already in cart
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
          : item
      );
      set({ cart: updatedCart });
    } else {
      // add new item
      set({ cart: [...cart, { ...product, quantity: product.quantity || 1 }] });
    }
  },

  removeFromCart: (id) => {
    const cart = get().cart.filter((item) => item.id !== id);
    set({ cart });
  },

  clearCart: () => set({ cart: [] }),
}));
