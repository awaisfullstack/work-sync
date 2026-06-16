"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { formatDate } from "@/lib/utils/formatDate";
import { RoleBadge } from "./components/RoleBadge";
import { UserRowActions } from "./components/UserRowActions";
import { UserStatusBadge } from "./components/UserStatusBadge";
import type { User } from "@/types/user.types";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div>
          <Link
            href={`/users/${user.id}`}
            className="font-medium text-slate-900 hover:text-blue-700"
          >
            {user.name}
          </Link>

          <p className="mt-1 truncate max-w-[300px] text-sm text-slate-500">
            {user.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <UserStatusBadge isActive={row.original.isActive} />,
  },
  {
    accessorKey: "departmentId",
    header: "Department",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">
        {row.original.department?.name ?? "No department"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-slate-900">
        {formatDate(row.original.createdAt)}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
