import { TaskStatus } from "@/features/tasks/taskTypes";
import { format } from "date-fns";

export function formatDate(date?: string | Date | null) {
  if (!date) return "N/A";

  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date?: string | Date | null) {
  if (!date) return "N/A";

  return format(new Date(date), "MMM dd, yyyy hh:mm a");
}

export function isOverdue(date: string, status: TaskStatus) {
  if (status === "COMPLETED") return false;

  return new Date(date).getTime() < Date.now();
}