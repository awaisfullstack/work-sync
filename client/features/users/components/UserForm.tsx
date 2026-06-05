"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/features/auth/authTypes";
import { useGetDepartmentQuery } from "@/features/departments/departmentsApi";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/lib/validations/user.schema";
import { formatApiError } from "@/lib/utils/formatError";
import { isSuccessResponse } from "@/types/api-response";
import { useCreateUserMutation, useUpdateUserMutation } from "../usersApi";
import type { User } from "../userTypes";

interface UserFormProps {
  mode: "create" | "update";
  user?: User;
}

type UserFormFields = CreateUserFormValues | UpdateUserFormValues;

export function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDepartmentQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const departments = isSuccessResponse(departmentsData)
    ? (departmentsData.data ?? [])
    : [];
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormFields>({
    resolver: zodResolver(
      mode === "create" ? createUserSchema : updateUserSchema,
    ),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "EMPLOYEE",
      departmentId: user?.department?.id ?? null,
    },
  });

  async function onSubmit(values: UserFormFields) {
    try {
      if (mode === "create") {
        await createUser(values as CreateUserFormValues).unwrap();
        toast.success("User created successfully");
      }

      if (mode === "update" && user) {
        await updateUser({
          id: user.id,
          body: {
            name: values.name,
            email: values.email,
            role: values.role,
            departmentId: values.departmentId,
          },
        }).unwrap();
        toast.success("User updated successfully");
      }

      router.push("/users");
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Jane Cooper" {...register("name")} />
        {errors.name?.message && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {mode === "create" && (
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid w-full gap-2">
          <Label>Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as UserRole)}
              >
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role?.message && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div className="grid w-full gap-2">
          <Label>Department</Label>
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isLoadingDepartments}
                value={field.value ?? "NONE"}
                onValueChange={(value) =>
                  field.onChange(value === "NONE" ? null : value)
                }
              >
                <SelectTrigger className="w-auto" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="NONE">No Department</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.departmentId?.message && (
            <p className="text-sm text-red-600">
              {errors.departmentId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/users")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create User"
              : "Update User"}
        </Button>
      </div>
    </form>
  );
}
