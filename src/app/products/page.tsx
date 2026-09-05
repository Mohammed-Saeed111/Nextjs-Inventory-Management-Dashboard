"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import {
  mockProducts,
  PRODUCT_IMAGE_URLS,
  getProductImageIndex,
} from "@/state/mockData";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  // Use mock data as fallback when API is unavailable
  const displayProducts = isError || !products ? mockProducts : products;

  // Filter mock data locally when search is active and API is unavailable
  const filteredProducts =
    isError && searchTerm
      ? displayProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : displayProducts;

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border shadow rounded-md p-4 animate-pulse"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-36 h-36 bg-gray-200 rounded-2xl"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : (
          filteredProducts.map((product) => {
            // Fix: deterministic image index — no Math.random()
            const imageIndex = getProductImageIndex(product.productId);
            return (
              <div
                key={product.productId}
                className="border shadow rounded-md p-4 max-w-full w-full mx-auto hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={PRODUCT_IMAGE_URLS[imageIndex]}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="mb-3 rounded-2xl w-36 h-36 object-cover"
                  />
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-gray-800">${product.price.toFixed(2)}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    Stock: {product.stockQuantity}
                  </div>
                  {product.rating && (
                    <div className="flex items-center mt-2">
                      <Rating rating={product.rating} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
