import type { ProjectStatus } from "@/types/project.types";
import type { Role } from "@/types/auth.types";

export enum ActivityAction {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_ARCHIVED = 'PROJECT_ARCHIVED',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
  PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED',

  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UNASSIGNED = 'TASK_UNASSIGNED',
  TASK_COMMENT_ADDED = 'TASK_COMMENT_ADDED',
  TASK_COMMENT_DELETED = 'TASK_COMMENT_DELETED',

  SHIFT_CLOCKED_IN = 'SHIFT_CLOCKED_IN',
  SHIFT_CLOCKED_OUT = 'SHIFT_CLOCKED_OUT',
}

export enum ActivityEntityType {
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  TASK_COMMENT = 'TASK_COMMENT',
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
  SHIFT = 'SHIFT',
  USER = 'USER',
}

export type ActivitySortBy = "createdAt" | "updatedAt";
export type SortOrder = "ASC" | "DESC";

export interface ActivityActor {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ActivityProject {
  id: string;
  title: string;
  status: ProjectStatus;
}

export interface ActivityLog {
  id: string;
  actorId: string | null;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string | null;
  projectId: string | null;
  message: string;
  metadata: Record<string, unknown> | null;
  actor?: ActivityActor | null;
  project?: ActivityProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogsQuery {
  page?: number;
  limit?: number;
  action?: ActivityAction;
  entityType?: ActivityEntityType;
  actorId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: ActivitySortBy;
  sortOrder?: SortOrder;
}
