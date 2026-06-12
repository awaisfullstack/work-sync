"use client";

import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/enums";
import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import type { ShiftSortBy, ShiftStatus, SortOrder } from "../shiftTypes";
import type { AuthUser } from "@/features/auth/authTypes";

interface ShiftsTableToolbarProps {
  user: AuthUser | null;
  employeeId: string;
  status: ShiftStatus | "ALL";
  sortBy: ShiftSortBy;
  sortOrder: SortOrder;
  dateRange?: DateRange;
  onEmployeeIdChange: (value: string) => void;
  onStatusChange: (value: ShiftStatus | "ALL") => void;
  onSortByChange: (value: ShiftSortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onReset: () => void;
}

export function ShiftsTableToolbar({
  user,
  employeeId,
  status,
  sortBy,
  sortOrder,
  dateRange,
  onEmployeeIdChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
  onDateRangeChange,
  onReset,
}: ShiftsTableToolbarProps) {
  const isAdmin = user?.role === Role.ADMIN;
  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery(undefined, {
      skip: !isAdmin,
    });

  const users = usersResponse?.data ?? [];
  const hasFilters =
    dateRange !== undefined ||
    status !== "ALL" ||
    employeeId !== "all" ||
    sortBy !== "clockInAt" ||
    sortOrder !== "DESC";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
      <div className="min-w-0 xl:max-w-sm">
        <p className="text-sm font-medium text-slate-900">Shift Records</p>
        <p className="mt-1 text-sm text-slate-500">
          Filter shifts by employee, status, date range, and order.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:w-auto xl:flex-wrap xl:items-center xl:justify-end">
        {isAdmin && (
          <Select
            disabled={isUsersLoading}
            value={employeeId}
            onValueChange={onEmployeeIdChange}
          >
            <SelectTrigger className="w-full xl:w-[220px]">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {users.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="clockInAt">Clock In</SelectItem>
            <SelectItem value="clockOutAt">Clock Out</SelectItem>
            <SelectItem value="createdAt">Created</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full xl:w-[150px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="DESC">Descending</SelectItem>
            <SelectItem value="ASC">Ascending</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full sm:col-span-2 lg:col-span-1 xl:w-[260px]"
          placeholder="Filter by shift date"
        />

        {hasFilters && (
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:col-span-2 lg:col-span-1 xl:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
