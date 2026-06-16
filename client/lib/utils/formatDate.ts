import { TaskStatus } from "@/types/task.types";
import { GetDeadlineStatus } from "@/types";
import { format } from "date-fns";

export function formatDate2(date?: string | Date | null) {
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

export function formatDate(date: string | null) {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function getDeadlineStatus(deadline: string | null): GetDeadlineStatus {
  if (!deadline) {
    return {
      label: `No deadline provided`,
      variant: "default",
    };
  }
  const now = new Date();
  const deadlineDate = new Date(deadline);

  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert into days numbers like (2,3,4)

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)} days overdue`,
      variant: "danger",
    };
  }

  if (diffDays === 0) {
    return {
      label: "Due today",
      variant: "warning",
    };
  }

  return {
    label: `${diffDays} days left`,
    variant: "default",
  };
}
