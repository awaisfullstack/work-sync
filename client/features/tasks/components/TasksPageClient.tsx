"use client";

import { columns } from "@/features/tasks/columns";
import { DataTable } from "@/components/shared/data-table";
import { useMemo, useState } from "react";
import { TablePagination } from "../../../components/shared/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { isSuccessResponse } from "@/types/api-response";
import LoadTableError from "@/components/shared/LoadTableError";
import { SortOrder, TaskSortBy, TaskStatus } from "../taskTypes";
import { useGetTasksQuery } from "../tasksApi";
import { TasksTableToolbar } from "./TasksTableToolbar";
import { DateRange } from "react-day-picker";

function formatDateParam(date?: Date) {
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const TasksPageClient = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState("all");
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<TaskSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const startDate = formatDateParam(dateRange?.from);
  const endDate = formatDateParam(dateRange?.to);

  const debouncedSearch = useDebounce(search, 500);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      status: status === "ALL" ? undefined : status,
      sortBy,
      sortOrder,
      startDate,
      endDate,
      projectId: projectId === "all" ? undefined : projectId,
    }),
    [
      page,
      limit,
      debouncedSearch,
      status,
      sortBy,
      sortOrder,
      projectId,
      startDate,
      endDate,
    ],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTasksQuery(queryArgs);

  const tasksData = isSuccessResponse(data) ? data.data : undefined;
  const tasks = tasksData?.items ?? [];
  const totalItems = tasksData?.pagination.total ?? 0;
  const totalPages = tasksData?.pagination.totalPages ?? 1;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleProjectIdChange(value: string) {
    setProjectId(value);
    setPage(1);
  }
  function handleDateRangeChange(value: DateRange | undefined) {
    setDateRange(value);
    setPage(1);
  }

  function handleStatusChange(value: TaskStatus | "ALL") {
    setStatus(value);
    setPage(1);
  }

  function handleSortByChange(value: TaskSortBy) {
    setSortBy(value);
    setPage(1);
  }

  function handleSortOrderChange(value: SortOrder) {
    setSortOrder(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setProjectId("all");
    setDateRange(undefined);
    setStatus("ALL");
    setSortBy("createdAt");
    setSortOrder("DESC");
    setPage(1);
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {totalItems}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Page</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-700">
            {tasks.length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed On Page</p>
          <h3 className="mt-2 text-2xl font-bold text-green-700">
            {tasks.filter((task) => task.status.name === "COMPLETED").length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">In Progress On Page</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-700">
            {tasks.filter((task) => task.status.name === "IN_PROGRESS").length}
          </h3>
        </div>
      </div>

      <TasksTableToolbar
        search={search}
        projectId={projectId}
        dateRange={dateRange}
        status={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onProjectIdChange={handleProjectIdChange}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load tasks"
          message="An error occurred while fetching tasks. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">Refreshing tasks...</p>
          )}

          <DataTable
            columns={columns}
            data={tasks}
            isLoading={isLoading}
            noFoundMessage="No tasks found."
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

export default TasksPageClient;
