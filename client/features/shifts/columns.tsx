"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/lib/utils/formatDate";
import type { Shift } from "./shiftTypes";
import { formatShiftDuration, getShiftDurationMinutes } from "./utils";
import { ShiftStatusBadge } from "./components/ShiftStatusBadge";
import { ShiftRowActions } from "./components/ShiftRowActions";

export const columns: ColumnDef<Shift>[] = [
  {
    accessorKey: "user",
    header: "Employee",
    cell: ({ row }) => {
      const shift = row.original;

      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {shift.user?.name ?? "Unknown User"}
          </p>
          <p className="text-xs text-slate-500">
            {shift.user?.email ?? shift.userId}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ShiftStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "clockInAt",
    header: "Clock In",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-slate-900">
        {formatDateTime(row.original.clockInAt)}
      </p>
    ),
  },
  {
    accessorKey: "clockOutAt",
    header: "Clock Out",
    cell: ({ row }) => {
      const shift = row.original;

      return (
        <p className="text-sm font-medium text-slate-900">
          {shift.status === "ACTIVE"
            ? "In progress"
            : formatDateTime(shift.clockOutAt)}
        </p>
      );
    },
  },
  {
    id: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const shift = row.original;
      const minutes = getShiftDurationMinutes(
        shift.clockInAt,
        shift.clockOutAt,
        shift.status,
      );

      return (
        <p className="text-sm font-medium text-slate-900">
          {formatShiftDuration(minutes)}
        </p>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ShiftRowActions shift={row.original} />,
  },
];
