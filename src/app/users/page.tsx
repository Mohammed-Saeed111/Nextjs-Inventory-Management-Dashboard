"use client";

import { useGetUsersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { mockUsers } from "@/state/mockData";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
];

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse mt-2"></div>
      </div>
    );
  }

  // Use mock data as fallback when API is unavailable
  const displayUsers = isError || !users ? mockUsers : users;

  return (
    <div className="flex flex-col">
      <Header name="Users" />
      {isError && (
        <p className="text-xs text-amber-600 mb-2">
          ⚠ Backend offline — showing demo data
        </p>
      )}
      <DataGrid
        rows={displayUsers}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Users;
