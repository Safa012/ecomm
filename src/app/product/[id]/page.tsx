'use client';

import { fetchProducts } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();

  const resolvedParams = use(params); // ✅ unwrap the params Promise

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts();
      const foundProduct = products.find((p: any) => String(p.id) === resolvedParams.id);
      setProduct(foundProduct ?? null);
    };
    loadProduct();
  }, [resolvedParams.id]);

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white relative">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-contain mb-6 bg-gray-50 dark:bg-gray-900 rounded"
        />
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.title}</h1>
        <p className="text-lg text-green-700 dark:text-green-300 font-bold mb-2">${product.price}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
        <div className="flex gap-4 text-sm mb-2">
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
            Rating: {product.rating?.rate ?? 0} ({product.rating?.count ?? 0})
          </span>
        </div>
      </div>
    </div>
  );
}
