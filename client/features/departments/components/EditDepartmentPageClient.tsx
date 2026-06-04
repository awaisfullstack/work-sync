"use client";

import FetchByIdError from "@/components/shared/FetchByIdError";
import { isSuccessResponse } from "@/types/api-response";
import { useGetDepartmentByIdQuery } from "../departmentsApi";
import { DepartmentForm } from "./DepartmentForm";

interface EditDepartmentPageClientProps {
  departmentId: string;
}

export function EditDepartmentPageClient({
  departmentId,
}: EditDepartmentPageClientProps) {
  const { data, isLoading, isError, refetch } =
    useGetDepartmentByIdQuery(departmentId);
  const department = isSuccessResponse(data) ? data.data : undefined;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading department...
      </div>
    );
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

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Department
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update department details.
        </p>
      </div>

      <DepartmentForm mode="update" department={department} />
    </section>
  );
}
