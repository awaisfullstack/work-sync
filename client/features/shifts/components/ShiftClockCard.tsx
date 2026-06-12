"use client";

import { Clock, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/enums";
import { useAppSelector } from "@/store/hooks";
import { formatDateTime } from "@/lib/utils/formatDate";
import { formatApiError } from "@/lib/utils/formatError";
import {
  useClockInMutation,
  useClockOutMutation,
  useGetActiveShiftQuery,
  useGetWeeklyWorkedHoursQuery,
} from "../shiftsApi";
import { formatShiftDuration, getShiftDurationMinutes } from "../utils";

export function ShiftClockCard() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isEmployee = currentUser?.role === Role.EMPLOYEE;

  const { data: activeShiftResponse } = useGetActiveShiftQuery(undefined, {
    skip: !isEmployee,
  });
  const { data: weeklyHoursResponse } = useGetWeeklyWorkedHoursQuery(
    undefined,
    {
      skip: !isEmployee,
    },
  );

  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();

  if (!isEmployee) return null;

  const activeShift = activeShiftResponse?.data ?? null;
  const weeklyHours = weeklyHoursResponse?.data;
  const activeDuration = activeShift
    ? getShiftDurationMinutes(
        activeShift.clockInAt,
        activeShift.clockOutAt,
        activeShift.status,
      )
    : 0;

  async function handleClockIn() {
    try {
      await clockIn().unwrap();
      toast.success("Clock in successful");
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  async function handleClockOut() {
    try {
      await clockOut().unwrap();
      toast.success("Clock out successful");
    } catch (error) {
      toast.error(formatApiError(error));
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Current Shift</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Track your active shift and weekly worked hours.
            </p>
          </div>

          {activeShift ? (
            <Button
              variant="destructive"
              disabled={isClockingOut}
              onClick={handleClockOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isClockingOut ? "Clocking out..." : "Clock Out"}
            </Button>
          ) : (
            <Button disabled={isClockingIn} onClick={handleClockIn}>
              <LogIn className="mr-2 h-4 w-4" />
              {isClockingIn ? "Clocking in..." : "Clock In"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="h-4 w-4" />
              Status
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {activeShift ? "Active" : "Not clocked in"}
            </p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Clock In</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {activeShift ? formatDateTime(activeShift.clockInAt) : "N/A"}
            </p>
            {activeShift && (
              <p className="mt-1 text-sm text-slate-500">
                {formatShiftDuration(activeDuration)} elapsed
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Weekly Hours
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {weeklyHours
                ? formatShiftDuration(weeklyHours.totalMinutes)
                : "0m"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {weeklyHours?.totalHours ?? 0} hours
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
