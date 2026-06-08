"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { DataTable } from "@/components/shared/data-table";
import LoadTableError from "@/components/shared/LoadTableError";
import { TablePagination } from "@/components/shared/TablePagination";
import { Role } from "@/constants";
import { useAppSelector } from "@/store/hooks";
import { isSuccessResponse } from "@/types/api-response";
import { columns } from "../columns";
import { useGetActivityLogsQuery } from "../activityLogsApi";
import type {
  ActivityAction,
  ActivityEntityType,
  ActivitySortBy,
  SortOrder,
} from "../activityLogTypes";
import { ActivityLogsTableToolbar } from "./ActivityLogsTableToolbar";

function formatDateParam(date?: Date) {
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ActivityLogsPageClient() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === Role.ADMIN;

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [action, setAction] = useState<ActivityAction | "ALL">("ALL");
  const [entityType, setEntityType] = useState<ActivityEntityType | "ALL">(
    "ALL",
  );
  const [actorId, setActorId] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [sortBy, setSortBy] = useState<ActivitySortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fromDate = formatDateParam(dateRange?.from);
  const toDate = formatDateParam(dateRange?.to);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      action: action === "ALL" ? undefined : action,
      entityType: entityType === "ALL" ? undefined : entityType,
      actorId: isAdmin && actorId !== "all" ? actorId : undefined,
      projectId: projectId === "all" ? undefined : projectId,
      fromDate,
      toDate,
      sortBy,
      sortOrder,
    }),
    [
      page,
      limit,
      action,
      entityType,
      isAdmin,
      actorId,
      projectId,
      fromDate,
      toDate,
      sortBy,
      sortOrder,
    ],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetActivityLogsQuery(queryArgs);

  const logsData = isSuccessResponse(data) ? data.data : undefined;
  const logs = logsData?.items ?? [];
  const totalItems = logsData?.pagination.total ?? 0;
  const totalPages = logsData?.pagination.totalPages ?? 1;
  const projectLogsOnPage = logs.filter(
    (log) => log.entityType === "PROJECT",
  ).length;
  const shiftLogsOnPage = logs.filter(
    (log) => log.entityType === "SHIFT",
  ).length;
  const actorCountOnPage = new Set(
    logs.map((log) => log.actorId).filter(Boolean),
  ).size;

  function handleActionChange(value: ActivityAction | "ALL") {
    setAction(value);
    setPage(1);
  }

  function handleEntityTypeChange(value: ActivityEntityType | "ALL") {
    setEntityType(value);
    setPage(1);
  }

  function handleActorIdChange(value: string) {
    setActorId(value);
    setPage(1);
  }

  function handleProjectIdChange(value: string) {
    setProjectId(value);
    setPage(1);
  }

  function handleSortByChange(value: ActivitySortBy) {
    setSortBy(value);
    setPage(1);
  }

  function handleSortOrderChange(value: SortOrder) {
    setSortOrder(value);
    setPage(1);
  }

  function handleDateRangeChange(value: DateRange | undefined) {
    setDateRange(value);
    setPage(1);
  }

  function resetFilters() {
    setAction("ALL");
    setEntityType("ALL");
    setActorId("all");
    setProjectId("all");
    setDateRange(undefined);
    setSortBy("createdAt");
    setSortOrder("DESC");
    setPage(1);
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            {isAdmin ? "Total Logs" : "My Logs"}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {totalItems}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Page</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-700">
            {logs.length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            {isAdmin ? "Actors On Page" : "Projects On Page"}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-green-700">
            {isAdmin ? actorCountOnPage : projectLogsOnPage}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Project / Shift Logs</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-700">
            {projectLogsOnPage} / {shiftLogsOnPage}
          </h3>
        </div>
      </div>

      <ActivityLogsTableToolbar
        user={currentUser}
        action={action}
        entityType={entityType}
        actorId={actorId}
        projectId={projectId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        dateRange={dateRange}
        onActionChange={handleActionChange}
        onEntityTypeChange={handleEntityTypeChange}
        onActorIdChange={handleActorIdChange}
        onProjectIdChange={handleProjectIdChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load activity logs"
          message="An error occurred while fetching activity logs. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">
              Refreshing activity logs...
            </p>
          )}

          <DataTable
            columns={columns}
            data={logs}
            isLoading={isLoading}
            noFoundMessage="No activity logs found."
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
}
