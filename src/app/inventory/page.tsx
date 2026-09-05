"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { mockProducts } from "@/state/mockData";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 110,
    type: "number",
    valueGetter: (value, row) => `$${row.price.toFixed(2)}`,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 110,
    type: "number",
    valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
];

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse mt-2"></div>
      </div>
    );
  }

  // Use mock data as fallback when API is unavailable
  const displayProducts = isError || !products ? mockProducts : products;

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      {isError && (
        <p className="text-xs text-amber-600 mb-2">
          ⚠ Backend offline — showing demo data
        </p>
      )}
      <DataGrid
        rows={displayProducts}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;
