"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DataTable } from "@/components/common/data-table";
import LoadTableError from "@/components/common/LoadTableError";
import { TablePagination } from "@/components/common/TablePagination";
import { Role } from "@/types/auth.types";
import { useAppSelector } from "@/store/hooks";
import { columns } from "../columns";
import {
  useGetAllActiveShiftsQuery,
  useGetAllEmployeesWorkedHoursQuery,
  useGetEmployeeWorkedHoursQuery,
  useGetMyWorkedHoursQuery,
  useGetShiftsQuery,
} from "@/store/api/shiftsApi";
import type { ShiftSortBy, ShiftStatus, SortOrder } from "@/types/shift.types";
import { formatShiftDuration } from "../utils";
import { ShiftClockCard } from "./ShiftClockCard";
import { ShiftsTableToolbar } from "./ShiftsTableToolbar";
import { formatDateInputValue } from "@/lib/utils/dateInput";

const ShiftsPageClient = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === Role.ADMIN;

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [employeeId, setEmployeeId] = useState("all");
  const [status, setStatus] = useState<ShiftStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<ShiftSortBy>("clockInAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const fromDate = formatDateInputValue(dateRange?.from);
  const toDate = formatDateInputValue(dateRange?.to);

  const queryArgs = {
    page,
    limit,
    userId: employeeId === "all" ? undefined : employeeId,
    status: status === "ALL" ? undefined : status,
    sortBy,
    sortOrder,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useGetShiftsQuery(queryArgs);

  const { data: allActiveShiftsResponse } = useGetAllActiveShiftsQuery(
    undefined,
    {
      skip: !isAdmin,
    },
  );

  const { data: employeeWorkedHoursResponse } = useGetEmployeeWorkedHoursQuery(
    {
      userId: employeeId,
    },
    {
      skip: !isAdmin || employeeId === "all",
    },
  );
  const { data: allEmployeesWorkedHoursResponse } =
    useGetAllEmployeesWorkedHoursQuery(undefined, {
      skip: !isAdmin || employeeId !== "all",
    });
  const { data: myWorkedHoursResponse } = useGetMyWorkedHoursQuery(undefined, {
    skip: isAdmin,
  });

  const shiftsData = data?.data;
  const totalActiveShifts = allActiveShiftsResponse?.data.totalActiveShifts;
  const employeeWorkedHours = employeeWorkedHoursResponse?.data;
  const allEmployeesWorkedHours = allEmployeesWorkedHoursResponse?.data;
  const myWorkedHours = myWorkedHoursResponse?.data;
  const shifts = shiftsData?.items ?? [];
  const totalItems = shiftsData?.pagination.total ?? 0;
  const totalPages = shiftsData?.pagination.totalPages ?? 1;
  const workedHoursMinutes = isAdmin
    ? employeeId === "all"
      ? (allEmployeesWorkedHours?.totalMinutes ?? 0)
      : (employeeWorkedHours?.totalMinutes ?? 0)
    : (myWorkedHours?.totalMinutes ?? 0);

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
      {isAdmin && (
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
            <p className="text-sm text-slate-500">Active Shifts</p>
            <h3 className="mt-2 text-2xl font-bold text-green-700">
              {totalActiveShifts}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              {isAdmin && employeeId === "all"
                ? "All Employees Total Hours"
                : "Selected Employee Total Hours"}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-700">
              {formatShiftDuration(workedHoursMinutes)}
            </h3>
          </div>
        </div>
      )}
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
