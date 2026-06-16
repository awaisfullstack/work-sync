"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatDateTime } from "@/lib/utils/formatDate";
import type { ActivityLog } from "@/types/activity-log.types";
import { ActivityActionBadge } from "./components/ActivityActionBadge";
import { ActivityEntityBadge } from "./components/ActivityEntityBadge";

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "message",
    header: "Activity",
    cell: ({ row }) => {
      const log = row.original;

      return (
        <div className="max-w-[720px]">
          <p className="font-medium text-slate-900">{log.message}</p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {log.entityId ? `Entity ID: ${log.entityId}` : "System event"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: ({ row }) => {
      const actor = row.original.actor;

      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {actor?.name ?? "System"}
          </p>
          <p className="text-xs text-slate-500">
            {actor?.email ?? "No actor attached"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <ActivityActionBadge action={row.original.action} />,
  },
  {
    accessorKey: "entityType",
    header: "Entity",
    cell: ({ row }) => (
      <ActivityEntityBadge entityType={row.original.entityType} />
    ),
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {project?.title ?? "No project"}
          </p>
          <p className="text-xs text-slate-500">
            {project?.status ?? "Not linked"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Logged At",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-slate-900">
        {formatDateTime(row.original.createdAt)}
      </p>
    ),
  },
];
