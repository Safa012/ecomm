"use client";
import { useStore } from '@/app/store/store';
import { Moon, ShoppingCart, Sun, X } from 'lucide-react';

export default function Navbar({ categories, onShowAddForm, showAddForm }: {
  categories: string[];
  onShowAddForm: () => void;
  showAddForm: boolean;
}) {
  const {
    search,
    category,
    cart,
    isDarkMode,
    setSearch,
    setCategory,
    toggleCart,
    toggleDarkMode
  } = useStore();

  return (
    <nav className={`flex justify-between items-center px-6 py-4 shadow ${isDarkMode ? 'bg-purple-900' : 'bg-purple-700'}`}>
      <h1 className="text-2xl font-bold text-white">🏬Explore Products</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded border border-white shadow focus:outline-none text-black bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X className="w-4 h-4 text-white hover:text-red-400" />
          </button>
        )}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1 rounded border border-white shadow text-black bg-white"
        >
          <option value="all">All</option>
          {categories?.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white">
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-purple-700" />}
        </button>
        <button onClick={toggleCart} className="relative">
          <ShoppingCart className="w-6 h-6 text-white" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
        <button onClick={onShowAddForm} className="text-white underline text-sm">
          {showAddForm ? 'Hide Form' : 'Add Product'}
        </button>
      </div>
    </nav>
  );
}
