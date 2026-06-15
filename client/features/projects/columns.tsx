"use client";

import { ProjectRowActions } from "@/features/projects/components/ProjectRowActions";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import type { Project } from "@/features/projects/projectTypes";
import {
  formatDate,
  formatDate2,
  getDeadlineStatus,
} from "@/lib/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="font-medium text-slate-900 hover:text-blue-700"
          >
            {project.title}
          </Link>
          {project.description && (
            <p className="mt-1 truncate max-w-[300px] text-sm text-slate-500">
              {project.description}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ProjectStatusBadge status={row.original.status} />,
  },
  {
    id: "members",
    header: "Members",
    cell: ({ row }) => {
      const membersCount = Number(row.original.membersCount) ?? 0;

      return (
        <span className="text-sm text-slate-700">
          {membersCount} {membersCount === 1 ? "member" : "members"}
        </span>
      );
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      const deadline = row.original.deadline ?? "";
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
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-sm font-medium text-slate-900">
            {row.original.createdBy?.name ?? "Unknown"}
          </p>
          <p className="text-xs text-slate-500">
            {formatDate2(row.original.createdAt)}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ProjectRowActions project={row.original} />,
  },
];
