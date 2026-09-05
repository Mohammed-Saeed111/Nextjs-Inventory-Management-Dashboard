import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";
import { mockDashboardMetrics, PRODUCT_IMAGE_URLS, getProductImageIndex } from "@/state/mockData";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading, isError } = useGetDashboardMetricsQuery();

  // Use mock data as fallback when API is unavailable
  const metrics = isError || !dashboardMetrics ? mockDashboardMetrics : dashboardMetrics;

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 mt-5 mx-7"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-7 border-b">
              <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {metrics.popularProducts.map((product) => {
              // Fix: use deterministic image index instead of Math.random()
              const imageIndex = getProductImageIndex(product.productId);
              return (
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={PRODUCT_IMAGE_URLS[imageIndex]}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-lg w-14 h-14 object-cover"
                    />
                    <div className="flex flex-col justify-between gap-1">
                      <div className="font-bold text-gray-700">
                        {product.name}
                      </div>
                      <div className="flex text-sm items-center">
                        <span className="font-bold text-blue-500 text-xs">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="mx-2">|</span>
                        <Rating rating={product.rating || 0} />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs flex items-center">
                    <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    {Math.round(product.stockQuantity / 10)}k Sold
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
