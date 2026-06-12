import type { Role } from "@/enums";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type TaskSortBy = "createdAt" | "updatedAt" | "dueDate" | "title";

export type SortOrder = "ASC" | "DESC";

export interface Status {
  id: string;
  name: TaskStatus;
}

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;

  user?: TaskUser;
}

export interface TaskStatusHistory {
  id: string;
  taskId: string;
  status: TaskStatus;
  createdAt: string;

  changedBy?: TaskUser;
}

export interface TaskProjectSummary {
  id: string;
  title: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  unassignedAt?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  dueDate: string;
  projectId?: string;
  project: TaskProjectSummary;
  assignments?: TaskAssignment[];
  creator: TaskUser;
  createdAt: string;
  updatedAt: string;

  comments?: TaskComment[];
  statusHistory?: TaskStatusHistory[];
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
  status?: TaskStatus | "";
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
  projectId: string;
  assignedUserId?: string;
}

export interface CreateTaskCommentRequest {
  taskId: string;
  comment: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusPayload {
  id: string;
  status: TaskStatus;
}

export interface AssignTaskPayload {
  id: string;
  userId: string;
}
