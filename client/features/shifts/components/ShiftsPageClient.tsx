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
import { useGetEmployeeWorkedHoursQuery, useGetShiftsQuery } from "../shiftsApi";
import type { ShiftSortBy, ShiftStatus, SortOrder } from "../shiftTypes";
import { formatShiftDuration, getShiftDurationMinutes } from "../utils";
import { ShiftClockCard } from "./ShiftClockCard";
import { ShiftsTableToolbar } from "./ShiftsTableToolbar";

function formatDateParam(date?: Date) {
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const ShiftsPageClient = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [employeeId, setEmployeeId] = useState("all");
  const [status, setStatus] = useState<ShiftStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<ShiftSortBy>("clockInAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fromDate = formatDateParam(dateRange?.from);
  const toDate = formatDateParam(dateRange?.to);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      userId: employeeId === "all" ? undefined : employeeId,
      status: status === "ALL" ? undefined : status,
      sortBy,
      sortOrder,
      fromDate,
      toDate,
    }),
    [page, limit, employeeId, status, sortBy, sortOrder, fromDate, toDate],
  );

  const { data, isLoading, isFetching, isError, refetch } =
    useGetShiftsQuery(queryArgs);
  const { data: employeeWorkedHoursResponse } = useGetEmployeeWorkedHoursQuery(
    {
      userId: employeeId,
      fromDate,
      toDate,
    },
    {
      skip: currentUser?.role !== Role.ADMIN || employeeId === "all",
    },
  );

  const shiftsData = isSuccessResponse(data) ? data.data : undefined;
  const employeeWorkedHours = isSuccessResponse(employeeWorkedHoursResponse)
    ? employeeWorkedHoursResponse.data
    : undefined;
  const shifts = shiftsData?.items ?? [];
  const totalItems = shiftsData?.pagination.total ?? 0;
  const totalPages = shiftsData?.pagination.totalPages ?? 1;
  const workedMinutesOnPage = shifts.reduce((total, shift) => {
    return (
      total +
      getShiftDurationMinutes(shift.clockInAt, shift.clockOutAt, shift.status)
    );
  }, 0);

  function handleEmployeeIdChange(value: string) {
    setEmployeeId(value);
    setPage(1);
  }

  function handleStatusChange(value: ShiftStatus | "ALL") {
    setStatus(value);
    setPage(1);
  }

  function handleSortByChange(value: ShiftSortBy) {
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
    setEmployeeId("all");
    setDateRange(undefined);
    setStatus("ALL");
    setSortBy("clockInAt");
    setSortOrder("DESC");
    setPage(1);
  }

  return (
    <section className="flex flex-col gap-6 py-6">
      <ShiftClockCard />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Shifts</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {totalItems}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Page</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-700">
            {shifts.length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active On Page</p>
          <h3 className="mt-2 text-2xl font-bold text-green-700">
            {shifts.filter((shift) => shift.status === "ACTIVE").length}
          </h3>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            {employeeWorkedHours ? "Selected Employee Hours" : "Worked On Page"}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-700">
            {employeeWorkedHours
              ? formatShiftDuration(employeeWorkedHours.totalMinutes)
              : formatShiftDuration(workedMinutesOnPage)}
          </h3>
        </div>
      </div>

      <ShiftsTableToolbar
        user={currentUser}
        employeeId={employeeId}
        dateRange={dateRange}
        status={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onEmployeeIdChange={handleEmployeeIdChange}
        onStatusChange={handleStatusChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onDateRangeChange={handleDateRangeChange}
        onReset={resetFilters}
      />

      {isError ? (
        <LoadTableError
          title="Failed to load shifts"
          message="An error occurred while fetching shifts. Please try again."
          refetch={refetch}
        />
      ) : (
        <>
          {isFetching && !isLoading && (
            <p className="text-sm text-slate-500">Refreshing shifts...</p>
          )}

          <DataTable
            columns={columns}
            data={shifts}
            isLoading={isLoading}
            noFoundMessage="No shifts found."
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

export default ShiftsPageClient;
