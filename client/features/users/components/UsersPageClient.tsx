"use client";

import { columns } from "@/features/users/columns";
import { DataTable } from "@/components/shared/data-table";
import { useMemo, useState } from "react";
import { TablePagination } from "../../../components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { isSuccessResponse } from "@/types/api-response";
import LoadTableError from "@/components/shared/LoadTableError";
import { UserRole } from "@/features/auth/authTypes";
import { useGetDepartmentQuery } from "@/features/departments/departmentsApi";
import { useGetUsersQuery, useGetUserStatsQuery } from "../usersApi";
import { UsersTableToolbar } from "./UserTableToolbar";

const UsersPageClient = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [departmentId, setDepartmentId] = useState("all");

  const debouncedSearch = useDebounce(search, 500);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch ? debouncedSearch : undefined,
      role: role !== "all" ? role : undefined,
      departmentId: departmentId !== "all" ? departmentId : undefined,
    }),
    [page, limit, debouncedSearch, role, departmentId],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetUsersQuery(queryArgs);
  const { data: departmentsData } = useGetDepartmentQuery();

  const { data: statsData } = useGetUserStatsQuery();

  const stats = isSuccessResponse(statsData) && statsData?.data;

  const usersData = isSuccessResponse(data) ? data.data : undefined;
  const users = usersData?.items ?? [];
  const totalItems = usersData?.pagination.total ?? 0;
  const totalPages = usersData?.pagination.totalPages ?? 1;
  const departments = isSuccessResponse(departmentsData)
    ? (departmentsData.data ?? [])
    : [];

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleChange(value: UserRole | "all") {
    setRole(value);
    setPage(1);
  }

  function handleDepartmentChange(value: string) {
    setDepartmentId(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setRole("all");
    setDepartmentId("all");
    setPage(1);
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.totalUsers ?? 0}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Admins</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.totalAdmins ?? 0}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Employees</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {stats?.totalEmployees ?? 0}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Departments</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {departments.length}
          </h3>
        </div>
      </div>

      <UsersTableToolbar
        search={search}
        role={role}
        departmentId={departmentId}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onDepartmentChange={handleDepartmentChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load users"
          message="An error occurred while fetching users. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">Refreshing users...</p>
          )}

          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            noFoundMessage="No users found."
          />

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
};

export default UsersPageClient;
