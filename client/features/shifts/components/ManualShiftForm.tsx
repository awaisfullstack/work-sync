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
import { useGetUserOptionsQuery } from "@/features/users/usersApi";
import { formatApiError } from "@/lib/utils/formatError";
import {
  manualShiftSchema,
  type ManualShiftFormValues,
} from "@/lib/validations/shift.schema";
import { isSuccessResponse } from "@/types/api-response";
import { useCreateManualShiftMutation } from "../shiftsApi";

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}

export function ManualShiftForm() {
  const router = useRouter();
  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery();
  const [createManualShift, { isLoading: isCreating }] =
    useCreateManualShiftMutation();

  const employees = isSuccessResponse(usersResponse)
    ? (usersResponse.data ?? [])
    : [];

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ManualShiftFormValues>({
    resolver: zodResolver(manualShiftSchema),
    defaultValues: {
      userId: "",
      clockInAt: "",
      clockOutAt: "",
    },
  });

  async function onSubmit(values: ManualShiftFormValues) {
    try {
      await createManualShift({
        userId: values.userId,
        clockInAt: toIsoDateTime(values.clockInAt),
        clockOutAt: toIsoDateTime(values.clockOutAt),
      }).unwrap();

      toast.success("Manual shift created successfully");
      router.push("/shifts");
    } catch (error) {
      const message = formatApiError(error);
      setError("root", { message });
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
        <Label>Employee</Label>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isCreating || isUsersLoading}
            >
              <SelectTrigger className="w-full" onBlur={field.onBlur}>
                <SelectValue
                  placeholder={
                    isUsersLoading ? "Loading employees..." : "Select employee"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.userId?.message && (
          <p className="text-sm text-red-600">{errors.userId.message}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="clockInAt">Clock In</Label>
          <Input
            id="clockInAt"
            type="datetime-local"
            disabled={isCreating}
            {...register("clockInAt")}
          />
          {errors.clockInAt?.message && (
            <p className="text-sm text-red-600">
              {errors.clockInAt.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="clockOutAt">Clock Out</Label>
          <Input
            id="clockOutAt"
            type="datetime-local"
            disabled={isCreating}
            {...register("clockOutAt")}
          />
          {errors.clockOutAt?.message && (
            <p className="text-sm text-red-600">
              {errors.clockOutAt.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/shifts")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Shift"}
        </Button>
      </div>
    </form>
  );
}
