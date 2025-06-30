'use client';

import { useStore } from '@/app/store/store';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, isCartOpen, toggleCart, removeFromCart } = useStore();
  const totalPrice = cart
    .reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0)
    .toFixed(2);

  if (!isCartOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-6 flex flex-col border-l border-gray-200 dark:border-gray-700 transition-transform duration-300">
      {/* Close Button */}
      <button
        onClick={toggleCart}
        className="self-end text-2xl font-bold text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition"
        aria-label="Close Cart"
      >
        ×
      </button>

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Shopping Cart</h2>

      {/* Empty State */}
      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <ul className="flex-1 overflow-y-auto space-y-4 pr-1">
          {cart.map((item: any) => (
            <li key={item.id} className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>
              </div>
              <button
                onClick={() => {
                  removeFromCart(item.id);
                  toast.success('Item removed from cart.');
                }}
                className="text-sm text-red-500 hover:underline mt-1"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Total */}
      {cart.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-lg font-bold text-gray-900 dark:text-white">
          Total: ${totalPrice}
        </div>
      )}
    </div>
  );
}
