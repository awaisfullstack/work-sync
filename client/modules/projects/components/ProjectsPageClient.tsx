"use client";

import { columns } from "@/modules/projects/columns";
import { DataTable } from "@/components/common/data-table";
import { useGetProjectsQuery } from "@/store/api/projectsApi";
import type {
  ProjectQuery,
  ProjectSortBy,
  ProjectStatus,
  SortOrder,
} from "@/types/project.types";
import { useMemo, useState } from "react";
import { TablePagination } from "@/components/common/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import LoadTableError from "@/components/common/LoadTableError";
import { ProjectsTableToolbar } from "./ProjectsTableToolbar";

const ProjectsPageClient = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<ProjectSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const debouncedSearch = useDebounce(search, 500);

  const queryArgs = useMemo<ProjectQuery>(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      sortBy,
      sortOrder
    }),
    [page, limit, debouncedSearch, status, sortBy, sortOrder],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetProjectsQuery(queryArgs);

  const projectsData = data?.data;
  const projects = projectsData?.items ?? [];
  const totalItems = projectsData?.pagination.total ?? 0;
  const totalPages = projectsData?.pagination.totalPages ?? 1;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: ProjectStatus | "ALL") {
    setStatus(value);
    setPage(1);
  }

  function handleSortByChange(value: ProjectSortBy) {
    setSortBy(value);
    setPage(1);
  }

  function handleSortOrderChange(value: SortOrder) {
    setSortOrder(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setSortBy("createdAt");
    setSortOrder("DESC");
    setPage(1);
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Projects</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {totalItems}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Page</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-700">
            {projects.length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active On Page</p>
          <h3 className="mt-2 text-2xl font-bold text-green-700">
            {projects.filter((project) => project.status === "ACTIVE").length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Archived On Page</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-700">
            {projects.filter((project) => project.status === "ARCHIVED").length}
          </h3>
        </div>
      </div>

      <ProjectsTableToolbar
        search={search}
        status={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load projects"
          message="An error occurred while fetching projects. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">Refreshing projects...</p>
          )}

          <DataTable
            columns={columns}
            data={projects}
            isLoading={isLoading}
            noFoundMessage="No projects found."
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

export default ProjectsPageClient;
