import type { ActivityAction, ActivityEntityType } from "./activityLogTypes";

export const ACTIVITY_ACTIONS = [
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_ARCHIVED",
  "PROJECT_MEMBER_ADDED",
  "PROJECT_MEMBER_REMOVED",
  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_DELETED",
  "TASK_STATUS_UPDATED",
  "TASK_ASSIGNED",
  "TASK_UNASSIGNED",
  "TASK_COMMENT_ADDED",
  "TASK_COMMENT_DELETED",
  "SHIFT_CLOCKED_IN",
  "SHIFT_CLOCKED_OUT",
];

export const ACTIVITY_ENTITY_TYPES = [
  "PROJECT",
  "TASK",
  "TASK_COMMENT",
  "TASK_ASSIGNMENT",
  "SHIFT",
  "USER",
];

export function formatActivityLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function getActionTone(action: ActivityAction) {
  if (action.includes("DELETED") || action.includes("REMOVED")) {
    return "destructive" as const;
  }

  if (action.includes("CREATED") || action.includes("ADDED")) {
    return "default" as const;
  }

  if (action.includes("UPDATED") || action.includes("ASSIGNED")) {
    return "secondary" as const;
  }

  return "outline" as const;
}

export function getEntityClassName(entityType: ActivityEntityType) {
  switch (entityType) {
    case "PROJECT":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "TASK":
    case "TASK_ASSIGNMENT":
    case "TASK_COMMENT":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "SHIFT":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "USER":
      return "border-slate-200 bg-slate-50 text-slate-700";
    default:
      return "";
  }
}
