"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import { logFrontendError } from "@/lib/logger/frontendLogger";
import { logFormValidationIssue } from "@/lib/logger/formValidationLogger";
import { formatApiError } from "@/lib/utils/formatError";
import {
  manualShiftSchema,
  type ManualShiftFormValues,
} from "@/lib/validations/shift.schema";
import { useCreateManualShiftMutation } from "../shiftsApi";

function parseDateInputValue(value?: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function formatDateInputValue(date?: Date) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toIsoDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

export function ManualShiftForm() {
  const router = useRouter();
  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetUserOptionsQuery();
  const [createManualShift, { isLoading: isCreating }] =
    useCreateManualShiftMutation();

  const employees = usersResponse?.data ?? [];

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
      clockInDate: "",
      clockInTime: "",
      clockOutDate: "",
      clockOutTime: "",
    },
  });

  async function onSubmit(values: ManualShiftFormValues) {
    try {
      await createManualShift({
        userId: values.userId,
        clockInAt: toIsoDateTime(values.clockInDate, values.clockInTime),
        clockOutAt: toIsoDateTime(values.clockOutDate, values.clockOutTime),
      }).unwrap();

      toast.success("Manual shift created successfully");
      router.push("/shifts");
    } catch (error) {
      const message = formatApiError(error);
      void logFrontendError("Manual shift form submit error", error, {
        source: "shifts.manual.form.submit",
        metadata: {
          userId: values.userId,
          message,
        },
      });
      setError("root", { message });
      toast.error(message);
    }
  }

  function onInvalid(errors: FieldErrors<ManualShiftFormValues>) {
    void logFormValidationIssue(
      "Manual shift",
      errors,
      "shifts.manual.form.validation",
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
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
          <Label>Clock In Date</Label>
          <Controller
            name="clockInDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={parseDateInputValue(field.value)}
                onChange={(date) => field.onChange(formatDateInputValue(date))}
                onBlur={field.onBlur}
                disabled={isCreating}
                placeholder="Select clock in date"
                triggerClassName="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              />
            )}
          />
          {errors.clockInDate?.message && (
            <p className="text-sm text-red-600">
              {errors.clockInDate.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="clockInTime">Clock In Time</Label>
          <Input
            id="clockInTime"
            type="time"
            disabled={isCreating}
            {...register("clockInTime")}
          />
          {errors.clockInTime?.message && (
            <p className="text-sm text-red-600">
              {errors.clockInTime.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Clock Out Date</Label>
          <Controller
            name="clockOutDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={parseDateInputValue(field.value)}
                onChange={(date) => field.onChange(formatDateInputValue(date))}
                onBlur={field.onBlur}
                disabled={isCreating}
                placeholder="Select clock out date"
                triggerClassName="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              />
            )}
          />
          {errors.clockOutDate?.message && (
            <p className="text-sm text-red-600">
              {errors.clockOutDate.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="clockOutTime">Clock Out Time</Label>
          <Input
            id="clockOutTime"
            type="time"
            disabled={isCreating}
            {...register("clockOutTime")}
          />
          {errors.clockOutTime?.message && (
            <p className="text-sm text-red-600">
              {errors.clockOutTime.message}
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
