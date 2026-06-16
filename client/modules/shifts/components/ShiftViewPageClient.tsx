"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  LogIn,
  LogOut,
  Timer,
  UserRound,
} from "lucide-react";

import FetchByIdError from "@/components/common/FetchByIdError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils/formatDate";
import { useGetShiftByIdQuery } from "@/store/api/shiftsApi";
import { formatShiftDuration, getShiftDurationMinutes } from "../utils";
import { ShiftStatusBadge } from "./ShiftStatusBadge";

interface ShiftViewPageClientProps {
  shiftId: string;
}

export default function ShiftViewPageClient({
  shiftId,
}: ShiftViewPageClientProps) {
  const { data, isLoading, isError, refetch } = useGetShiftByIdQuery(shiftId);
  const shift = data?.data;

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading shift...
      </div>
    );
  }

  if (isError || !shift) {
    return (
      <FetchByIdError
        title="Shift not found"
        message="This shift does not exist or you do not have permission to access it."
        refetch={refetch}
        backLink="/shifts"
        backLinkText="Back to shifts"
      />
    );
  }

  const durationMinutes = getShiftDurationMinutes(
    shift.clockInAt,
    shift.clockOutAt,
    shift.status,
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/shifts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to shifts</span>
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shift Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View clock-in, clock-out, employee, and duration information.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <CardTitle className="text-2xl">
                {shift.user?.name ?? "Unknown User"}
              </CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {shift.user?.email ?? shift.userId}
              </p>
            </div>

            <ShiftStatusBadge status={shift.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserRound className="h-4 w-4" />
                Employee
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {shift.user?.name ?? "Unknown User"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {shift.user?.role ?? "Employee"}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <LogIn className="h-4 w-4" />
                Clock In
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatDateTime(shift.clockInAt)}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <LogOut className="h-4 w-4" />
                Clock Out
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {shift.status === "ACTIVE"
                  ? "In progress"
                  : formatDateTime(shift.clockOutAt)}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Timer className="h-4 w-4" />
                Duration
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {formatShiftDuration(durationMinutes)}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                Created {formatDateTime(shift.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
