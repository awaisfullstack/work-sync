"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, Clock, Pencil } from "lucide-react";

import FetchByIdError from "@/components/shared/FetchByIdError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/constants";
import { formatDate, formatDateTime } from "@/lib/utils/formatDate";
import { useAppSelector } from "@/store/hooks";
import { isSuccessResponse } from "@/types/api-response";
import { useGetDepartmentByIdQuery } from "../departmentsApi";
import { DepartmentViewSkeleton } from "./DepartmentViewSkeleton";

interface DepartmentViewPageClientProps {
  departmentId: string;
}

export default function DepartmentViewPageClient({
  departmentId,
}: DepartmentViewPageClientProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetDepartmentByIdQuery(departmentId, {
      skip: !departmentId,
    });

  const department = isSuccessResponse(data) ? data.data : undefined;

  if (isLoading || isFetching) {
    return <DepartmentViewSkeleton />;
  }

  if (isError || !department) {
    return (
      <FetchByIdError
        title="Department not found"
        message="This department does not exist or you do not have permission to access it."
        refetch={refetch}
        backLink="/departments"
        backLinkText="Back to departments"
      />
    );
  }

  const canManage = currentUser?.role === Role.ADMIN;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/departments">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to departments</span>
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Department Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View department information and audit dates.
            </p>
          </div>
        </div>

        {canManage && (
          <Button variant="outline" asChild>
            <Link href={`/departments/${department.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Department
            </Link>
          </Button>
        )}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <CardTitle className="text-2xl">{department.name}</CardTitle>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Department profile and system timestamps.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <DetailTile
              icon={<Building2 className="h-4 w-4" />}
              label="Department"
              value={department.name}
            />

            <DetailTile
              icon={<CalendarDays className="h-4 w-4" />}
              label="Created"
              value={formatDate(department.createdAt)}
              description={formatDateTime(department.createdAt)}
            />

            <DetailTile
              icon={<Clock className="h-4 w-4" />}
              label="Last Updated"
              value={formatDate(department.updatedAt)}
              description={formatDateTime(department.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function DetailTile({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  description?: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-lg font-semibold text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}
