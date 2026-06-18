import type {
  ActivityAction,
  ActivityEntityType,
} from "@/types/activity-log.types";
import { formatEnumLabel } from "@/lib/utils/label";
import { BadgeVariant } from "@/types";

export const ACTIVITY_ACTIONS = [
  "PROJECT_CREATED",
  "PROJECT_UPDATED",
  "PROJECT_ARCHIVED",
  "PROJECT_MEMBER_ADDED",
  "PROJECT_MEMBER_REMOVED",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_ACTIVATED",
  "USER_DEACTIVATED",
  "USER_DELETED",
  "DEPARTMENT_CREATED",
  "DEPARTMENT_UPDATED",
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
  "SHIFT_MANUAL_CREATED",
  "SHIFT_DELETED",
];

export const ACTIVITY_ENTITY_TYPES = [
  "PROJECT",
  "TASK",
  "TASK_COMMENT",
  "TASK_ASSIGNMENT",
  "SHIFT",
  "USER",
  "DEPARTMENT",
];

export const formatActivityLabel = formatEnumLabel;

export function getActionTone(action: ActivityAction): BadgeVariant {
  if (
    action.includes("DEACTIVATED") ||
    action.includes("DELETED") ||
    action.includes("REMOVED")
  ) {
    return "destructive";
  }

  if (
    action.includes("ACTIVATED") ||
    action.includes("CREATED") ||
    action.includes("ADDED")
  ) {
    return "default";
  }

  if (action.includes("UPDATED") || action.includes("ASSIGNED")) {
    return "secondary";
  }

  return "outline";
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
    case "DEPARTMENT":
      return "border-slate-200 bg-slate-50 text-slate-700";
    default:
      return "";
  }
}
