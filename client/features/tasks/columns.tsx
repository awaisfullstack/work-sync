"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { TaskStatusBadge } from "./components/TaskStatusBadge";
import { Task } from "./taskTypes";
import { TaskRowActions } from "./components/TaskRowActions";
import { formatDate, getDeadlineStatus } from "@/lib/utils/formatDate";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <div>
        <Link
          href={`/tasks/${task.id}`}
          className="font-medium text-slate-900 hover:text-blue-700"
        >
          {task.title}
        </Link>

        <p className="mt-1 truncate max-w-[300px] text-sm text-slate-500">
          {task.description}
        </p>
      </div>
      );
    },
  },
  {
    accessorKey: "projectId",
    header: "Project",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {row.original.project?.title ?? "Unknown Project"}
          </p>
        </div>
      );
    },
  },
   {
    accessorKey: "creator",
    header: "Created By",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {row.original.creator?.name ?? "Unknown"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TaskStatusBadge status={row.original.status.name} />,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const deadline = row.original.dueDate ?? "";
      const deadlineStatus = getDeadlineStatus(deadline);

      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {formatDate(deadline)}
          </p>

          <p
            className={
              deadlineStatus.variant === "danger"
                ? "text-xs text-red-600"
                : deadlineStatus.variant === "warning"
                  ? "text-xs text-amber-600"
                  : "text-xs text-slate-500"
            }
          >
            {deadlineStatus.label}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TaskRowActions task={row.original} />,
  }, 
];
