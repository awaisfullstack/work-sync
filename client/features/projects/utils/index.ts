import { ProjectStatus } from "../projectTypes";

export function formatProjectDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function getDeadlineStatus(deadline: string) {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)} days overdue`,
      variant: "danger" as const,
    };
  }

  if (diffDays === 0) {
    return {
      label: "Due today",
      variant: "warning" as const,
    };
  }

  return {
    label: `${diffDays} days left`,
    variant: "default" as const,
  };
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return ["ACTIVE", "COMPLETED", "ARCHIVED"].includes(value);
}