"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  departmentSchema,
  type DepartmentFormValues,
} from "@/lib/validations/department.schema";
import { formatApiError } from "@/lib/utils/formatError";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../departmentsApi";
import type { Department } from "../departmentTypes";

interface DepartmentFormProps {
  mode: "create" | "update";
  department?: Department;
}

export function DepartmentForm({
  mode,
  department,
}: DepartmentFormProps) {
  const router = useRouter();
  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name ?? "",
    },
  });

  async function onSubmit(values: DepartmentFormValues) {
    try {
      if (mode === "create") {
        await createDepartment(values).unwrap();
        toast.success("Department created successfully");
      }

      if (mode === "update" && department) {
        await updateDepartment({
          id: department.id,
          body: values,
        }).unwrap();
        toast.success("Department updated successfully");
      }

      router.push("/departments");
    } catch (error) {
      const message = formatApiError(error);
      setError("root", {
        message,
      });
      toast.error(message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
    >
      {errors.root?.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="name">Department Name</Label>
        <Input
          id="name"
          placeholder="Engineering"
          {...register("name")}
        />
        {errors.name?.message && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/departments")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Department"
              : "Update Department"}
        </Button>
      </div>
    </form>
  );
}
