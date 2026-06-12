"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import LoadTableError from "@/components/shared/LoadTableError";
import { useDebounce } from "@/hooks/useDebounce";
import { columns } from "../columns";
import { useGetDepartmentQuery } from "../departmentsApi";
import { DepartmentsTableToolbar } from "./DepartmentsTableToolbar";

const DepartmentsPageClient = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetDepartmentQuery();

  const departments = useMemo(
    () => (data?.data ?? []),
    [data],
  );
  const filteredDepartments = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) return departments;

    return departments.filter((department) =>
      department.name.toLowerCase().includes(query),
    );
  }, [departments, debouncedSearch]);

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  function resetFilters() {
    setSearch("");
  }

  return (
    <section className="flex flex-col gap-6 py-6">
  
      <DepartmentsTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load departments"
          message="An error occurred while fetching departments. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">
              Refreshing departments...
            </p>
          )}

          <DataTable
            columns={columns}
            data={filteredDepartments}
            isLoading={isLoading}
            noFoundMessage="No departments found."
          />
        </>
      )}
    </section>
  );
};

export default DepartmentsPageClient;
