import { ShiftStatus } from "@/types/shift.types";

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
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
