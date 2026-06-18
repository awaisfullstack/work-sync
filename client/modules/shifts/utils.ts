import { ShiftStatus } from "@/types/shift.types";
import { formatMinutesDuration } from "@/lib/utils/duration";

export function getShiftDurationMinutes(
  clockInAt: string,
  clockOutAt: string | null,
  status: ShiftStatus,
) {
  const start = new Date(clockInAt).getTime();
  const end =
    status === "ACTIVE" || !clockOutAt
      ? 0
      : new Date(clockOutAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.floor((end - start) / 1000 / 60);
}

export function formatShiftDuration(minutes: number) {
  return formatMinutesDuration(minutes);
}
