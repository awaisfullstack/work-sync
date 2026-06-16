"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { formatDate } from "@/lib/utils/formatDate";
import { DepartmentRowActions } from "./components/DepartmentRowActions";
import type { Department } from "@/types/department.types";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Department",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <Link
          href={`/departments/${department.id}`}
          className="font-medium text-slate-900 hover:text-blue-700"
        >
          {department.name}
        </Link>
      );
    },
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
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-slate-900">
        {formatDate(row.original.updatedAt)}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DepartmentRowActions department={row.original} />,
  },
];
