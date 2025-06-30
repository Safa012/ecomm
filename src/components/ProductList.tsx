"use client";
import { useStore } from "@/app/store/store";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { Product, productSchema } from "@/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-300">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

import Cart from "./Cart";
import Navbar from "./Navbar";

export default function ProductList() {
  const {
    cart,
    addToCart,
    removeFromCart,
    isDarkMode,
    setDarkMode,
    search,
    category,
    setSearch,
    setCategory
  } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: fetchedProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Combine API products and locally added products
  const products = [...localProducts, ...fetchedProducts];

  const filteredProducts = products?.filter(
    (product: any) =>
      (category === "all" || product.category === category) &&
      product.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    const exists = cart.find((item: any) => item.id === product.id);
    if (exists) {
      toast.error(`"${product.title}" is already in the cart.`);
    } else {
      const quantity = quantities[product.id] || 1;
      addToCart({ ...product, quantity });
      toast.success(`"${product.title}" added to cart!`);
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: any) => {
    const newProduct = {
      ...data,
      id: Date.now(),
      rating: { rate: 0, count: 0 },
    };
    setLocalProducts((prev) => [newProduct, ...prev]);
    toast.success("Product added successfully!");
    reset();
    setShowAddForm(false);
  };

  return (
    <div className={isDarkMode ? "bg-gray-900 min-h-screen text-white" : "bg-white min-h-screen text-black"}>
      <Navbar
        categories={categories}
        onShowAddForm={() => setShowAddForm(!showAddForm)}
        showAddForm={showAddForm}
      />
      <Cart />

      {/* Filters Info Bar */}
      <div className="flex justify-between items-center px-6 mt-4">
        <div className="text-gray-500 dark:text-gray-300">
          {category !== "all" && `${category} `}({filteredProducts.length}{" "}
          items)
        </div>
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
          }}
          className="text-sm text-blue-500 underline"
        >
          Clear all filters
        </button>
        {category !== "all" && (
          <div className="bg-green-100 text-green-800 text-sm rounded-full px-3 py-1">
            Category: {category}{" "}
            <button
              onClick={() => setCategory("all")}
              className="ml-1 text-green-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("title")}
              placeholder="Product Title"
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}

            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="Product Price"
              className="w-full p-2 border rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}

            <textarea
              {...register("description")}
              placeholder="Product Description"
              className="w-full p-2 border rounded"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}

            <input
              {...register("category")}
              placeholder="Product Category"
              className="w-full p-2 border rounded"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}

            <input
              {...register("image")}
              placeholder="Image URL"
              className="w-full p-2 border rounded"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Add Product
            </button>
          </form>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="col-span-3 text-center text-purple-700 font-semibold text-lg">
            Loading products...
          </div>
        ) : error ? (
          <div className="col-span-3 text-center text-red-600 font-medium">
            Error: {(error as Error).message}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-3 text-center text-gray-700 dark:text-gray-300 font-medium text-lg">
            No products found.
          </div>
        ) : (
          filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 border-2 border-yellow-400 dark:border-gray-700 rounded-2xl shadow-2xl hover:shadow-yellow-300 dark:hover:shadow-purple-900 transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-60 object-contain bg-yellow-50 dark:bg-gray-800 p-6 border-b border-yellow-200 dark:border-gray-700"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-md font-semibold text-gray-800 dark:text-white line-clamp-2">
                  {highlightMatch(product.title, search)}
                </h2>
                <p className="font-bold text-lg text-green-700 bg-green-100 dark:bg-transparent px-2 py-1 rounded">
                  ${product.price}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                  📦 {product.category}
                </p>
                <input
                  type="number"
                  min={1}
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [product.id]: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full border rounded px-3 py-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition"
                  >
                    Add to Cart
                  </button>
                  <a
                    href={`/product/${product.id}`}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl font-medium transition text-center"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
